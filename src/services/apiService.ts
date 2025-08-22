import {
  Item,
  Category,
  ItemsAPIResponse,
  SearchSuggestion,
  APIOptions,
} from "@/types";

// Mock API 구현
class APIService {
  private delay: number = 500;

  setDelay(delay: number): void {
    this.delay = delay;
  }

  private async mockDelay(): Promise<void> {
    if (this.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delay));
    }
  }

  async getAllItems(options: APIOptions = {}): Promise<ItemsAPIResponse> {
    await this.mockDelay();

    // Featured items와 Ending soon items를 합쳐서 반환
    const [featuredItems, endingSoonItems] = await Promise.all([
      this.getFeaturedItems(),
      this.getEndingSoonItems(),
    ]);

    let allItems = [...featuredItems, ...endingSoonItems];

    // 검색 필터링
    if (options.search) {
      const searchTerm = options.search.toLowerCase();
      allItems = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm),
      );
    }

    // 카테고리 필터링
    if (options.category && options.category.length > 0) {
      allItems = allItems.filter((item) =>
        options.category!.includes(item.category.toLowerCase()),
      );
    }

    // 가격 범위 필터링
    if (options.priceRange) {
      allItems = allItems.filter(
        (item) =>
          item.currentBid >= options.priceRange!.min &&
          item.currentBid <= options.priceRange!.max,
      );
    }

    // 정렬
    if (options.sortBy) {
      switch (options.sortBy) {
        case "price-low":
          allItems.sort((a, b) => a.currentBid - b.currentBid);
          break;
        case "price-high":
          allItems.sort((a, b) => b.currentBid - a.currentBid);
          break;
        case "popular":
          allItems.sort((a, b) => b.totalBids - a.totalBids);
          break;
        case "oldest":
          allItems.sort(
            (a, b) =>
              new Date(a.endTime).getTime() - new Date(b.endTime).getTime(),
          );
          break;
        default: // newest
          allItems.sort(
            (a, b) =>
              new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
          );
      }
    }

    // 페이지네이션
    const page = options.page || 1;
    const limit = options.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = allItems.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total: allItems.length,
      page,
      limit,
      filters: {
        search: options.search || "",
        category: options.category || [],
        priceRange: options.priceRange || { min: 0, max: 100000 },
        sortBy: options.sortBy || "newest",
        available: {
          categories: await this.getCategories(),
          sortOptions: [
            { value: "newest", label: "Newest First" },
            { value: "oldest", label: "Oldest First" },
            { value: "price-low", label: "Price: Low to High" },
            { value: "price-high", label: "Price: High to Low" },
            { value: "popular", label: "Most Popular" },
          ],
        },
      },
    };
  }

  async getFeaturedItems(limit?: number): Promise<Item[]> {
    await this.mockDelay();

    try {
      const response = await fetch("/data/featured-items.json");
      const items: Item[] = await response.json();
      return limit ? items.slice(0, limit) : items;
    } catch (error) {
      console.error("Failed to fetch featured items:", error);
      return this.getFallbackFeaturedItems(limit);
    }
  }

  async getEndingSoonItems(limit?: number): Promise<Item[]> {
    await this.mockDelay();

    try {
      const response = await fetch("/data/ending-soon.json");
      const items: Item[] = await response.json();
      return limit ? items.slice(0, limit) : items;
    } catch (error) {
      console.error("Failed to fetch ending soon items:", error);
      return this.getFallbackEndingSoonItems(limit);
    }
  }

  async getItemsByCategory(
    categoryId: string,
    options: APIOptions = {},
  ): Promise<ItemsAPIResponse> {
    const categoryOptions = {
      ...options,
      category: [categoryId.toLowerCase()],
    };
    return this.getAllItems(categoryOptions);
  }

  async getItemDetail(itemId: string): Promise<Item> {
    await this.mockDelay();

    const [featuredItems, endingSoonItems] = await Promise.all([
      this.getFeaturedItems(),
      this.getEndingSoonItems(),
    ]);

    const allItems = [...featuredItems, ...endingSoonItems];
    const item = allItems.find((item) => item.id === itemId);

    if (!item) {
      throw new Error(`Item with id ${itemId} not found`);
    }

    return item;
  }

  async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    await this.mockDelay();

    if (query.length < 2) {
      return [];
    }

    const [featuredItems, endingSoonItems] = await Promise.all([
      this.getFeaturedItems(),
      this.getEndingSoonItems(),
    ]);

    const allItems = [...featuredItems, ...endingSoonItems];
    const queryLower = query.toLowerCase();

    // 제목에서 키워드 추출
    const suggestions = new Map<string, number>();

    allItems.forEach((item) => {
      const words = item.title.toLowerCase().split(" ");
      words.forEach((word) => {
        if (word.includes(queryLower) && word.length > 2) {
          const count = suggestions.get(word) || 0;
          suggestions.set(word, count + 1);
        }
      });

      // 카테고리도 포함
      if (item.category.toLowerCase().includes(queryLower)) {
        const count = suggestions.get(item.category) || 0;
        suggestions.set(item.category, count + 1);
      }
    });

    return Array.from(suggestions.entries())
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  async getCategories(): Promise<Category[]> {
    await this.mockDelay();

    const [featuredItems, endingSoonItems] = await Promise.all([
      this.getFeaturedItems(),
      this.getEndingSoonItems(),
    ]);

    const allItems = [...featuredItems, ...endingSoonItems];
    const categoryCount = new Map<string, number>();

    allItems.forEach((item) => {
      const count = categoryCount.get(item.category) || 0;
      categoryCount.set(item.category, count + 1);
    });

    return Array.from(categoryCount.entries()).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      count,
    }));
  }

  private getFallbackFeaturedItems(limit?: number): Item[] {
    const fallbackItems: Item[] = [
      {
        id: "fallback-featured-1",
        title: "Vintage Watch Collection",
        description: "A rare collection of vintage watches",
        image: "/images/pocket-watch.jpg",
        startingBid: 5000,
        currentBid: 7500,
        totalBids: 12,
        seller: {
          id: "seller1",
          name: "WatchCollector",
          rating: 4.8,
          totalSales: 45,
        },
        location: "New York, NY",
        condition: "vintage",
        tags: ["vintage", "watches", "collectible"],
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Antiques & Collectibles",
        featured: true,
        endingSoon: false,
      },
      {
        id: "fallback-featured-2",
        title: "Classic Car Model",
        description: "Detailed model of a classic car",
        image: "/images/mustang.jpg",
        startingBid: 2000,
        currentBid: 2500,
        totalBids: 8,
        seller: {
          id: "seller2",
          name: "CarEnthusiast",
          rating: 4.5,
          totalSales: 23,
        },
        location: "Los Angeles, CA",
        condition: "new",
        tags: ["cars", "models", "collectible"],
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Toys & Games",
        featured: true,
        endingSoon: false,
      },
    ];

    return limit ? fallbackItems.slice(0, limit) : fallbackItems;
  }

  private getFallbackEndingSoonItems(limit?: number): Item[] {
    const fallbackItems: Item[] = [
      {
        id: "fallback-ending-1",
        title: "Diamond Ring",
        description: "Beautiful diamond engagement ring",
        image: "/images/diamond-ring.jpg",
        startingBid: 8000,
        currentBid: 12000,
        totalBids: 25,
        seller: {
          id: "seller3",
          name: "JewelryExpert",
          rating: 4.9,
          totalSales: 67,
        },
        location: "Chicago, IL",
        condition: "new",
        tags: ["jewelry", "diamond", "engagement"],
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
        category: "Jewelry & Watches",
        featured: false,
        endingSoon: true,
      },
    ];

    return limit ? fallbackItems.slice(0, limit) : fallbackItems;
  }
}

export const apiService = new APIService();
