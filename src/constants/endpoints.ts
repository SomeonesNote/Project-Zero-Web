/**
 * API 엔드포인트 상수 정의
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

// 인증 관련 엔드포인트
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  REGISTER: '/auth/register',
} as const;

// 상품 관련 엔드포인트
export const ITEMS_ENDPOINTS = {
  LIST: '/items',
  DETAIL: (id: string) => `/items/${id}`,
  SEARCH: '/items/search',
  FEATURED: '/items/featured',
  ENDING_SOON: '/items/ending-soon',
  CREATE: '/items',
  UPDATE: (id: string) => `/items/${id}`,
  DELETE: (id: string) => `/items/${id}`,
  UPLOAD_IMAGE: '/items/upload-image',
} as const;

// 입찰 관련 엔드포인트
export const BIDS_ENDPOINTS = {
  PLACE: '/bids',
  HISTORY: (itemId: string) => `/bids/history/${itemId}`,
  USER_BIDS: '/bids/user',
  CANCEL: (bidId: string) => `/bids/${bidId}/cancel`,
} as const;

// 사용자 관련 엔드포인트
export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  LISTINGS: '/user/listings',
  BIDS: '/user/bids',
  WATCHLIST: '/user/watchlist',
  ADD_TO_WATCHLIST: '/user/watchlist',
  REMOVE_FROM_WATCHLIST: (itemId: string) => `/user/watchlist/${itemId}`,
} as const;

// 카테고리 관련 엔드포인트
export const CATEGORIES_ENDPOINTS = {
  LIST: '/categories',
  DETAIL: (slug: string) => `/categories/${slug}`,
} as const;

// 검색 관련 엔드포인트
export const SEARCH_ENDPOINTS = {
  SUGGESTIONS: '/search/suggestions',
  AUTOCOMPLETE: '/search/autocomplete',
  HISTORY: '/search/history',
} as const;

// WebSocket 채널
export const WS_CHANNELS = {
  AUCTION: '/auction',
  USER_NOTIFICATIONS: '/notifications',
  ITEM_UPDATES: (itemId: string) => `/items/${itemId}`,
} as const;

// 파일 업로드 관련
export const UPLOAD_ENDPOINTS = {
  IMAGE: '/upload/image',
  AVATAR: '/upload/avatar',
} as const;

// 관리자 관련 엔드포인트 (향후 사용)
export const ADMIN_ENDPOINTS = {
  USERS: '/admin/users',
  ITEMS: '/admin/items',
  REPORTS: '/admin/reports',
  STATISTICS: '/admin/statistics',
} as const;