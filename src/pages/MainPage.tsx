import { useMainPageViewModel } from '../hooks/useMainPageViewModel';
import AuctionItemList from '../components/AuctionItemList';

export default function MainPage() {
  const {
    auctioningItems,
    completedItems,
    searchTerm,
    recentSearches,
    handleSearchChange,
    handleSearchSubmit,
    handleDeleteRecentSearch,
  } = useMainPageViewModel();

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{fontFamily: '"Work Sans", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f5] py-3 bg-gray-200">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-[#111418]">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">BidHub</h2>
            </div>
            {/* 중간 부분은 비워둡니다. */}
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-blue-500 text-white">로그인</button>
              <button className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800">회원가입</button>
            </div>
          </div>
        </header>
        <div className="px-60 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[1280px] flex-1 px-14 gap-y-12">
            <form onSubmit={handleSearchSubmit} className="px-4 py-3">
              <label className="flex flex-col w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-20"> {/* Increased height to h-20 */}
                  <div
                    className="text-[#60758a] flex border-none bg-[#f0f2f5] items-center justify-center pl-4 rounded-l-lg border-r-0"
                    data-icon="MagnifyingGlass"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none h-full placeholder:text-[#60758a] px-4 rounded-l-none border-l-0 pl-2 text-xl" /* Increased text size to text-xl */
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  {/* Removed search button */}
                </div>
              </label>
            </form>

            {/* 이전 검색 기록 */}
            {recentSearches.length > 0 && (
              <div className="px-4 py-2">
                <h4 className="text-md font-semibold mb-2">최근 검색어:</h4>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, index) => (
                    <div
                      key={index}
                      className="relative flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700 group"
                    >
                      <span>{term}</span>
                      <button
                        onClick={() => handleDeleteRecentSearch(term)}
                        className="ml-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="삭제"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            
            {/* 경매 물품 (Auction Items) */}
            <AuctionItemList
              title="경매 물품"
              items={auctioningItems}
              emptyMessage="현재 경매 중인 물품이 없습니다."
              priceLabel="현재 최고 입찰가"
            />

            {/* 경매 완료 물품 (Completed Auction Items) */}
            <AuctionItemList
              title="경매 완료 물품"
              items={completedItems}
              emptyMessage="완료된 경매 물품이 없습니다."
              priceLabel="최종 낙찰가"
            />
            
            
          </div>
          {/*
            TODO: Implement mouse drag scrolling for AuctionItemList components.
            This would involve adding event listeners (mousedown, mouseup, mousemove)
            to the scrollable div within AuctionItemList.tsx to enable dragging.
            Example:
            const scrollRef = useRef(null);
            const isDragging = useRef(false);
            const startPos = useRef(0);
            const scrollLeft = useRef(0);

            const handleMouseDown = (e) => {
              isDragging.current = true;
              startPos.current = e.pageX - scrollRef.current.offsetLeft;
              scrollLeft.current = scrollRef.current.scrollLeft;
            };

            const handleMouseMove = (e) => {
              if (!isDragging.current) return;
              e.preventDefault();
              const x = e.pageX - scrollRef.current.offsetLeft;
              const walk = (x - startPos.current) * 2; // Adjust scroll speed
              scrollRef.current.scrollLeft = scrollLeft.current - walk;
            };

            const handleMouseUp = () => {
              isDragging.current = false;
            };

            // Attach these handlers to the scrollable div in AuctionItemList.tsx
            // <div ref={scrollRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} className="p-4 overflow-x-auto whitespace-nowrap">
          */}
        </div>
      </div>
    </div>
  )
}