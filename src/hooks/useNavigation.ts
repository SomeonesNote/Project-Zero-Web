import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 네비게이션 관련 로직을 캡슐화한 커스텀 훅
 * 모든 페이지 이동 로직을 중앙화하여 일관성 유지
 */
export function useNavigation() {
  const navigate = useNavigate();

  /**
   * 아이템 상세 페이지로 이동
   */
  const navigateToItem = useCallback((itemId: string, action?: 'bid' | 'details') => {
    const url = `/item/${itemId}${action ? `?action=${action}` : ''}`;
    navigate(url);
  }, [navigate]);

  /**
   * 검색 페이지로 이동
   */
  const navigateToSearch = useCallback((query: string, filters?: Record<string, any>) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value));
        }
      });
    }
    navigate(`/search?${params.toString()}`);
  }, [navigate]);

  /**
   * 카테고리 페이지로 이동
   */
  const navigateToCategory = useCallback((categoryId: string) => {
    navigate(`/category/${categoryId}`);
  }, [navigate]);

  /**
   * 로그인 페이지로 이동
   */
  const navigateToSignIn = useCallback(() => {
    navigate('/signin');
  }, [navigate]);

  /**
   * 회원가입 페이지로 이동
   */
  const navigateToSignUp = useCallback(() => {
    navigate('/signup');
  }, [navigate]);

  /**
   * 프로필 페이지로 이동
   */
  const navigateToProfile = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  /**
   * 메인 페이지로 이동
   */
  const navigateToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  /**
   * 이전 페이지로 이동
   */
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  /**
   * 외부 URL로 이동 (새 탭)
   */
  const navigateExternal = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  return {
    navigateToItem,
    navigateToSearch,
    navigateToCategory,
    navigateToSignIn,
    navigateToSignUp,
    navigateToProfile,
    navigateToHome,
    goBack,
    navigateExternal,
  };
}