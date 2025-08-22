import { memo, useState } from "react";
import { ItemCardProps } from "@/types";
import { usePrefetchItem } from "@/hooks/useItems";

const ItemCard = memo<ItemCardProps>(
  ({
    item,
    size = "medium",
    showBidButton = true,
    className = "",
    onItemClick,
    onBidClick,
  }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const { prefetchItem } = usePrefetchItem();

    const handleMouseEnter = () => {
      prefetchItem(item.id);
    };

    const handleCardClick = () => {
      onItemClick(item);
    };

    const handleBidClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onBidClick(item);
    };

    const handleImageLoad = () => {
      setImageLoading(false);
    };

    const handleImageError = () => {
      setImageLoading(false);
      setImageError(true);
    };

    const formatPrice = (price: number): string => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
    };

    const getTimeLeft = (): string => {
      const now = new Date().getTime();
      const endTime = new Date(item.endTime).getTime();
      const timeLeft = endTime - now;

      if (timeLeft <= 0) {
        return "Ended";
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        return `${days}d ${hours}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    };

    return (
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 ${className}`}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
      >
        {/* 이미지 */}
        <div className="relative w-full h-48 bg-gray-100">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          ) : (
            <img
              src={item.image}
              alt={item.title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover ${imageLoading ? "opacity-0" : "opacity-100"} transition-opacity`}
              loading="lazy"
            />
          )}

          {/* 하트 아이콘 */}
          <div className="absolute top-3 right-3">
            <button
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 카드 내용 */}
        <div className="p-4">
          <h3
            className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm"
            title={item.title}
          >
            {item.title}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(item.currentBid)}
            </p>
            <p className="text-xs text-gray-500">{getTimeLeft()}</p>
          </div>

          {showBidButton && (
            <button
              className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                getTimeLeft() === "Ended"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={handleBidClick}
              disabled={getTimeLeft() === "Ended"}
            >
              {getTimeLeft() === "Ended" ? "Auction Ended" : "Place Bid"}
            </button>
          )}
        </div>
      </div>
    );
  },
);

ItemCard.displayName = "ItemCard";

export default ItemCard;
