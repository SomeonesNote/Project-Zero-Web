/**
 * API 서비스
 * 실제 API 서버와 통신하는 함수들 (더미 데이터로 시뮬레이션)
 */

import { QueryFunction } from "@tanstack/react-query";
import { 
  ApiResponse, 
  PaginatedResponse, 
  ItemResponse, 
  ItemDetailResponse,
  ItemsQuery,
  LoginRequest,
  LoginResponse,
  UserBidsQuery,
  UserBidResponse,
  UserListingsQuery,
  UserListingResponse,
  CategoryResponse,
  PlaceBidRequest,
  PlaceBidResponse
} from "@/types/api";
import { getAccessToken, getAuthorizationHeader } from "@/utils/auth";
import { API_BASE_URL } from "@/constants/endpoints";

// API 클라이언트 기본 설정
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    const authHeader = getAuthorizationHeader();
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET 요청
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    return this.request<T>(url, { method: 'GET' });
  }

  // POST 요청
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// API 클라이언트 인스턴스
const apiClient = new ApiClient();

// API 함수들
export const api = {
  // 인증 관련
  login: (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
    apiClient.post('/auth/login', credentials),
  
  register: (userData: { email: string; username: string; full_name: string; password: string }): Promise<ApiResponse<LoginResponse>> =>
    apiClient.post('/auth/register', userData),
  
  logout: (): Promise<ApiResponse<{}>> =>
    apiClient.post('/auth/logout'),
  
  getProfile: (): Promise<ApiResponse<any>> =>
    apiClient.get('/auth/profile'),

  // 상품 관련
  getItems: (params?: ItemsQuery): Promise<ApiResponse<PaginatedResponse<ItemResponse>>> =>
    apiClient.get('/items', params),
  
  getFeaturedItems: (): Promise<ApiResponse<{ items: ItemResponse[] }>> =>
    apiClient.get('/items/featured'),
  
  getEndingSoonItems: (): Promise<ApiResponse<{ items: ItemResponse[] }>> =>
    apiClient.get('/items/ending-soon'),
  
  getItemDetail: (id: string): Promise<ApiResponse<ItemDetailResponse>> =>
    apiClient.get(`/items/${id}`),
  
  searchItems: (query: string): Promise<ApiResponse<PaginatedResponse<ItemResponse>>> =>
    apiClient.get('/items/search', { q: query }),

  // 입찰 관련
  placeBid: (bidData: PlaceBidRequest): Promise<ApiResponse<PlaceBidResponse>> =>
    apiClient.post('/bids', bidData),
  
  getUserBids: (params?: UserBidsQuery): Promise<ApiResponse<PaginatedResponse<UserBidResponse>>> =>
    apiClient.get('/bids/my', params),
  
  getUserListings: (params?: UserListingsQuery): Promise<ApiResponse<PaginatedResponse<UserListingResponse>>> =>
    apiClient.get('/items/my', params),

  // 카테고리 관련
  getCategories: (): Promise<ApiResponse<{ categories: CategoryResponse[] }>> =>
    apiClient.get('/categories'),
};

// React Query용 함수들
export const fetchItems: QueryFunction<ItemResponse[]> = async ({ queryKey }) => {
  const [, params] = queryKey;
  const response = await api.getItems(params as ItemsQuery);
  return response.data.items;
};

export const fetchFeaturedItems: QueryFunction<ItemResponse[]> = async () => {
  const response = await api.getFeaturedItems();
  return response.data;
};

export const fetchEndingSoonItems: QueryFunction<ItemResponse[]> = async () => {
  const response = await api.getEndingSoonItems();
  return response.data;
};

export const fetchUserBids: QueryFunction<UserBidResponse[]> = async ({ queryKey }) => {
  const [, params] = queryKey;
  const response = await api.getUserBids(params as UserBidsQuery);
  return response.data.data; // PaginatedResponse에서 data 배열 추출
};

export const fetchUserListings: QueryFunction<UserListingResponse[]> = async ({ queryKey }) => {
  const [, params] = queryKey;
  const response = await api.getUserListings(params as UserListingsQuery);
  return response.data.data; // PaginatedResponse에서 data 배열 추출
};

export const searchItems = async (query: string): Promise<ItemResponse[]> => {
  const response = await api.searchItems(query);
  return response.data.items;
};

// 실제 인증 함수
export const authenticateUser = async (email: string, password: string) => {
  try {
    const response = await api.login({ email, password });
    if (response.success) {
      return {
        user: response.data.user,
        token: response.data.token,
        refreshToken: response.data.refreshToken || response.data.token,
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7일
      };
    }
    return null;
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
};