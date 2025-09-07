/**
 * 안전한 localStorage 관리 유틸리티
 * SSR 환경에서도 안전하게 동작하며, 에러 처리를 포함합니다.
 */

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAuthenticated: boolean;
  loginTime: number; // 로그인 시간 (Unix timestamp)
  expiresAt: number; // 만료 시간 (Unix timestamp)
}

const USER_STORAGE_KEY = 'bidswap_user';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7일 (밀리초)

/**
 * localStorage가 사용 가능한지 확인
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * 사용자 정보를 localStorage에 저장
 */
export const saveUserToStorage = (user: Omit<StoredUser, 'loginTime' | 'expiresAt'>): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    const now = Date.now();
    const storedUser: StoredUser = {
      ...user,
      loginTime: now,
      expiresAt: now + SESSION_DURATION,
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(storedUser));
  } catch (error) {
    console.warn('사용자 정보 저장 실패:', error);
  }
};

/**
 * localStorage에서 사용자 정보를 불러옴
 */
export const getUserFromStorage = (): StoredUser | null => {
  if (!isLocalStorageAvailable()) return null;

  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) return null;

    const user: StoredUser = JSON.parse(stored);
    const now = Date.now();

    // 세션 만료 확인
    if (user.expiresAt && now > user.expiresAt) {
      removeUserFromStorage();
      return null;
    }

    return user;
  } catch (error) {
    console.warn('사용자 정보 불러오기 실패:', error);
    removeUserFromStorage(); // 손상된 데이터 제거
    return null;
  }
};

/**
 * localStorage에서 사용자 정보를 제거
 */
export const removeUserFromStorage = (): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.warn('사용자 정보 삭제 실패:', error);
  }
};

/**
 * 세션 연장 (사용자 활동이 있을 때 호출)
 */
export const extendUserSession = (): void => {
  const user = getUserFromStorage();
  if (!user) return;

  const now = Date.now();
  const updatedUser: StoredUser = {
    ...user,
    expiresAt: now + SESSION_DURATION,
  };

  saveUserToStorage(updatedUser);
};

/**
 * 세션이 만료되었는지 확인
 */
export const isSessionExpired = (): boolean => {
  const user = getUserFromStorage();
  if (!user) return true;

  return Date.now() > user.expiresAt;
};

/**
 * 남은 세션 시간 (밀리초)
 */
export const getRemainingSessionTime = (): number => {
  const user = getUserFromStorage();
  if (!user) return 0;

  return Math.max(0, user.expiresAt - Date.now());
};