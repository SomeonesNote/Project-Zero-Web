import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 10 * 60 * 1000, // 10분
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query Keys
export const QUERY_KEYS = {
  ITEMS: {
    ALL: ["items"] as const,
    FEATURED: ["items", "featured"] as const,
    ENDING_SOON: ["items", "endingSoon"] as const,
    BY_CATEGORY: (categoryId: string) =>
      ["items", "category", categoryId] as const,
    DETAIL: (itemId: string) => ["items", "detail", itemId] as const,
    SEARCH: (term: string) => ["items", "search", term] as const,
  },
  CATEGORIES: {
    ALL: ["categories"] as const,
  },
  SEARCH: {
    SUGGESTIONS: (query: string) => ["search", "suggestions", query] as const,
  },
} as const;
