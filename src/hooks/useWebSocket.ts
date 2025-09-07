import { useEffect, useRef, useState, useCallback } from 'react';
import { useUser } from '@/store/AppContext';
import { useToast } from '@/store/ToastContext';
import type { WebSocketMessage, BidUpdateMessage, AuctionEndMessage } from '@/types/api';

interface UseWebSocketOptions {
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onBidUpdate?: (data: BidUpdateMessage) => void;
  onAuctionEnd?: (data: AuctionEndMessage) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    onBidUpdate,
    onAuctionEnd,
  } = options;

  const [user] = useUser();
  const { showInfo, showSuccess, showError } = useToast();
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // 개발 모드에서는 WebSocket 연결 시뮬레이션
    if (import.meta.env.DEV) {
      setConnectionStatus('connecting');
      
      // 실제 WebSocket 연결 대신 시뮬레이션
      setTimeout(() => {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        
        // 토스트는 한 번만 표시하도록 제한
        if (!wsRef.current) {
          showInfo('개발 모드', '실시간 기능이 시뮬레이션 모드로 작동합니다.');
        }
        
        // 개발 모드에서는 주기적으로 더미 업데이트 전송
        const interval = setInterval(() => {
          if (onBidUpdate && Math.random() > 0.8) { // 더 낮은 확률로 변경
            const itemIds = ['item-001', 'item-003', 'item-005'];
            const randomItemId = itemIds[Math.floor(Math.random() * itemIds.length)];
            onBidUpdate({
              type: 'bid_update',
              itemId: randomItemId,
              newBid: Math.floor(Math.random() * 500) + 1500,
              bidderName: 'Anonymous',
              timestamp: Date.now(),
            });
          }
        }, 15000); // 15초마다

        // 클린업을 위해 참조 저장
        (wsRef.current as any) = { interval, isDev: true };
      }, 500); // 연결 시간을 줄임
      
      return;
    }

    // 실제 WebSocket 연결 (프로덕션)
    try {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      setConnectionStatus('connecting');

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        
        // 인증된 사용자라면 JWT 토큰 전송
        if (user?.isAuthenticated) {
          const token = localStorage.getItem('bidswap_token');
          if (token) {
            ws.send(JSON.stringify({
              type: 'auth',
              token: token
            }));
          }
        }
        
        showInfo('실시간 연결', '실시간 경매 업데이트가 활성화되었습니다.');
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'bid_update':
              onBidUpdate?.(message as BidUpdateMessage);
              break;
            case 'auction_end':
              onAuctionEnd?.(message as AuctionEndMessage);
              showSuccess('경매 종료', `${message.itemName} 경매가 종료되었습니다.`);
              break;
            case 'error':
              showError('WebSocket 오류', message.message || '알 수 없는 오류가 발생했습니다.');
              break;
            default:
              console.log('Unknown WebSocket message:', message);
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        if (event.code !== 1000) { // 비정상 종료
          scheduleReconnect();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
        scheduleReconnect();
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
      setConnectionStatus('error');
      scheduleReconnect();
    }
  }, [user, showInfo, showSuccess, showError, onBidUpdate, onAuctionEnd]);

  const scheduleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      showError('연결 실패', '실시간 연결에 실패했습니다. 페이지를 새로고침해주세요.');
      return;
    }

    reconnectAttemptsRef.current += 1;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`WebSocket reconnect attempt ${reconnectAttemptsRef.current}`);
      connect();
    }, reconnectInterval);
  }, [connect, reconnectInterval, maxReconnectAttempts, showError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (import.meta.env.DEV && (wsRef.current as any)?.interval) {
      clearInterval((wsRef.current as any).interval);
    }

    if (wsRef.current) {
      wsRef.current.close(1000); // Normal closure
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
    reconnectAttemptsRef.current = 0;
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // 사용자 로그인 상태 변경 시 연결 관리
  useEffect(() => {
    if (user?.isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user?.isAuthenticated, connect, disconnect]);

  return {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
  };
}

// 특정 아이템의 실시간 업데이트를 구독하는 훅
export function useItemRealTimeUpdates(itemId: string) {
  const [currentBid, setCurrentBid] = useState<number | null>(null);
  const [bidCount, setBidCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const handleBidUpdate = useCallback((data: BidUpdateMessage) => {
    if (data.itemId === itemId) {
      setCurrentBid(data.newBid);
      setBidCount(prev => prev + 1);
    }
  }, [itemId]);

  const handleAuctionEnd = useCallback((data: AuctionEndMessage) => {
    if (data.itemId === itemId) {
      setTimeLeft('Ended');
    }
  }, [itemId]);

  const { isConnected, connectionStatus, sendMessage } = useWebSocket({
    onBidUpdate: handleBidUpdate,
    onAuctionEnd: handleAuctionEnd,
  });

  const placeBid = useCallback((bidAmount: number) => {
    sendMessage({
      type: 'place_bid',
      itemId,
      bidAmount,
      timestamp: Date.now(),
    });
  }, [itemId, sendMessage]);

  return {
    currentBid,
    bidCount,
    timeLeft,
    isConnected,
    connectionStatus,
    placeBid,
  };
}