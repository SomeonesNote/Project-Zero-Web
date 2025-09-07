/**
 * API 응답 타입 정의
 */

// 기본 API 응답 구조
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 페이지네이션 메타데이터
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// 페이지네이션된 응답
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// 인증 관련 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresAt: number;
}

// 상품 관련 타입
export interface ItemsQuery {
  page?: number;
  limit?: number;
  category?: string[];
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'popular' | 'ending-soon';
  priceMin?: number;
  priceMax?: number;
  status?: 'active' | 'ended' | 'all';
}

export interface ItemResponse {
  id: string;
  title: string;
  description: string;
  images: string[];
  currentBid: number;
  startingBid: number;
  buyNowPrice?: number;
  endTime: string;
  status: 'active' | 'ended' | 'cancelled';
  category: {
    id: string;
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  bidCount: number;
  watchers: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItemDetailResponse extends ItemResponse {
  biddingHistory: BidHistory[];
  specifications?: Record<string, string>;
  condition: string;
  shippingInfo: {
    cost: number;
    estimatedDays: number;
    methods: string[];
  };
}

// 입찰 관련 타입
export interface BidHistory {
  id: string;
  bidder: {
    id: string;
    name: string;
    avatar?: string;
  };
  amount: number;
  timestamp: string;
  isWinning: boolean;
}

export interface PlaceBidRequest {
  itemId: string;
  amount: number;
}

export interface PlaceBidResponse {
  success: boolean;
  bid: {
    id: string;
    amount: number;
    timestamp: string;
    isWinning: boolean;
  };
  item: {
    id: string;
    currentBid: number;
    bidCount: number;
  };
}

// 사용자 입찰 내역
export interface UserBidsQuery {
  status?: 'active' | 'won' | 'lost' | 'all';
  page?: number;
  limit?: number;
}

export interface UserBidResponse {
  id: string;
  item: {
    id: string;
    title: string;
    image: string;
    endTime: string;
  };
  myBid: number;
  currentBid: number;
  status: 'active' | 'won' | 'lost' | 'outbid';
  bidTime: string;
}

// 사용자 등록 상품
export interface UserListingsQuery {
  status?: 'active' | 'sold' | 'expired' | 'all';
  page?: number;
  limit?: number;
}

export interface UserListingResponse {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  bidCount: number;
  endTime: string;
  status: 'active' | 'sold' | 'expired';
  createdAt: string;
}

// 검색 관련 타입
export interface SearchSuggestionResponse {
  suggestions: string[];
  categories: Array<{
    id: string;
    name: string;
    count: number;
  }>;
}

// 카테고리 관련 타입
export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  itemCount: number;
  parentId?: string;
  children?: CategoryResponse[];
}

// WebSocket 메시지 타입
export interface WebSocketMessage {
  type: 'bid_update' | 'item_end' | 'outbid_notification';
  data: any;
}

export interface BidUpdateMessage {
  itemId: string;
  currentBid: number;
  bidCount: number;
  lastBidder: {
    id: string;
    name: string;
  };
  timestamp: string;
}

// 에러 타입
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}