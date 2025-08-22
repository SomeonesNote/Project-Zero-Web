import { createContext, useContext, useReducer, ReactNode } from "react";
import {
  AppState,
  AppAction,
  Item,
  Category,
  User,
  FilterInfo,
  PaginationInfo,
} from "@/types";

// 액션 타입 상수
export const APP_ACTIONS = {
  SET_USER: "SET_USER",
  SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
  SET_SEARCH_HISTORY: "SET_SEARCH_HISTORY",
  ADD_TO_SEARCH_HISTORY: "ADD_TO_SEARCH_HISTORY",
  REMOVE_FROM_SEARCH_HISTORY: "REMOVE_FROM_SEARCH_HISTORY",
  SET_ITEMS: "SET_ITEMS",
  SET_CATEGORIES: "SET_CATEGORIES",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
} as const;

// 안전한 localStorage 접근
const getInitialSearchHistory = (): string[] => {
  if (typeof window !== "undefined") {
    try {
      return JSON.parse(localStorage.getItem("searchHistory") || "[]");
    } catch {
      return [];
    }
  }
  return [];
};

// 초기 상태
const initialState: AppState = {
  user: null,
  currentPage: "main",
  searchHistory: getInitialSearchHistory(),
  items: [],
  categories: [],
  filters: {
    search: "",
    category: [],
    priceRange: { min: 0, max: 100000 },
    sortBy: "newest",
    available: {
      categories: [],
      sortOptions: [
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "price-low", label: "Price: Low to High" },
        { value: "price-high", label: "Price: High to Low" },
        { value: "popular", label: "Most Popular" },
      ],
    },
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
};

// 리듀서 함수
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case APP_ACTIONS.SET_USER:
      return { ...state, user: action.payload };

    case APP_ACTIONS.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };

    case APP_ACTIONS.SET_SEARCH_HISTORY:
      return { ...state, searchHistory: action.payload };

    case APP_ACTIONS.ADD_TO_SEARCH_HISTORY: {
      const newHistory = [
        action.payload,
        ...state.searchHistory.filter((term) => term !== action.payload),
      ].slice(0, 10);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      return { ...state, searchHistory: newHistory };
    }

    case APP_ACTIONS.REMOVE_FROM_SEARCH_HISTORY: {
      const newHistory = state.searchHistory.filter(
        (term) => term !== action.payload,
      );
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      return { ...state, searchHistory: newHistory };
    }

    case APP_ACTIONS.SET_ITEMS:
      return { ...state, items: action.payload };

    case APP_ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        filters: {
          ...state.filters,
          available: {
            ...state.filters.available,
            categories: action.payload,
          },
        },
      };

    case APP_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case APP_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case APP_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case APP_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case APP_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
}

// Context 생성
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    setUser: (user: User | null) => void;
    setCurrentPage: (page: string) => void;
    addToSearchHistory: (term: string) => void;
    removeFromSearchHistory: (term: string) => void;
    setItems: (items: Item[]) => void;
    setCategories: (categories: Category[]) => void;
    setFilters: (filters: Partial<FilterInfo>) => void;
    setPagination: (pagination: Partial<PaginationInfo>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider 컴포넌트
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 액션 헬퍼 함수들
  const actions = {
    setUser: (user: User | null) =>
      dispatch({ type: APP_ACTIONS.SET_USER, payload: user }),

    setCurrentPage: (page: string) =>
      dispatch({ type: APP_ACTIONS.SET_CURRENT_PAGE, payload: page }),

    addToSearchHistory: (term: string) =>
      dispatch({ type: APP_ACTIONS.ADD_TO_SEARCH_HISTORY, payload: term }),

    removeFromSearchHistory: (term: string) =>
      dispatch({ type: APP_ACTIONS.REMOVE_FROM_SEARCH_HISTORY, payload: term }),

    setItems: (items: Item[]) =>
      dispatch({ type: APP_ACTIONS.SET_ITEMS, payload: items }),

    setCategories: (categories: Category[]) =>
      dispatch({ type: APP_ACTIONS.SET_CATEGORIES, payload: categories }),

    setFilters: (filters: Partial<FilterInfo>) =>
      dispatch({ type: APP_ACTIONS.SET_FILTERS, payload: filters }),

    setPagination: (pagination: Partial<PaginationInfo>) =>
      dispatch({ type: APP_ACTIONS.SET_PAGINATION, payload: pagination }),

    setLoading: (loading: boolean) =>
      dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading }),

    setError: (error: string | null) =>
      dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error }),

    clearError: () => dispatch({ type: APP_ACTIONS.CLEAR_ERROR }),
  };

  const contextValue = {
    state,
    dispatch,
    actions,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Custom Hook
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

// 개별 상태에 대한 커스텀 훅들
export function useUser(): [User | null, (user: User | null) => void] {
  const { state, actions } = useAppContext();
  return [state.user, actions.setUser];
}

export function useSearchHistory(): {
  history: string[];
  add: (term: string) => void;
  remove: (term: string) => void;
} {
  const { state, actions } = useAppContext();
  return {
    history: state.searchHistory,
    add: actions.addToSearchHistory,
    remove: actions.removeFromSearchHistory,
  };
}

export function useItems(): [Item[], (items: Item[]) => void] {
  const { state, actions } = useAppContext();
  return [state.items, actions.setItems];
}

export function useCategories(): [
  Category[],
  (categories: Category[]) => void,
] {
  const { state, actions } = useAppContext();
  return [state.categories, actions.setCategories];
}

export function useFilters(): [
  FilterInfo,
  (filters: Partial<FilterInfo>) => void,
] {
  const { state, actions } = useAppContext();
  return [state.filters, actions.setFilters];
}

export function usePagination(): [
  PaginationInfo,
  (pagination: Partial<PaginationInfo>) => void,
] {
  const { state, actions } = useAppContext();
  return [state.pagination, actions.setPagination];
}

export function useLoading(): [boolean, (loading: boolean) => void] {
  const { state, actions } = useAppContext();
  return [state.loading, actions.setLoading];
}

export function useError(): {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
} {
  const { state, actions } = useAppContext();
  return {
    error: state.error,
    setError: actions.setError,
    clearError: actions.clearError,
  };
}
