import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { 
  fetchFeaturedItems, 
  fetchEndingSoonItems,
  api
} from "@/services/apiService";
import type { ItemResponse, CategoryResponse } from "@/types/api";

// 모든 아이템 조회
export function useAllItems(params?: any) {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => api.getItems(params),
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2분
  });
}

// Featured Items와 Ending Soon Items를 병렬로 가져오기
export function useHomeItems() {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['featured-items'],
        queryFn: fetchFeaturedItems,
        staleTime: 5 * 60 * 1000, // 5분
      },
      {
        queryKey: ['ending-soon-items'],
        queryFn: fetchEndingSoonItems,
        staleTime: 1 * 60 * 1000, // 1분 (더 자주 업데이트)
      },
      {
        queryKey: ['categories'],
        queryFn: async () => {
          const response = await api.getCategories();
          return response.data.categories;
        },
        staleTime: 10 * 60 * 1000, // 10분
      },
    ],
  });

  return {
    featuredItems: queries[0].data || [],
    endingSoonItems: queries[1].data || [],
    categories: queries[2].data || [],
    isLoading: queries.some((q) => q.isLoading),
    error: queries.find((q) => q.error)?.error || null,
    isSuccess: queries.every((q) => q.isSuccess),
  };
}

// Featured Items만 조회
export function useFeaturedItems(limit?: number) {
  return useQuery({
    queryKey: ['featured-items', limit],
    queryFn: fetchFeaturedItems,
    staleTime: 5 * 60 * 1000,
  });
}

// Ending Soon Items만 조회
export function useEndingSoonItems(limit?: number) {
  return useQuery({
    queryKey: ['ending-soon-items', limit],
    queryFn: fetchEndingSoonItems,
    staleTime: 1 * 60 * 1000,
  });
}

// 카테고리별 아이템 조회
export function useItemsByCategory(categoryId: string, params?: any) {
  return useQuery({
    queryKey: ['items', 'category', categoryId, params],
    queryFn: () => api.getItems({ category: categoryId, ...params }),
    enabled: !!categoryId,
    staleTime: 3 * 60 * 1000,
  });
}

// 아이템 상세 조회
export function useItemDetail(itemId: string) {
  return useQuery({
    queryKey: ['item', itemId],
    queryFn: () => api.getItemDetail(itemId),
    enabled: !!itemId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// 검색
export function useSearchItems(searchTerm: string, params?: any) {
  return useQuery({
    queryKey: ['items', 'search', searchTerm, params],
    queryFn: () => api.searchItems(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 2,
    staleTime: 2 * 60 * 1000,
  });
}

// 검색 제안 (향후 구현)
export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => Promise.resolve([]), // 현재는 빈 배열 반환
    enabled: false, // 향후 구현 시 true로 변경
    staleTime: 5 * 60 * 1000,
  });
}

// 카테고리 조회
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.getCategories();
      return response.data.categories;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// 캐시 무효화 헬퍼 훅
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  const invalidateItems = () => {
    queryClient.invalidateQueries({ queryKey: ['items'] });
  };

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries();
  };

  return {
    invalidateItems,
    invalidateCategories,
    invalidateAll,
  };
}

// Prefetch 헬퍼 훅
export function usePrefetchItem() {
  const queryClient = useQueryClient();

  const prefetchItem = (itemId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['item', itemId],
      queryFn: () => api.getItemDetail(itemId),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchItem };
}
