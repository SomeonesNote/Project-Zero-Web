import { useMemo } from "react";
import { PaginationProps } from "@/types";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  maxVisiblePages = 5,
  className = "",
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginationData = useMemo(() => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // 시작점 조정
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    // 첫 페이지와 '...' 추가
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    // 중간 페이지들 추가
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // '...'와 마지막 페이지 추가
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return {
      pages,
      hasPrev: currentPage > 1,
      hasNext: currentPage < totalPages,
      startItem: (currentPage - 1) * itemsPerPage + 1,
      endItem: Math.min(currentPage * itemsPerPage, totalItems),
    };
  }, [currentPage, totalPages, maxVisiblePages, totalItems, itemsPerPage]);

  if (!paginationData) return null;

  const { pages, hasPrev, hasNext, startItem, endItem } = paginationData;

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePrevClick = () => {
    if (hasPrev) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (hasNext) {
      onPageChange(currentPage + 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    page: number | (() => void),
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (typeof page === "number") {
        handlePageClick(page);
      } else {
        page();
      }
    }
  };

  return (
    <div className={`pagination-container ${className}`}>
      {/* 결과 요약 */}
      <div className="pagination-info">
        <span className="result-summary">
          {startItem}-{endItem} of {totalItems.toLocaleString()} items
        </span>
      </div>

      {/* 페이지네이션 */}
      <nav className="pagination" role="navigation" aria-label="페이지네이션">
        {/* 이전 페이지 버튼 */}
        <button
          className={`pagination-button prev ${!hasPrev ? "disabled" : ""}`}
          onClick={handlePrevClick}
          onKeyDown={(e) => handleKeyDown(e, handlePrevClick)}
          disabled={!hasPrev}
          aria-label="이전 페이지"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="button-text">Previous</span>
        </button>

        {/* 페이지 번호들 */}
        <div className="page-numbers">
          {pages.map((page, index) => (
            <div key={index}>
              {typeof page === "number" ? (
                <button
                  className={`page-button ${
                    page === currentPage ? "active" : ""
                  }`}
                  onClick={() => handlePageClick(page)}
                  onKeyDown={(e) => handleKeyDown(e, page)}
                  aria-label={`페이지 ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ) : (
                <span className="page-ellipsis" aria-hidden="true">
                  {page}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 다음 페이지 버튼 */}
        <button
          className={`pagination-button next ${!hasNext ? "disabled" : ""}`}
          onClick={handleNextClick}
          onKeyDown={(e) => handleKeyDown(e, handleNextClick)}
          disabled={!hasNext}
          aria-label="다음 페이지"
        >
          <span className="button-text">Next</span>
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>

      {/* 모바일용 간단한 페이지네이션 */}
      <div className="pagination-mobile">
        <button
          className={`mobile-page-button ${!hasPrev ? "disabled" : ""}`}
          onClick={handlePrevClick}
          disabled={!hasPrev}
          aria-label="이전 페이지"
        >
          ←
        </button>

        <span className="mobile-page-info">
          {currentPage} / {totalPages}
        </span>

        <button
          className={`mobile-page-button ${!hasNext ? "disabled" : ""}`}
          onClick={handleNextClick}
          disabled={!hasNext}
          aria-label="다음 페이지"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
