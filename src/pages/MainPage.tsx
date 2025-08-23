import React, { useRef, useState, useCallback, memo } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/ui/Button";
import RealTimeItemCard from "@/components/RealTimeItemCard";
import { useHomeItems } from "@/hooks/useItems";
import { useSearchHistory } from "@/store/AppContext";
import { useNavigation } from "@/hooks/useNavigation";
import { useItemActions } from "@/hooks/useItemActions";
import { useToast } from "@/store/ToastContext";
import { DESIGN_TOKENS, commonStyles } from "@/constants/design-tokens";

// 가로스크롤 컨테이너 컴포넌트 (메모이제이션 적용)
const HorizontalScrollContainer = memo<{ children: React.ReactNode }>(({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  return (
    <div
      ref={scrollRef}
      className="horizontal-scroll-container"
      style={{
        display: 'flex',
        gap: DESIGN_TOKENS.spacing.md,
        overflowX: 'auto',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        padding: DESIGN_TOKENS.spacing.lg,
        WebkitOverflowScrolling: 'touch'
      }}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
});

HorizontalScrollContainer.displayName = 'HorizontalScrollContainer';

// MainPage용 간단한 ItemCard 컴포넌트 (인라인 스타일)
const SimpleItemCard = memo<{ item: any; onItemClick: (item: any) => void; onBidClick: (item: any) => void }>(({ item, onItemClick, onBidClick }) => {
  return (
    <div 
      style={{ 
        flex: '0 0 auto',
        width: '240px',
        display: 'flex',
        flexDirection: 'column',
        gap: DESIGN_TOKENS.spacing.lg,
        cursor: 'pointer'
      }}
      onClick={() => onItemClick(item)}
    >
      <div style={{ 
        height: '135px',
        borderRadius: DESIGN_TOKENS.layout.borderRadius.md,
        overflow: 'hidden'
      }}>
        <img 
          src={item.image || item.imageUrl || (item.images && item.images[0]) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjEzNSIgdmlld0JveD0iMCAwIDI0MCAxMzUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDAiIGhlaWdodD0iMTM1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDUgNTBIMTM1Vjc1SDEwNVY1MFoiIGZpbGw9IiM5QjlDQTAiLz4KPHBhdGggZD0iTTEyMCA2MkwxMTAgNzBIMTMwTDEyMCA2MloiIGZpbGw9IiM2ODcwNzYiLz4KPHA+dGV4dCB4PSIxMjAiIHk9IjkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjg3MDc2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4='} 
          alt={item.title || item.name}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjEzNSIgdmlld0JveD0iMCAwIDI0MCAxMzUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDAiIGhlaWdodD0iMTM1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDUgNTBIMTM1Vjc1SDEwNVY1MFoiIGZpbGw9IiM5QjlDQTAiLz4KPHBhdGggZD0iTTEyMCA2MkwxMTAgNzBIMTMwTDEyMCA2MloiIGZpbGw9IiM2ODcwNzYiLz4KPHA+dGV4dCB4PSIxMjAiIHk9IjkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjg3MDc2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
          }}
        />
      </div>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{
          ...commonStyles.text.heading,
          fontSize: DESIGN_TOKENS.fontSizes.base,
          lineHeight: DESIGN_TOKENS.lineHeights.normal,
          margin: `0 0 ${DESIGN_TOKENS.spacing.sm} 0`
        }}>
          {item.title || item.name}
        </h3>
        <p style={{
          ...commonStyles.text.secondary,
          fontSize: DESIGN_TOKENS.fontSizes.sm,
          lineHeight: DESIGN_TOKENS.lineHeights.relaxed,
          margin: 0
        }}>
          Current Bid: ${(item.currentBid || item.price || 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
});

SimpleItemCard.displayName = 'SimpleItemCard';

const MainPage: React.FC = () => {
  const { handleItemClick, handleBidClick } = useItemActions();
  const { history, add: addToHistory } = useSearchHistory();
  const { showInfo } = useToast();
  
  // 검색 관련 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  const { featuredItems, endingSoonItems, categories, isLoading, error } =
    useHomeItems();

  // 검색 기능 구현 - API 기반
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    setShowSearchHistory(false);
    
    try {
      // API를 통한 검색 실행
      const { searchItems } = await import('@/services/apiService');
      const results = await searchItems(query);
      
      // 검색어를 히스토리에 추가
      addToHistory(query);
      
      // 검색 결과 설정
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      showInfo("검색 오류", "검색 중 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
    }
  }, [addToHistory, showInfo]);

  const handleSearch = useCallback((searchQuery: string) => {
    setSearchTerm(searchQuery);
    performSearch(searchQuery);
    if (searchQuery.trim()) {
      showInfo("검색 실행", `"${searchQuery}" 검색 결과를 표시합니다.`);
    }
  }, [performSearch, showInfo]);

  const handleSearchFocus = useCallback(() => {
    if (history.length > 0 && !hasSearched) {
      setShowSearchHistory(true);
    }
  }, [history.length, hasSearched]);

  const handleSearchBlur = useCallback(() => {
    // 약간의 딜레이를 주어 히스토리 클릭이 가능하도록 함
    setTimeout(() => setShowSearchHistory(false), 200);
  }, []);

  const handleHistoryClick = useCallback((term: string) => {
    setSearchTerm(term);
    performSearch(term);
  }, [performSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
    setShowSearchHistory(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: DESIGN_TOKENS.colors.light,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <LoadingSpinner size="large" text="상품을 불러오는 중..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: DESIGN_TOKENS.colors.light,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          backgroundColor: DESIGN_TOKENS.colors.white,
          padding: DESIGN_TOKENS.spacing['4xl'],
          borderRadius: DESIGN_TOKENS.layout.borderRadius.lg,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            ...commonStyles.text.heading,
            fontSize: DESIGN_TOKENS.fontSizes['2xl'],
            marginBottom: DESIGN_TOKENS.spacing.lg
          }}>
            데이터를 불러올 수 없습니다
          </h2>
          <p style={{
            ...commonStyles.text.secondary,
            marginBottom: DESIGN_TOKENS.spacing['2xl']
          }}>잠시 후 다시 시도해주세요.</p>
          <Button
            variant="primary"
            size="medium"
            onClick={() => window.location.reload()}
          >
            새로고침
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: DESIGN_TOKENS.colors.white,
      minHeight: '100vh',
      fontFamily: DESIGN_TOKENS.fonts.primary
    }}>
      {/* Main Content */}
      <main style={{ 
        ...commonStyles.container,
        padding: `${DESIGN_TOKENS.spacing.xl} ${DESIGN_TOKENS.spacing['8xl']}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}>
        {/* Search Section */}
        <div style={{ 
          padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          position: 'relative'
        }}>
          <div style={{ 
            height: '48px',
            display: 'flex',
            borderRadius: DESIGN_TOKENS.layout.borderRadius.md,
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: DESIGN_TOKENS.colors.light,
              borderRadius: `${DESIGN_TOKENS.layout.borderRadius.md} 0px 0px ${DESIGN_TOKENS.layout.borderRadius.md}`,
              padding: `0px 0px 0px ${DESIGN_TOKENS.spacing.lg}`,
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{ width: '24px', height: '24px', color: DESIGN_TOKENS.colors.secondary }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div style={{
              backgroundColor: DESIGN_TOKENS.colors.light,
              borderRadius: `0px ${DESIGN_TOKENS.layout.borderRadius.md} ${DESIGN_TOKENS.layout.borderRadius.md} 0px`,
              padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.sm}`,
              flex: 1,
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search for items"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontFamily: DESIGN_TOKENS.fonts.primary,
                  fontWeight: DESIGN_TOKENS.fontWeights.normal,
                  fontSize: DESIGN_TOKENS.fontSizes.base,
                  lineHeight: DESIGN_TOKENS.lineHeights.normal,
                  color: DESIGN_TOKENS.colors.dark
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.currentTarget.value);
                  }
                }}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: DESIGN_TOKENS.spacing.xs,
                    marginLeft: DESIGN_TOKENS.spacing.sm,
                    color: DESIGN_TOKENS.colors.secondary,
                    fontSize: DESIGN_TOKENS.fontSizes.lg
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 검색 히스토리 드롭다운 */}
          {showSearchHistory && history.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: DESIGN_TOKENS.spacing.lg,
              right: DESIGN_TOKENS.spacing.lg,
              backgroundColor: DESIGN_TOKENS.colors.white,
              border: `1px solid ${DESIGN_TOKENS.colors.border}`,
              borderRadius: DESIGN_TOKENS.layout.borderRadius.md,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              marginTop: DESIGN_TOKENS.spacing.xs
            }}>
              <div style={{
                padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.lg}`,
                borderBottom: `1px solid ${DESIGN_TOKENS.colors.border}`,
                fontSize: DESIGN_TOKENS.fontSizes.sm,
                fontWeight: DESIGN_TOKENS.fontWeights.medium,
                color: DESIGN_TOKENS.colors.secondary
              }}>
                최근 검색어
              </div>
              {history.slice(0, 5).map((term, index) => (
                <div
                  key={index}
                  onClick={() => handleHistoryClick(term)}
                  style={{
                    padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.lg}`,
                    cursor: 'pointer',
                    fontSize: DESIGN_TOKENS.fontSizes.base,
                    color: DESIGN_TOKENS.colors.dark,
                    borderBottom: index < Math.min(history.length, 5) - 1 ? `1px solid ${DESIGN_TOKENS.colors.border}` : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = DESIGN_TOKENS.colors.light;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  🕒 {term}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 검색 결과 섹션 */}
        {hasSearched && (
          <section style={{ 
            alignSelf: 'stretch',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.xl}`
          }}>
            <div style={{
              width: '100%',
              maxWidth: '1200px',
              padding: `${DESIGN_TOKENS.spacing.md} 0`,
              marginBottom: DESIGN_TOKENS.spacing.lg
            }}>
              <h2 style={{
                ...commonStyles.text.heading,
                fontSize: DESIGN_TOKENS.fontSizes.xl,
                lineHeight: DESIGN_TOKENS.lineHeights.tight,
                margin: 0,
                marginBottom: DESIGN_TOKENS.spacing.sm,
                textAlign: 'left'
              }}>
                검색 결과
              </h2>
              <p style={{
                ...commonStyles.text.secondary,
                fontSize: DESIGN_TOKENS.fontSizes.sm,
                margin: 0,
                textAlign: 'left'
              }}>
                "{searchTerm}"에 대한 {isSearching ? '검색 중...' : `${searchResults.length}개 결과`}
              </p>
            </div>

            {isSearching ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: DESIGN_TOKENS.spacing['4xl']
              }}>
                <LoadingSpinner size="medium" text="검색 중..." />
              </div>
            ) : searchResults.length > 0 ? (
              <div style={{
                width: '100%',
                maxWidth: '1200px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: DESIGN_TOKENS.spacing.lg,
                padding: DESIGN_TOKENS.spacing.md,
                justifyItems: 'center'
              }}>
                {searchResults.map((item) => (
                  <RealTimeItemCard 
                    key={item.id} 
                    item={item}
                    onItemClick={handleItemClick}
                    onBidClick={handleBidClick}
                    showRealTimeUpdates={true}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: DESIGN_TOKENS.spacing['4xl'],
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: DESIGN_TOKENS.spacing.lg
                }}>
                  🔍
                </div>
                <h3 style={{
                  ...commonStyles.text.heading,
                  fontSize: DESIGN_TOKENS.fontSizes.lg,
                  marginBottom: DESIGN_TOKENS.spacing.sm
                }}>
                  검색 결과가 없습니다
                </h3>
                <p style={{
                  ...commonStyles.text.secondary,
                  marginBottom: DESIGN_TOKENS.spacing.lg
                }}>
                  다른 검색어를 시도해보세요
                </p>
                <Button
                  variant="outline"
                  size="medium"
                  onClick={clearSearch}
                >
                  검색 초기화
                </Button>
              </div>
            )}
          </section>
        )}

        {/* 기본 섹션들 (검색하지 않았을 때만 표시) */}
        {!hasSearched && (
          <>
            {/* Featured Items Section */}
            <section style={{ 
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ 
                width: '100%',
                maxWidth: '1200px',
                padding: `${DESIGN_TOKENS.spacing.xl} ${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h2 style={{
                  ...commonStyles.text.heading,
                  fontSize: DESIGN_TOKENS.fontSizes.xl,
                  lineHeight: DESIGN_TOKENS.lineHeights.tight,
                  margin: 0,
                  textAlign: 'left'
                }}>
                  Featured Items
                </h2>
              </div>
              
              <div style={{
                width: '100%',
                maxWidth: '1200px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <HorizontalScrollContainer>
                  {featuredItems.map((item) => (
                    <RealTimeItemCard 
                      key={item.id} 
                      item={item}
                      onItemClick={handleItemClick}
                      onBidClick={handleBidClick}
                      showRealTimeUpdates={true}
                    />
                  ))}
                </HorizontalScrollContainer>
              </div>
            </section>

            {/* Ending Soon Section */}
            <section style={{ 
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: DESIGN_TOKENS.spacing.md,
              padding: DESIGN_TOKENS.spacing.lg
            }}>
              <div style={{ 
                width: '100%',
                maxWidth: '1200px',
                padding: `${DESIGN_TOKENS.spacing.xl} ${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h2 style={{
                  ...commonStyles.text.heading,
                  fontSize: DESIGN_TOKENS.fontSizes.xl,
                  lineHeight: DESIGN_TOKENS.lineHeights.tight,
                  margin: 0,
                  textAlign: 'left'
                }}>
                  Ending Items
                </h2>
              </div>
              
              <div style={{
                width: '100%',
                maxWidth: '1200px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <HorizontalScrollContainer>
                  {endingSoonItems.map((item) => (
                    <RealTimeItemCard 
                      key={item.id} 
                      item={item}
                      onItemClick={handleItemClick}
                      onBidClick={handleBidClick}
                      showRealTimeUpdates={true}
                    />
                  ))}
                </HorizontalScrollContainer>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default MainPage;
