import React from 'react';

interface Item {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  status: "auctioning" | "completed"; // This might not be needed in the component itself, but good for consistency
}

interface AuctionItemListProps {
  title: string;
  items: Item[];
  emptyMessage: string;
  priceLabel: string; // To differentiate "현재 최고 입찰가" and "최종 낙찰가"
}

const AuctionItemList: React.FC<AuctionItemListProps> = ({ title, items, emptyMessage, priceLabel }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);
  const startPos = React.useRef(0);
  const scrollLeft = React.useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    e.preventDefault(); // Prevent default behavior (e.g., text selection, image drag)
    isDragging.current = true;
    startPos.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startPos.current) * 2; // Adjust scroll speed
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  return (
    <>
      <h3 className="text-lg font-bold px-4 py-2">{title}</h3>
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves the area
        className="p-4 overflow-x-auto whitespace-nowrap hide-scrollbar select-none"
        style={{ cursor: 'grab' }} // Initial cursor style
      >
        {items.length > 0 ? (
          <div className="flex space-x-8 pb-4">
            {items.map(item => (
              <div key={item.id} className="flex-none w-80 bg-blue-100 rounded-[30px] shadow-md overflow-hidden border border-gray-200 mr-4">
                <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover" draggable="false"/>
                <div className="p-4 text-center"> {/* Added text-center */}
                  <h4 className="text-md font-semibold truncate">{item.name}</h4>
                  <p className="text-gray-700 text-sm mt-1">{priceLabel}: {item.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>{emptyMessage}</p>
        )}
      </div>
    </>
  );
};

export default AuctionItemList;