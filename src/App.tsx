import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AppProvider, useUser } from '@/store/AppContext';
import { ToastProvider } from '@/store/ToastContext';
import { queryClient } from '@/services/queryClient';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useSession } from '@/hooks/useSession';

// 페이지 컴포넌트들을 지연 로딩
const MainPage = lazy(() => import('@/pages/MainPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ItemDetailPage = lazy(() => import('@/pages/ItemDetailPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));
const SignInPage = lazy(() => import('@/pages/SignInPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const MyBidPage = lazy(() => import('@/pages/MyBidPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function AppContent(): JSX.Element {
  const [currentUser] = useUser();
  const navigate = useNavigate();
  
  // 세션 관리 초기화
  useSession();
  
  const handleNavigation = (path: string) => {
    // React Router의 navigate 기능을 사용하여 SPA 방식으로 이동
    navigate(path);
  };

  return (
    <div className="app">
      <ErrorBoundary>
        <Header onNavigate={handleNavigation} currentUser={currentUser} />
        
        <main className="main-content">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* 메인 페이지 */}
              <Route path="/" element={<MainPage />} />
              
              {/* 검색 페이지 */}
              <Route path="/search" element={<SearchPage />} />
              
              {/* 상품 상세 페이지 */}
              <Route path="/item/:itemId" element={<ItemDetailPage />} />
              
              {/* 카테고리 페이지 */}
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:categoryId" element={<SearchPage />} />
              
              {/* 인증 페이지들 */}
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              
              {/* 사용자 페이지들 */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-bids" element={<MyBidPage />} />
              
              {/* 리다이렉트 */}
              <Route path="/register" element={<Navigate to="/signup" replace />} />
              
              {/* 404 페이지 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
      </ErrorBoundary>
    </div>
  );
}

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ToastProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <AppContent />
          </BrowserRouter>
        </ToastProvider>
      </AppProvider>
      
      {/* 개발 모드에서만 React Query 개발도구 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          buttonPosition="bottom-right"
          position="bottom"
        />
      )}
    </QueryClientProvider>
  );
}

export default App;