import { useEffect, useCallback } from 'react';
import { useAppContext } from '@/store/AppContext';
import { isTokenExpired, isTokenExpiringSoon, clearTokens, getRefreshToken } from '@/utils/auth';
import { api } from '@/services/apiService';

/**
 * 세션 관리를 위한 커스텀 훅
 * - 세션 만료 체크
 * - 자동 로그아웃
 * - 사용자 활동 시 세션 연장
 */
export function useSession() {
  const { state, actions } = useAppContext();

  // 토큰 만료 체크
  const checkTokenExpiry = useCallback(() => {
    if (state.user && state.user.isAuthenticated) {
      if (isTokenExpired()) {
        // 토큰이 만료되면 자동 로그아웃
        actions.setUser(null);
        clearTokens();
        return false;
      }
    }
    return true;
  }, [state.user, actions]);

  // 토큰 갱신 (토큰이 곧 만료될 때)
  const refreshTokenIfNeeded = useCallback(async () => {
    if (!state.user || !state.user.isAuthenticated) return;

    if (isTokenExpiringSoon() && !isTokenExpired()) {
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          // 실제 환경에서는 API 호출로 토큰 갱신
          // const response = await api.refreshToken(refreshToken);
          // 현재는 더미 구현으로 생략
          console.log('Token refresh would happen here');
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        // 토큰 갱신 실패 시 로그아웃
        actions.setUser(null);
        clearTokens();
      }
    }
  }, [state.user, actions]);

  // 사용자 활동 감지 시 토큰 갱신 체크
  const handleUserActivity = useCallback(() => {
    refreshTokenIfNeeded();
  }, [refreshTokenIfNeeded]);

  // 주기적 토큰 체크 (5분마다)
  useEffect(() => {
    if (!state.user) return;

    const interval = setInterval(() => {
      checkTokenExpiry();
      refreshTokenIfNeeded();
    }, 5 * 60 * 1000); // 5분

    return () => clearInterval(interval);
  }, [state.user, checkTokenExpiry, refreshTokenIfNeeded]);

  // 사용자 활동 이벤트 리스너 (마우스 움직임, 키보드 입력, 클릭)
  useEffect(() => {
    if (!state.user || !state.user.isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    let lastActivityTime = Date.now();

    const throttledActivityHandler = () => {
      const now = Date.now();
      // 5분에 한 번만 토큰 갱신 체크
      if (now - lastActivityTime > 5 * 60 * 1000) {
        lastActivityTime = now;
        handleUserActivity();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, throttledActivityHandler, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledActivityHandler);
      });
    };
  }, [state.user, handleUserActivity]);

  // 페이지 가시성 변경 시 토큰 체크 (탭 전환 시)
  useEffect(() => {
    if (!state.user) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkTokenExpiry();
        refreshTokenIfNeeded();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.user, checkTokenExpiry, refreshTokenIfNeeded]);

  return {
    isLoggedIn: !!state.user?.isAuthenticated,
    user: state.user,
    checkTokenExpiry,
    refreshTokenIfNeeded,
  };
}