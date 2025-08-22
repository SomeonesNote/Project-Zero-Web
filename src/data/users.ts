/**
 * 더미 유저 데이터
 * 테스트용 계정들
 */

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  joinDate: string;
  isAuthenticated: boolean;
  preferences?: {
    notifications: boolean;
    currency: 'USD' | 'KRW';
    language: 'en' | 'ko';
  };
}

export const DUMMY_USERS: User[] = [
  {
    id: "1",
    name: "김민수",
    email: "minsu@test.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    joinDate: "2024-01-15",
    isAuthenticated: false,
    preferences: {
      notifications: true,
      currency: "KRW",
      language: "ko"
    }
  },
  {
    id: "2", 
    name: "이영희",
    email: "younghee@test.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    joinDate: "2024-02-20",
    isAuthenticated: false,
    preferences: {
      notifications: true,
      currency: "USD",
      language: "en"
    }
  },
  {
    id: "3",
    name: "박철수",
    email: "chulsoo@test.com", 
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    joinDate: "2024-03-10",
    isAuthenticated: false,
    preferences: {
      notifications: false,
      currency: "USD",
      language: "en"
    }
  },
  {
    id: "4",
    name: "정수진",
    email: "sujin@test.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    joinDate: "2024-03-25",
    isAuthenticated: false,
    preferences: {
      notifications: true,
      currency: "KRW",
      language: "ko"
    }
  },
  {
    id: "5",
    name: "John Smith",
    email: "john@test.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    joinDate: "2024-04-05",
    isAuthenticated: false,
    preferences: {
      notifications: true,
      currency: "USD",
      language: "en"
    }
  },
  {
    id: "6",
    name: "Sarah Johnson", 
    email: "sarah@test.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face",
    joinDate: "2024-04-12",
    isAuthenticated: false,
    preferences: {
      notifications: false,
      currency: "USD",
      language: "en"
    }
  },
  {
    id: "7",
    name: "최현우",
    email: "hyunwoo@test.com",
    password: "password123", 
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
    joinDate: "2024-05-01",
    isAuthenticated: false,
    preferences: {
      notifications: true,
      currency: "KRW",
      language: "ko"
    }
  },
  {
    id: "8",
    name: "Emily Davis",
    email: "emily@test.com", 
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    joinDate: "2024-05-15",
    isAuthenticated: false,
    preferences: {
      notifications: true,
      currency: "USD",
      language: "en"
    }
  },
  {
    id: "9",
    name: "강태영",
    email: "taeyoung@test.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    joinDate: "2024-06-01",
    isAuthenticated: false,
    preferences: {
      notifications: false,
      currency: "KRW", 
      language: "ko"
    }
  },
  {
    id: "10",
    name: "Lisa Wilson",
    email: "lisa@test.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    joinDate: "2024-06-10",
    isAuthenticated: false,
    preferences: {
      notifications: true,
      currency: "USD",
      language: "en"
    }
  }
];

/**
 * 이메일과 비밀번호로 사용자 인증
 */
export const authenticateUser = (email: string, password: string): User | null => {
  const user = DUMMY_USERS.find(u => u.email === email && u.password === password);
  if (user) {
    return { ...user, isAuthenticated: true };
  }
  return null;
};

/**
 * 테스트용 계정 정보
 */
export const TEST_ACCOUNTS = {
  korean: {
    email: "minsu@test.com",
    password: "password123",
    name: "김민수"
  },
  english: {
    email: "john@test.com", 
    password: "password123",
    name: "John Smith"
  },
  female: {
    email: "sarah@test.com",
    password: "password123", 
    name: "Sarah Johnson"
  }
};