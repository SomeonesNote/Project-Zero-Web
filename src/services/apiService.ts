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
    // 현재는 더미 데이터를 반환하지만, 실제 서버 연결 시 여기를 수정
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
      // 개발 모드에서는 더미 데이터 반환
      return this.fetchDummyData<T>(endpoint);
    }

    // 실제 API 호출 (향후 서버 연결 시 사용)
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async fetchDummyData<T>(endpoint: string): Promise<T> {
    // 로딩 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

    // 엔드포인트에 따라 해당하는 더미 데이터 파일 반환
    let dataFile = '';
    
    if (endpoint.includes('/items/featured')) {
      dataFile = '/api/featured-items.json';
    } else if (endpoint.includes('/items/ending-soon')) {
      dataFile = '/api/ending-items.json';
    } else if (endpoint.includes('/items')) {
      dataFile = '/api/items.json';
    } else if (endpoint.includes('/categories')) {
      dataFile = '/api/categories.json';
    } else if (endpoint.includes('/user/bids')) {
      dataFile = '/api/user-bids.json';
    } else if (endpoint.includes('/user/listings')) {
      dataFile = '/api/user-listings.json';
    } else if (endpoint.includes('/users')) {
      dataFile = '/api/users.json';
    }

    if (dataFile) {
      const response = await fetch(dataFile);
      return await response.json();
    }

    // 기본 응답
    return { success: true, data: {} } as T;
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
  
  logout: (): Promise<ApiResponse<{}>> =>
    apiClient.post('/auth/logout'),
  
  refreshToken: (refreshToken: string): Promise<ApiResponse<LoginResponse>> =>
    apiClient.post('/auth/refresh', { refreshToken }),

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
    apiClient.get('/user/bids', params),
  
  getUserListings: (params?: UserListingsQuery): Promise<ApiResponse<PaginatedResponse<UserListingResponse>>> =>
    apiClient.get('/user/listings', params),

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
  return response.data.items;
};

export const fetchEndingSoonItems: QueryFunction<ItemResponse[]> = async () => {
  const response = await api.getEndingSoonItems();
  return response.data.items;
};

export const fetchUserBids: QueryFunction<UserBidResponse[]> = async ({ queryKey }) => {
  const [, params] = queryKey;
  const response = await api.getUserBids(params as UserBidsQuery);
  return response.data.bids;
};

export const fetchUserListings: QueryFunction<UserListingResponse[]> = async ({ queryKey }) => {
  const [, params] = queryKey;
  const response = await api.getUserListings(params as UserListingsQuery);
  return response.data.listings;
};

export const searchItems = async (query: string): Promise<ItemResponse[]> => {
  const response = await api.searchItems(query);
  return response.data.items;
};

// 더미 로그인 함수 (테스트용)
export const authenticateUser = async (email: string, password: string) => {
  // 실제로는 API 호출하지만, 현재는 더미 데이터 확인
  const usersResponse = await fetch('/api/users.json');
  const usersData = await usersResponse.json();
  
  const user = usersData.data.users.find(
    (u: any) => u.email === email && password === 'password123'
  );

  if (user) {
    // JWT 토큰 시뮬레이션
    const mockToken = btoa(JSON.stringify({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7일
    }));

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAuthenticated: true
      },
      token: mockToken,
      refreshToken: 'refresh_' + mockToken,
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
    };
  }

  return null;
};