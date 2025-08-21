import {
  APIInterface,
  APIOptions,
  Category,
  Item,
  ItemsAPIResponse,
  SearchSuggestion,
} from "../types";

export const API_RESPONSE_FORMAT = {
  success: true,
  data: null,
  message: "API 응답이 성공적으로 처리되었습니다.",
  timestamp: new Date().toISOString(),
};

export const ITEM_DATA_FORMAT = {
  id: "unique-id",
  title: "상품 제목",
  description: "상품 설명",
  image: "image-url.jpg",
  startingBid: 10000,
  currentBid: 15000,
  totalBids: 5,
  seller: {
    id: "seller-id",
    name: "판매자명",
    rating: 4.5,
    totalSales: 100,
  },
  location: "서울시 강남구",
  condition: "new" as const,
  tags: ["태그1", "태그2"],
  endTime: "2024-12-31T23:59:59Z",
  category: "전자제품",
  featured: false,
  endingSoon: false,
};

export const SAMPLE_ITEMS: Item[] = [
  {
    id: "1",
    title: "빈티지 레트로 라디오",
    description:
      "1960년대 스타일의 아날로그 라디오입니다. 완벽한 작동 상태이며 수집가들에게 인기가 많습니다.",
    image: "images/vintage-radio.jpg",
    startingBid: 50000,
    currentBid: 75000,
    totalBids: 12,
    seller: {
      id: "seller1",
      name: "빈티지컬렉터",
      rating: 4.8,
      totalSales: 150,
    },
    location: "서울시 강남구",
    condition: "vintage",
    tags: ["빈티지", "라디오", "레트로", "수집품"],
    endTime: "2024-12-25T23:59:59Z",
    category: "전자제품",
    featured: true,
    endingSoon: false,
  },
  {
    id: "2",
    title: "명품 가죽 백팩",
    description:
      "이탈리아산 프리미엄 가죽으로 제작된 백팩입니다. 실용적이면서도 세련된 디자인입니다.",
    image: "images/leather-backpack.jpg",
    startingBid: 200000,
    currentBid: 280000,
    totalBids: 8,
    seller: {
      id: "seller2",
      name: "럭셔리백스토어",
      rating: 4.9,
      totalSales: 89,
    },
    location: "부산시 해운대구",
    condition: "new",
    tags: ["명품", "가죽", "백팩", "프리미엄"],
    endTime: "2024-12-28T23:59:59Z",
    category: "패션",
    featured: true,
    endingSoon: false,
  },
  {
    id: "3",
    title: "골동품 청화백자",
    description:
      "조선시대 청화백자 항아리입니다. 보존 상태가 매우 양호하며 골동품 수집가들에게 추천합니다.",
    image: "images/antique-vase.jpg",
    startingBid: 1500000,
    currentBid: 1800000,
    totalBids: 25,
    seller: {
      id: "seller3",
      name: "골동품갤러리",
      rating: 4.7,
      totalSales: 67,
    },
    location: "경주시",
    condition: "antique",
    tags: ["골동품", "청화백자", "조선시대", "도자기"],
    endTime: "2024-12-20T23:59:59Z",
    category: "골동품",
    featured: false,
    endingSoon: true,
  },
  {
    id: "4",
    title: "스마트폰 거치대",
    description:
      "다양한 각도로 조절 가능한 스마트폰 거치대입니다. 홈오피스에 최적화되어 있습니다.",
    image: "images/phone-stand.jpg",
    startingBid: 15000,
    currentBid: 22000,
    totalBids: 6,
    seller: {
      id: "seller4",
      name: "테크샵",
      rating: 4.6,
      totalSales: 234,
    },
    location: "대구시 수성구",
    condition: "new",
    tags: ["스마트폰", "거치대", "홈오피스", "액세서리"],
    endTime: "2024-12-30T23:59:59Z",
    category: "전자제품",
    featured: false,
    endingSoon: false,
  },
];

export const SAMPLE_CATEGORIES: Category[] = [
  { id: "electronics", name: "전자제품", count: 45 },
  { id: "fashion", name: "패션", count: 32 },
  { id: "antiques", name: "골동품", count: 18 },
  { id: "sports", name: "스포츠용품", count: 28 },
  { id: "books", name: "도서", count: 56 },
  { id: "art", name: "예술품", count: 23 },
  { id: "automotive", name: "자동차", count: 12 },
  { id: "real-estate", name: "부동산", count: 8 },
];

export class MockAPI implements APIInterface {
  private delay: number = 500;

  constructor(delay: number = 500) {
    this.delay = delay;
  }

  async getAllItems(options: APIOptions = {}): Promise<ItemsAPIResponse> {
    await this.simulateDelay();

    let filteredItems = [...SAMPLE_ITEMS];

    // 검색 필터링
    if (options.search) {
      const searchTerm = options.search.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      );
    }

