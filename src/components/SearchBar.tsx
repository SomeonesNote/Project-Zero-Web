import { useState, useRef, useEffect, useCallback } from "react";
import { SearchBarProps } from "@/types";
import { useSearchSuggestions } from "@/hooks/useItems";
import { useSearchHistory } from "@/store/AppContext";

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "찾고 싶은 상품을 검색해보세요...",
  size = "medium",
  initialValue = "",
  className = "",
  onSearch,
  onSearchInput,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { history, add: addToHistory } = useSearchHistory();

  // 검색 제안 가져오기 (디바운싱 적용)
  const { data: suggestions = [], isLoading: suggestionsLoading } =
    useSearchSuggestions(searchTerm.length >= 2 ? searchTerm : "");

  // 입력 핸들러 (디바운싱)
  const debouncedOnSearchInput = useCallback(
    debounce((term: string) => {
      onSearchInput?.(term);
    }, 300),
    [onSearchInput],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedSuggestionIndex(-1);

    if (value.trim()) {
      setShowSuggestions(true);
      debouncedOnSearchInput(value);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (term: string = searchTerm) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    onSearch(trimmedTerm);
    addToHistory(trimmedTerm);
    setShowSuggestions(false);
    setSearchTerm("");
    searchInputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    const allSuggestions = [...history.slice(0, 3), ...suggestions];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          Math.min(prev + 1, allSuggestions.length - 1),
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => Math.max(prev - 1, -1));
        break;

      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          const suggestion = allSuggestions[selectedSuggestionIndex];
          const suggestionText =
            typeof suggestion === "string" ? suggestion : suggestion.term;
          handleSearch(suggestionText);
        } else {
          handleSearch();
        }
        break;

      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const handleFocus = () => {
    if (searchTerm.length >= 2 || history.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // 제안 목록을 클릭할 때는 blur를 무시
    if (suggestionsRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }

    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 150);
  };

  // 클릭 외부 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeClasses = {
    small: "h-10 text-sm",
    medium: "h-12 text-base",
    large: "h-12 text-base",
  };

  const allSuggestions = showSuggestions
    ? [...history.slice(0, 3), ...suggestions]
    : [];

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className={`relative flex items-center ${sizeClasses[size]} bg-gray-50 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all`}
      >
        <div className="absolute left-3 text-gray-400">
          <svg
            className="w-5 h-5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
          autoComplete="off"
          role="searchbox"
          aria-label="상품 검색"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
        />

        {searchTerm && (
          <button
            type="button"
            className="absolute right-3 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => {
              setSearchTerm("");
              setShowSuggestions(false);
              searchInputRef.current?.focus();
            }}
            aria-label="검색어 지우기"
          >
            ×
          </button>
        )}
      </div>

      {/* 검색 제안 드롭다운 */}
      {showSuggestions && (allSuggestions.length > 0 || suggestionsLoading) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          role="listbox"
        >
          {suggestionsLoading && searchTerm.length >= 2 && (
            <div className="px-4 py-3 text-gray-500 text-sm">
              <span>검색 중...</span>
            </div>
          )}

          {/* 검색 히스토리 */}
          {history.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50">
                최근 검색어
              </div>
              {history.slice(0, 3).map((term, index) => (
                <div
                  key={`history-${index}`}
                  className={`px-4 py-3 cursor-pointer flex items-center gap-3 hover:bg-gray-50 ${
                    selectedSuggestionIndex === index
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                  onClick={() => handleSuggestionClick(term)}
                  role="option"
                  aria-selected={selectedSuggestionIndex === index}
                >
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 8V12L16 16M22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{term}</span>
                </div>
              ))}
            </>
          )}

          {/* 검색 제안 */}
          {suggestions.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50">
                추천 검색어
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={`suggestion-${index}`}
                  className={`px-4 py-3 cursor-pointer flex items-center gap-3 hover:bg-gray-50 ${
                    selectedSuggestionIndex ===
                    history.slice(0, 3).length + index
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                  onClick={() => handleSuggestionClick(suggestion.term)}
                  role="option"
                  aria-selected={
                    selectedSuggestionIndex ===
                    history.slice(0, 3).length + index
                  }
                >
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="flex-1">{suggestion.term}</span>
                  <span className="text-xs text-gray-400">
                    ({suggestion.count})
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
