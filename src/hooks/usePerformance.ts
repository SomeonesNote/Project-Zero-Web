import { useCallback, useMemo } from "react";

// 디바운스 훅
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  return useCallback(debounce(callback, delay), [callback, delay]);
}

// 메모이제이션된 필터링
export function useFilteredItems<T>(
  items: T[],
  searchTerm: string,
  filterFn?: (item: T, term: string) => boolean,
) {
  return useMemo(() => {
    if (!searchTerm) return items;

    const defaultFilter = (item: any, term: string) =>
      item.title?.toLowerCase().includes(term.toLowerCase()) ||
      item.description?.toLowerCase().includes(term.toLowerCase());

    const filter = filterFn || defaultFilter;
    return items.filter((item) => filter(item, searchTerm));
  }, [items, searchTerm, filterFn]);
}

// 디바운스 유틸리티
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
