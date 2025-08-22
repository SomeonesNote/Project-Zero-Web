import { useCallback } from 'react';
import { useNavigation } from './useNavigation';
import type { Item } from '@/types';

/**
 * 아이템 관련 액션들을 캡슐화한 커스텀 훅
 * 아이템 클릭, 입찰, 위시리스트 등의 공통 로직 제공
 */
export function useItemActions() {
  const { navigateToItem } = useNavigation();

  /**
   * 아이템 클릭 핸들러
   */
  const handleItemClick = useCallback((item: Item) => {
    navigateToItem(item.id);
  }, [navigateToItem]);

  /**
   * 입찰 버튼 클릭 핸들러
   */
  const handleBidClick = useCallback((item: Item, event?: React.MouseEvent) => {
    // 이벤트 전파 중지 (아이템 카드 클릭과 분리)
    event?.stopPropagation();
    navigateToItem(item.id, 'bid');
  }, [navigateToItem]);

  /**
   * 아이템 호버 시 프리페치 (성능 최적화)
   */
  const handleItemHover = useCallback((item: Item) => {
    // 아이템 상세 페이지 프리페치 로직
    // 실제 구현에서는 React Query의 prefetchQuery 등을 사용
    console.log(`Prefetching item ${item.id}`);
  }, []);

  /**
   * 위시리스트 토글 핸들러
   */
  const handleWishlistToggle = useCallback((item: Item, isCurrentlyInWishlist: boolean) => {
    // 위시리스트 추가/제거 로직
    // 실제 구현에서는 API 호출 및 상태 업데이트
    console.log(`${isCurrentlyInWishlist ? 'Removing from' : 'Adding to'} wishlist: ${item.id}`);
  }, []);

  /**
   * 아이템 공유 핸들러
   */
  const handleItemShare = useCallback((item: Item) => {
    const shareData = {
      title: item.title,
      text: `Check out this auction item: ${item.title}`,
      url: `${window.location.origin}/item/${item.id}`,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // 폴백: 클립보드에 URL 복사
      navigator.clipboard.writeText(shareData.url).then(() => {
        console.log('Link copied to clipboard');
        // 실제 구현에서는 토스트 알림 표시
      }).catch(console.error);
    }
  }, []);

  /**
   * 아이템 신고 핸들러
   */
  const handleItemReport = useCallback((item: Item, reason: string) => {
    // 아이템 신고 로직
    console.log(`Reporting item ${item.id} for: ${reason}`);
  }, []);

  return {
    handleItemClick,
    handleBidClick,
    handleItemHover,
    handleWishlistToggle,
    handleItemShare,
    handleItemReport,
  };
}