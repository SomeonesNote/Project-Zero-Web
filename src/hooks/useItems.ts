import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import { QUERY_KEYS } from "@/services/queryClient";
import {
  Item,
  Category,
  ItemsAPIResponse,
  APIOptions,
  SearchSuggestion,
} from "@/types";

// 모든 아이템 조회
export function useAllItems(options?: APIOptions) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ITEMS.ALL, options],
    queryFn: () => apiService.getAllItems(options),
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2분
  });
}

// Featured Items와 Ending Soon Items를 병렬로 가져오기
export function useHomeItems() {
  const queries = useQueries({
    queries: [
      {
        queryKey: QUERY_KEYS.ITEMS.FEATURED,
        queryFn: () => apiService.getFeaturedItems(4),
        staleTime: 5 * 60 * 1000, // 5분
      },
      {
        queryKey: QUERY_KEYS.ITEMS.ENDING_SOON,
        queryFn: () => apiService.getEndingSoonItems(4),
        staleTime: 1 * 60 * 1000, // 1분 (더 자주 업데이트)
      },
      {
        queryKey: QUERY_KEYS.CATEGORIES.ALL,
        queryFn: () => apiService.getCategories(),
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
    queryKey: [...QUERY_KEYS.ITEMS.FEATURED, limit],
    queryFn: () => apiService.getFeaturedItems(limit),
    staleTime: 5 * 60 * 1000,
  });
}

// Ending Soon Items만 조회
export function useEndingSoonItems(limit?: number) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ITEMS.ENDING_SOON, limit],
    queryFn: () => apiService.getEndingSoonItems(limit),
    staleTime: 1 * 60 * 1000,
  });
}

// 카테고리별 아이템 조회
export function useItemsByCategory(categoryId: string, options?: APIOptions) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ITEMS.BY_CATEGORY(categoryId), options],
    queryFn: () => apiService.getItemsByCategory(categoryId, options),
    enabled: !!categoryId,
    staleTime: 3 * 60 * 1000,
  });
}

// 아이템 상세 조회
export function useItemDetail(itemId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ITEMS.DETAIL(itemId),
    queryFn: () => apiService.getItemDetail(itemId),
    enabled: !!itemId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// 검색
export function useSearchItems(searchTerm: string, options?: APIOptions) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ITEMS.SEARCH(searchTerm), options],
    queryFn: () => apiService.getAllItems({ ...options, search: searchTerm }),
    enabled: !!searchTerm && searchTerm.length > 2,
    staleTime: 2 * 60 * 1000,
  });
}

// 검색 제안
export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SEARCH.SUGGESTIONS(query),
    queryFn: () => apiService.getSearchSuggestions(query),
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

// 카테고리 조회
export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.ALL,
    queryFn: () => apiService.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
}

// 캐시 무효화 헬퍼 훅
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  const invalidateItems = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS.ALL });
  };

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
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
      queryKey: QUERY_KEYS.ITEMS.DETAIL(itemId),
      queryFn: () => apiService.getItemDetail(itemId),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchItem };
}
