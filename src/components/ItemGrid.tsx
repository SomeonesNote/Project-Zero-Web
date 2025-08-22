import { memo } from "react";
import { ItemGridProps } from "@/types";
import ItemCard from "./ItemCard";

const ItemGrid = memo<ItemGridProps>(
  ({
    items,
    loading = false,
    error = null,
    className = "",
    onItemClick,
    onBidClick,
  }) => {
    if (loading) {
      return (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-brand-secondary mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            다시 시도
          </button>
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-brand-secondary text-lg">상품이 없습니다.</p>
        </div>
      );
    }

    return (
      <div className={className}>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onItemClick={onItemClick}
            onBidClick={onBidClick}
            showBidButton={true}
            className="w-full"
          />
        ))}
      </div>
    );
  },
);

ItemGrid.displayName = "ItemGrid";

export default ItemGrid;
