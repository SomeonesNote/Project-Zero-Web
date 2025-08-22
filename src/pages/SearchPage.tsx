import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import CategoryTags from "@/components/CategoryTags";
import ItemGrid from "@/components/ItemGrid";
import Pagination from "@/components/Pagination";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAllItems, useCategories } from "@/hooks/useItems";
import { APIOptions } from "@/types";

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { categoryId } = useParams();

  // URL 파라미터에서 검색 조건 추출
  const searchQuery = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const selectedSort = searchParams.get("sort") || "newest";
  const featured = searchParams.get("featured") === "true";
  const endingSoon = searchParams.get("endingSoon") === "true";

  // 로컬 상태
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryId ? [categoryId] : [],
  );
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

  // API 옵션 구성
  const apiOptions: APIOptions = {
    search: searchQuery,
    category: selectedCategories.length > 0 ? selectedCategories : undefined,
    page: currentPage,
    limit: 12,
    sortBy: selectedSort,
    priceRange,
  };

  // 데이터 가져오기
  const { data: searchResults, isLoading, error } = useAllItems(apiOptions);
  const { data: categories = [] } = useCategories();

  // URL이 변경될 때 상태 업데이트
  useEffect(() => {
    if (categoryId) {
      setSelectedCategories([categoryId]);
    }
  }, [categoryId]);

  const handleSearch = (searchTerm: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set("q", searchTerm);
    } else {
      newParams.delete("q");
    }
    newParams.delete("page"); // 새 검색 시 첫 페이지로
    setSearchParams(newParams);
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);

    const newParams = new URLSearchParams(searchParams);
    if (categories.length > 0) {
      newParams.set("category", categories.join(","));
    } else {
      newParams.delete("category");
    }
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", newSort);
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);

    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemClick = (item: any) => {
    navigate(`/item/${item.id}`);
  };

  const handleBidClick = (item: any) => {
    navigate(`/item/${item.id}?action=bid`);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 100000 });
    setSearchParams({});
  };

  // 검색 결과 요약
  const getResultSummary = () => {
    if (!searchResults) return "";

    const { total } = searchResults;
    let summary = `${total.toLocaleString()}개의 상품`;

    if (searchQuery) {
      summary += ` "${searchQuery}" 검색 결과`;
    }

    if (selectedCategories.length > 0) {
      const categoryNames = selectedCategories
        .map((id) => categories.find((cat) => cat.id === id)?.name)
        .filter(Boolean)
        .join(", ");
      summary += ` in ${categoryNames}`;
    }

    return summary;
  };

  return (
    <div className="search-page">
      {/* 검색 헤더 */}
      <section className="search-header">
        <div className="search-header-content">
          <SearchBar
            placeholder="상품을 검색해보세요..."
            size="large"
            initialValue={searchQuery}
            onSearch={handleSearch}
          />

          {searchQuery && (
            <div className="search-query-display">
              <span>검색어: "{searchQuery}"</span>
              <button
                className="clear-search"
                onClick={() => handleSearch("")}
                aria-label="검색어 지우기"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="search-content">
        {/* 필터 사이드바 */}
        <aside className="search-filters">
          <div className="filter-header">
            <h3>필터</h3>
            {(selectedCategories.length > 0 || searchQuery) && (
              <button className="clear-filters" onClick={clearFilters}>
                모두 지우기
              </button>
            )}
          </div>

          {/* 카테고리 필터 */}
          <div className="filter-section">
            <h4>카테고리</h4>
            <CategoryTags
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              multiSelect={true}
            />
          </div>

          {/* 가격 범위 필터 */}
          <div className="filter-section">
            <h4>가격 범위</h4>
            <div className="price-range">
              <input
                type="range"
                min="0"
                max="100000"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({
                    ...prev,
                    max: parseInt(e.target.value),
                  }))
                }
                className="price-slider"
              />
              <div className="price-labels">
                <span>$0</span>
                <span>${priceRange.max.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* 검색 결과 */}
        <main className="search-results">
          {/* 결과 헤더 */}
          <div className="results-header">
            <div className="results-info">
              {isLoading ? (
                <span>검색 중...</span>
              ) : (
                <span>{getResultSummary()}</span>
              )}
            </div>

            <div className="results-controls">
              <div className="sort-controls">
                <label htmlFor="sort-select">정렬:</label>
                <select
                  id="sort-select"
                  value={selectedSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="newest">최신순</option>
                  <option value="oldest">등록순</option>
                  <option value="price-low">가격 낮은순</option>
                  <option value="price-high">가격 높은순</option>
                  <option value="popular">인기순</option>
                </select>
              </div>
            </div>
          </div>

          {/* 검색 결과 그리드 */}
          {isLoading ? (
            <LoadingSpinner size="large" text="검색 중..." />
          ) : error ? (
            <div className="error-message">
              <h3>검색 중 오류가 발생했습니다</h3>
              <p>잠시 후 다시 시도해주세요.</p>
              <button onClick={() => window.location.reload()}>새로고침</button>
            </div>
          ) : searchResults?.items.length === 0 ? (
            <div className="no-results">
              <div className="no-results-content">
                <h3>검색 결과가 없습니다</h3>
                <p>다른 검색어나 필터를 시도해보세요.</p>
                <button onClick={clearFilters}>필터 초기화</button>
              </div>
            </div>
          ) : (
            <>
              <ItemGrid
                items={searchResults?.items || []}
                onItemClick={handleItemClick}
                onBidClick={handleBidClick}
                loading={isLoading}
                error={error as string}
              />

              {/* 페이지네이션 */}
              {searchResults && searchResults.total > searchResults.limit && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={searchResults.total}
                  itemsPerPage={searchResults.limit}
                  onPageChange={handlePageChange}
                  className="search-pagination"
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
