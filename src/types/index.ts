// 기본 데이터 타입
export interface Item {
  id: string;
  title: string;
  description: string;
  image: string;
  startingBid: number;
  currentBid: number;
  totalBids: number;
  seller: Seller;
  location: string;
  condition: ItemCondition;
  tags: string[];
  endTime: string;
  category: string;
  featured: boolean;
  endingSoon: boolean;
}

export interface Category {
  id: string;
  name: string;
  count?: number;
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
  totalSales: number;
}

export interface AuctionInfo {
  startTime: string;
  endTime: string;
  timeLeft: string;
  isActive: boolean;
}

export interface ShippingInfo {
  cost: number;
  method: string;
  estimatedDays: number;
}

export type ItemCondition = "new" | "used" | "vintage" | "antique";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FilterInfo {
  search: string;
  category: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: string;
  available: {
    categories: { id: string; name: string }[];
    sortOptions: { value: string; label: string }[];
  };
}

// API 응답 타입
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ItemsAPIResponse {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  filters: FilterInfo;
}

export interface SearchSuggestion {
  term: string;
  count: number;
}

export interface APIOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string[];
  sortBy?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

// 컴포넌트 옵션 타입
export interface SearchBarOptions {
  placeholder?: string;
  size?: "small" | "medium" | "large";
  value?: string;
  id?: string;
  onSearch?: (term: string) => void;
}

export interface ItemCardOptions {
  item: Item;
  onCardClick?: (data: { item: Item }) => void;
  onBidClick?: (data: { item: Item }) => void;
  onDetailsClick?: (data: { item: Item }) => void;
}

export interface ItemGridOptions {
  container: HTMLElement;
  items: Item[];
  onItemClick?: (data: { item: Item }) => void;
  onBidClick?: (data: { item: Item }) => void;
  onDetailsClick?: (data: { item: Item }) => void;
}

export interface PaginationOptions {
  container: HTMLElement;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
}

// 이벤트 타입
export interface NavigationEvent {
  text: string;
  href: string;
}

export interface SearchEvent {
  term: string;
  searchBarId?: string;
}

export interface CategoryChangeEvent {
  selectedCategories: string[];
}

export interface ItemClickEvent {
  item: Item;
}

export interface PageChangeEvent {
  page: number;
}

// 데이터 관리자 상태
export interface DataManagerState {
  items: Item[];
  categories: Category[];
  filters: FilterInfo;
  pagination: PaginationInfo;
  currentPage: number;
  itemsPerPage: number;
}

// 컴포넌트 인터페이스
export interface Component {
  render(): void;
  destroy(): void;
}

// 이벤트 버스 인터페이스
export interface EventBusInterface {
  on<T>(event: string, callback: (data: T) => void): void;
  off(event: string, callback: (data: any) => void): void;
  emit<T>(event: string, data: T): void;
}

export type EventCallback<T = any> = (data: T) => void;

// API 인터페이스
export interface APIInterface {
  getAllItems(options?: APIOptions): Promise<ItemsAPIResponse>;
  getFeaturedItems(limit?: number): Promise<Item[]>;
  getEndingSoonItems(limit?: number): Promise<Item[]>;
  getItemsByCategory(
    categoryId: string,
    options?: APIOptions,
  ): Promise<ItemsAPIResponse>;
  getItemDetail(itemId: string): Promise<Item>;
  getSearchSuggestions(query: string): Promise<SearchSuggestion[]>;
  getCategories(): Promise<Category[]>;
  setDelay(delay: number): void;
}

// 앱 설정
export interface AppConfig {
  enableDebugMode?: boolean;
  enableErrorReporting?: boolean;
  apiDelay?: number;
  defaultItemsPerPage?: number;
}

// 개발자 도구
export interface DeveloperUtils {
  getAPI(): any;
  testAPI: {
    getAllItems(): Promise<any>;
    getFeaturedItems(): Promise<any>;
    getItemDetail(id: string): Promise<any>;
  };
  setAPIDelay(delay: number): void;
  exportItems(): void;
  importItems(jsonData: string): void;
  addSampleItem(): void;
  setSearchTerm(term: string): void;
}