    // 카테고리 필터링
    if (options.category && options.category.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        options.category!.includes(item.category),
      );
    }

    // 정렬
    if (options.sortBy) {
      switch (options.sortBy) {
        case "price-low":
          filteredItems.sort((a, b) => a.currentBid - b.currentBid);
          break;
        case "price-high":
          filteredItems.sort((a, b) => b.currentBid - a.currentBid);
          break;
        case "ending-soon":
          filteredItems.sort(
            (a, b) =>
              new Date(a.endTime).getTime() - new Date(b.endTime).getTime(),
          );
          break;
        case "newest":
          filteredItems.sort(
            (a, b) =>
              new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
          );
          break;
        default:
          // 기본 정렬 (featured -> ending soon -> 일반)
          filteredItems.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            if (a.endingSoon && !b.endingSoon) return -1;
            if (!a.endingSoon && b.endingSoon) return 1;
            return 0;
          });
      }
    }

    // 페이지네이션
    const page = options.page || 1;
    const limit = options.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total: filteredItems.length,
      page,
      limit,
      filters: {
        search: options.search || "",
        category: options.category || [],
        priceRange: options.priceRange || { min: 0, max: 10000000 },
        sortBy: options.sortBy || "default",
        available: {
          categories: SAMPLE_CATEGORIES,
          sortOptions: [
            { value: "default", label: "기본순" },
            { value: "price-low", label: "가격 낮은순" },
            { value: "price-high", label: "가격 높은순" },
            { value: "ending-soon", label: "마감임박순" },
            { value: "newest", label: "최신순" },
          ],
        },
      },
    };
  }

  async getFeaturedItems(limit: number = 4): Promise<Item[]> {
    await this.simulateDelay();
    return SAMPLE_ITEMS.filter((item) => item.featured).slice(0, limit);
  }

  async getEndingSoonItems(limit: number = 4): Promise<Item[]> {
    await this.simulateDelay();
    return SAMPLE_ITEMS.filter((item) => item.endingSoon).slice(0, limit);
  }

  async getItemsByCategory(
    categoryId: string,
    options: APIOptions = {},
  ): Promise<ItemsAPIResponse> {
    await this.simulateDelay();

    const category = SAMPLE_CATEGORIES.find((cat) => cat.id === categoryId);
    if (!category) {
      throw new Error(`카테고리를 찾을 수 없습니다: ${categoryId}`);
    }

    const categoryItems = SAMPLE_ITEMS.filter(
      (item) => item.category === category.name,
    );

    return {
      items: categoryItems,
      total: categoryItems.length,
      page: 1,
      limit: categoryItems.length,
      filters: {
        search: "",
        category: [categoryId],
        priceRange: { min: 0, max: 10000000 },
        sortBy: "default",
        available: {
          categories: SAMPLE_CATEGORIES,
          sortOptions: [
            { value: "default", label: "기본순" },
            { value: "price-low", label: "가격 낮은순" },
            { value: "price-high", label: "가격 높은순" },
            { value: "ending-soon", label: "마감임박순" },
          ],
        },
      },
    };
  }

  async getItemDetail(itemId: string): Promise<Item> {
    await this.simulateDelay();

    const item = SAMPLE_ITEMS.find((item) => item.id === itemId);
    if (!item) {
      throw new Error(`상품을 찾을 수 없습니다: ${itemId}`);
    }

    return item;
  }

  async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    await this.simulateDelay();

    const suggestions: SearchSuggestion[] = [];

    // 카테고리에서 제안
    SAMPLE_CATEGORIES.forEach((category) => {
      if (category.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          term: category.name,
          count: category.count || 0,
        });
      }
    });

    // 태그에서 제안
    const tagSuggestions = new Set<string>();
    SAMPLE_ITEMS.forEach((item) => {
      item.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          tagSuggestions.add(tag);
        }
      });
    });

    tagSuggestions.forEach((tag) => {
      const count = SAMPLE_ITEMS.filter((item) =>
        item.tags.includes(tag),
      ).length;
      suggestions.push({
        term: tag,
        count,
      });
    });

    // 중복 제거 및 정렬
    const uniqueSuggestions = suggestions.filter(
      (suggestion, index, self) =>
        index === self.findIndex((s) => s.term === suggestion.term),
    );

    return uniqueSuggestions.sort((a, b) => b.count - a.count).slice(0, 10);
  }

  async getCategories(): Promise<Category[]> {
    await this.simulateDelay();
    return SAMPLE_CATEGORIES;
  }

  private async simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delay));
  }

  setDelay(delay: number): void {
    this.delay = delay;
  }
}

export const mockAPI = new MockAPI();
