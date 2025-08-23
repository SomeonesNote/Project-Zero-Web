/**
 * JWT 토큰 기반 인증 유틸리티
 */

const TOKEN_KEY = 'bidswap_token';
const REFRESH_TOKEN_KEY = 'bidswap_refresh_token';

export interface TokenData {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * localStorage가 사용 가능한지 확인
 */
const isStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * 토큰을 localStorage에 저장
 */
export const saveTokens = (tokenData: TokenData): void => {
  if (!isStorageAvailable()) return;

  try {
    localStorage.setItem(TOKEN_KEY, tokenData.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refreshToken);
    localStorage.setItem('token_expires_at', tokenData.expiresAt.toString());
  } catch (error) {
    console.warn('토큰 저장 실패:', error);
  }
};

/**
 * 액세스 토큰 가져오기
 */
export const getAccessToken = (): string | null => {
  if (!isStorageAvailable()) return null;

  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.warn('토큰 불러오기 실패:', error);
    return null;
  }
};

/**
 * 리프레시 토큰 가져오기
 */
export const getRefreshToken = (): string | null => {
  if (!isStorageAvailable()) return null;

  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.warn('리프레시 토큰 불러오기 실패:', error);
    return null;
  }
};

/**
 * 토큰 만료 시간 가져오기
 */
export const getTokenExpiresAt = (): number => {
  if (!isStorageAvailable()) return 0;

  try {
    const expiresAt = localStorage.getItem('token_expires_at');
    return expiresAt ? parseInt(expiresAt, 10) : 0;
  } catch (error) {
    console.warn('토큰 만료 시간 불러오기 실패:', error);
    return 0;
  }
};

/**
 * 토큰이 만료되었는지 확인
 */
export const isTokenExpired = (): boolean => {
  const expiresAt = getTokenExpiresAt();
  if (!expiresAt) return true;

  return Date.now() >= expiresAt;
};

/**
 * 토큰이 곧 만료될지 확인 (5분 이내)
 */
export const isTokenExpiringSoon = (): boolean => {
  const expiresAt = getTokenExpiresAt();
  if (!expiresAt) return true;

  const fiveMinutes = 5 * 60 * 1000;
  return Date.now() >= (expiresAt - fiveMinutes);
};

/**
 * 모든 토큰 삭제
 */
export const clearTokens = (): void => {
  if (!isStorageAvailable()) return;

  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('token_expires_at');
  } catch (error) {
    console.warn('토큰 삭제 실패:', error);
  }
};

/**
 * JWT 페이로드 디코딩 (검증 없이 정보만 추출)
 */
export const decodeTokenPayload = <T = any>(token: string): T | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.warn('JWT 디코딩 실패:', error);
    return null;
  }
};

/**
 * 토큰에서 사용자 정보 추출
 */
export const getUserFromToken = (token: string): any | null => {
  const payload = decodeTokenPayload(token);
  return payload?.user || payload?.sub || null;
};

/**
 * 토큰 유효성 기본 검사
 */
export const isValidTokenFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Authorization 헤더 생성
 */
export const getAuthorizationHeader = (): string | null => {
  const token = getAccessToken();
  return token ? `Bearer ${token}` : null;
};

/**
 * 로그아웃 처리 (토큰 삭제)
 */
export const logout = (): void => {
  clearTokens();
  // 추가적으로 필요한 로그아웃 로직 (예: API 호출)
};