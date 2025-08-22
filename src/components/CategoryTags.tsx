import { useState, useEffect } from "react";
import { CategoryTagsProps } from "@/types";

const CategoryTags: React.FC<CategoryTagsProps> = ({
  categories,
  selectedCategories = [],
  multiSelect = false,
  className = "",
  onCategoryChange,
}) => {
  const [selected, setSelected] = useState<string[]>(selectedCategories);

  // selectedCategories prop이 변경되면 로컬 state 업데이트
  useEffect(() => {
    setSelected(selectedCategories);
  }, [selectedCategories]);

  const handleCategoryClick = (categoryId: string) => {
    let newSelected: string[];

    if (multiSelect) {
      // 다중 선택 모드
      if (selected.includes(categoryId)) {
        newSelected = selected.filter((id) => id !== categoryId);
      } else {
        newSelected = [...selected, categoryId];
      }
    } else {
      // 단일 선택 모드
      if (selected.includes(categoryId)) {
        newSelected = []; // 이미 선택된 항목 클릭 시 선택 해제
      } else {
        newSelected = [categoryId];
      }
    }

    setSelected(newSelected);
    onCategoryChange(newSelected);
  };

  const handleSelectAll = () => {
    const newSelected: string[] = [];
    setSelected(newSelected);
    onCategoryChange(newSelected);
  };

  const isSelected = (categoryId: string): boolean => {
    return selected.includes(categoryId);
  };

  const hasAnySelection = selected.length > 0;

  return (
    <div className={`${className}`}>
      <div className="flex flex-wrap gap-3">
        {/* "All" 버튼 */}
        <button
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            !hasAnySelection
              ? "bg-brand-primary text-white"
              : "bg-gray-100 text-brand-secondary hover:bg-gray-200"
          }`}
          onClick={handleSelectAll}
          aria-pressed={!hasAnySelection}
        >
          <span>All Categories</span>
          {!hasAnySelection && (
            <span className="ml-1 text-white/80">
              ({categories.reduce((sum, cat) => sum + (cat.count || 0), 0)})
            </span>
          )}
        </button>

        {/* 카테고리 태그들 */}
        {categories.map((category) => {
          const active = isSelected(category.id);

          return (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full font-medium transition-colors capitalize ${
                active
                  ? "bg-brand-primary text-white"
                  : "bg-gray-100 text-brand-secondary hover:bg-gray-200 hover:text-brand-dark"
              }`}
              onClick={() => handleCategoryClick(category.id)}
              aria-pressed={active}
              title={`${category.name} 카테고리${category.count ? ` (${category.count}개 상품)` : ""}`}
            >
              <span>{category.name}</span>
              {category.count !== undefined && (
                <span
                  className={`ml-1 ${active ? "text-white/80" : "text-brand-secondary"}`}
                >
                  ({category.count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 선택된 카테고리 요약 (다중 선택 모드에서) */}
      {multiSelect && hasAnySelection && (
        <div className="selected-categories-summary">
          <span className="summary-text">
            선택된 카테고리: {selected.length}개
          </span>
          <button
            className="clear-all-button"
            onClick={handleSelectAll}
            aria-label="모든 카테고리 선택 해제"
          >
            모두 해제
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryTags;
