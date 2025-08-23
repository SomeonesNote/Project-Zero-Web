import React, { useState, useEffect } from 'react';
import { DESIGN_TOKENS, commonStyles } from '@/constants/design-tokens';
import Button from '@/components/ui/Button';
import { useItemRealTimeUpdates } from '@/hooks/useWebSocket';
import { useToast } from '@/store/ToastContext';
import { useUser } from '@/store/AppContext';

interface RealTimeItemCardProps {
  item: {
    id: string;
    name: string;
    title?: string;
    imageUrl?: string;
    image?: string;
    currentBid: number;
    price?: number;
    timeLeft?: string;
    endTime?: string;
  };
  onItemClick?: (item: any) => void;
  onBidClick?: (item: any) => void;
  showRealTimeUpdates?: boolean;
}

const RealTimeItemCard: React.FC<RealTimeItemCardProps> = ({
  item,
  onItemClick,
  onBidClick,
  showRealTimeUpdates = true
}) => {
  const [user] = useUser();
  const { showSuccess, showError } = useToast();
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  
  // 실시간 업데이트 훅
  const {
    currentBid: realTimeBid,
    bidCount,
    timeLeft: realTimeTimeLeft,
    isConnected,
    connectionStatus,
    placeBid
  } = useItemRealTimeUpdates(item.id);

  // 시간 남은 계산 함수
  const calculateTimeLeft = (endTime: string): string => {
    if (!endTime) return '';
    
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // 현재 입찰가 결정 (실시간 업데이트가 있으면 그것을 사용, 없으면 초기값)
  const displayBid = showRealTimeUpdates && realTimeBid !== null 
    ? realTimeBid 
    : (item.currentBid || item.price || 0);

  const displayTimeLeft = showRealTimeUpdates && realTimeTimeLeft 
    ? realTimeTimeLeft 
    : (item.timeLeft || (item.endTime ? calculateTimeLeft(item.endTime) : ''));

  const displayTitle = item.name || item.title || 'Untitled Item';
  const displayImage = item.imageUrl || item.image || (item.images && item.images[0]) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVIMjI1VjEyNUgxNzVWNzVaIiBmaWxsPSIjOUI5Q0EwIi8+CjxwYXRoIGQ9Ik0yMDAgMTAwTDE4NSAxMTVIMjE1TDIwMCAxMDBaIiBmaWxsPSIjNjg3MDc2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjg3MDc2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';

  const handleQuickBid = async () => {
    if (!user?.isAuthenticated) {
      showError('로그인 필요', '입찰하려면 로그인해주세요.');
      return;
    }

    if (!isConnected && showRealTimeUpdates) {
      showError('연결 오류', '실시간 연결이 필요합니다.');
      return;
    }

    setIsPlacingBid(true);
    
    try {
      const nextBidAmount = displayBid + 50; // 50달러씩 증가
      
      if (showRealTimeUpdates) {
        // WebSocket을 통한 실시간 입찰
        placeBid(nextBidAmount);
        showSuccess('입찰 완료', `$${nextBidAmount.toLocaleString()}로 입찰했습니다.`);
      } else {
        // 기존 방식 (API 호출)
        // 여기서 실제 API 호출을 할 수 있습니다
        showSuccess('입찰 완료', `$${nextBidAmount.toLocaleString()}로 입찰했습니다.`);
      }
    } catch (error) {
      showError('입찰 실패', '입찰 중 오류가 발생했습니다.');
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleCardClick = () => {
    onItemClick?.(item);
  };

  return (
    <div 
      style={{ 
        flex: '0 0 auto',
        width: '280px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: DESIGN_TOKENS.colors.white,
        border: `1px solid ${DESIGN_TOKENS.colors.border}`,
        borderRadius: DESIGN_TOKENS.layout.borderRadius.lg,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: DESIGN_TOKENS.layout.transitions.normal,
        position: 'relative'
      }}
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* 실시간 연결 상태 표시 */}
      {showRealTimeUpdates && (
        <div style={{
          position: 'absolute',
          top: DESIGN_TOKENS.spacing.sm,
          right: DESIGN_TOKENS.spacing.sm,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: DESIGN_TOKENS.spacing.xs,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: `${DESIGN_TOKENS.spacing.xs} ${DESIGN_TOKENS.spacing.sm}`,
          borderRadius: DESIGN_TOKENS.layout.borderRadius.full,
          fontSize: DESIGN_TOKENS.fontSizes.xs,
          fontWeight: DESIGN_TOKENS.fontWeights.medium
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isConnected ? DESIGN_TOKENS.colors.success : DESIGN_TOKENS.colors.error
          }} />
          <span style={{
            color: isConnected ? DESIGN_TOKENS.colors.success : DESIGN_TOKENS.colors.error
          }}>
            {isConnected ? 'LIVE' : (import.meta.env.DEV ? 'DEV' : 'OFFLINE')}
          </span>
        </div>
      )}

      {/* 이미지 */}
      <div style={{ 
        height: '200px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img 
          src={displayImage}
          alt={displayTitle}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVIMjI1VjEyNUgxNzVWNzVaIiBmaWxsPSIjOUI5Q0EwIi8+CjxwYXRoIGQ9Ik0yMDAgMTAwTDE4NSAxMTVIMjE1TDIwMCAxMDBaIiBmaWxsPSIjNjg3MDc2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjg3MDc2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
          }}
        />
        
        {/* 시간 남은 표시 */}
        {displayTimeLeft && displayTimeLeft !== 'Ended' && (
          <div style={{
            position: 'absolute',
            bottom: DESIGN_TOKENS.spacing.sm,
            left: DESIGN_TOKENS.spacing.sm,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: DESIGN_TOKENS.colors.white,
            padding: `${DESIGN_TOKENS.spacing.xs} ${DESIGN_TOKENS.spacing.sm}`,
            borderRadius: DESIGN_TOKENS.layout.borderRadius.md,
            fontSize: DESIGN_TOKENS.fontSizes.xs,
            fontWeight: DESIGN_TOKENS.fontWeights.medium
          }}>
            ⏰ {displayTimeLeft}
          </div>
        )}
      </div>

      {/* 컨텐츠 */}
      <div style={{ 
        padding: DESIGN_TOKENS.spacing.lg,
        display: 'flex',
        flexDirection: 'column',
        gap: DESIGN_TOKENS.spacing.md,
        flex: 1
      }}>
        <h3 style={{
          ...commonStyles.text.heading,
          fontSize: DESIGN_TOKENS.fontSizes.lg,
          lineHeight: DESIGN_TOKENS.lineHeights.tight,
          margin: 0
        }}>
          {displayTitle}
        </h3>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{
              ...commonStyles.text.secondary,
              fontSize: DESIGN_TOKENS.fontSizes.sm,
              margin: 0,
              marginBottom: DESIGN_TOKENS.spacing.xs
            }}>
              Current Bid
            </p>
            <p style={{
              ...commonStyles.text.heading,
              fontSize: DESIGN_TOKENS.fontSizes.xl,
              fontWeight: DESIGN_TOKENS.fontWeights.bold,
              color: DESIGN_TOKENS.colors.primary,
              margin: 0
            }}>
              ${displayBid.toLocaleString()}
            </p>
          </div>
          
          {/* 실시간 입찰 수 표시 */}
          {showRealTimeUpdates && bidCount > 0 && (
            <div style={{
              textAlign: 'right'
            }}>
              <p style={{
                ...commonStyles.text.secondary,
                fontSize: DESIGN_TOKENS.fontSizes.xs,
                margin: 0,
                marginBottom: DESIGN_TOKENS.spacing.xs
              }}>
                Live Bids
              </p>
              <p style={{
                ...commonStyles.text.body,
                fontSize: DESIGN_TOKENS.fontSizes.sm,
                fontWeight: DESIGN_TOKENS.fontWeights.medium,
                color: DESIGN_TOKENS.colors.success,
                margin: 0
              }}>
                +{bidCount}
              </p>
            </div>
          )}
        </div>

        {/* 퀵 입찰 버튼 (로그인한 사용자만, 경매가 종료되지 않은 경우만) */}
        {displayTimeLeft !== 'Ended' && user?.isAuthenticated && (
          <div style={{
            marginTop: 'auto'
          }}>
            <Button
              variant="outline"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickBid();
              }}
              disabled={isPlacingBid || (!isConnected && showRealTimeUpdates)}
              loading={isPlacingBid}
              style={{ width: '100%' }}
            >
              {isPlacingBid ? '입찰 중...' : '퀵 입찰'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeItemCard;