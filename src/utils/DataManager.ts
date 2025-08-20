import { Category, DataManagerState, FilterInfo, Item } from '../types';

export class DataManager {
  private state: DataManagerState;

  constructor() {
    this.state = {
      items: [],
      categories: [],
      filters: {
        search: '',
        category: [],
        priceRange: { min: 0, max: 10000000 },
        sortBy: 'default',
        available: {
          categories: [],
          sortOptions: [
            { value: 'default', label: '기본순' },
            { value: 'price-low', label: '가격 낮은순' },
            { value: 'price-high', label: '가격 높은순' },
            { value: 'ending-soon', label: '마감임박순' },
            { value: 'newest', label: '최신순' }
          ]
        }
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 12,
        hasNextPage: false,
        hasPrevPage: false
      },
      currentPage: 1,
      itemsPerPage: 12
    };
  }

  // 아이템 관리
  setItems(items: Item[]): void {
    this.state.items = items;
  }

  getItems(): Item[] {
    return [...this.state.items];
  }

  addItem(item: Item): void {
    this.state.items.push(item);
  }

  removeItem(itemId: string): boolean {
    const index = this.state.items.findIndex(item => item.id === itemId);
    if (index > -1) {
      this.state.items.splice(index, 1);
      return true;
    }
    return false;
  }

  // 필터 관리
  setFilter(type: keyof FilterInfo, value: any): void {
    if (type === 'search') {
      this.state.filters.search = value;
    } else if (type === 'category') {
      this.state.filters.category = value;
    } else if (type === 'priceRange') {
      this.state.filters.priceRange = value;
    } else if (type === 'sortBy') {
      this.state.filters.sortBy = value;
    }
  }

  getFilter(type: keyof FilterInfo): any {
    if (type === 'search') {
      return this.state.filters.search;
    } else if (type === 'category') {
      return this.state.filters.category;
    } else if (type === 'priceRange') {
      return this.state.filters.priceRange;
    } else if (type === 'sortBy') {
      return this.state.filters.sortBy;
    }
    return null;
  }

  clearFilters(): void {
    this.state.filters = {
      search: '',
      category: [],
      priceRange: { min: 0, max: 10000000 },
      sortBy: 'default',
      available: this.state.filters.available
    };
  }

  // 페이지네이션 관리
  setCurrentPage(page: number): void {
    this.state.currentPage = Math.max(1, page);
  }

  getCurrentPage(): number {
    return this.state.currentPage;
  }

  setItemsPerPage(count: number): void {
    this.state.itemsPerPage = Math.max(1, count);
  }

  getItemsPerPage(): number {
    return this.state.itemsPerPage;
  }

  // 카테고리 관리
  setCategories(categories: Category[]): void {
    this.state.categories = categories;
    this.state.filters.available.categories = categories.map(cat => ({
      id: cat.id,
      name: cat.name
    }));
  }

  getCategories(): Category[] {
    return [...this.state.categories];
  }

  // 필터링된 아이템 가져오기
  getFilteredItems(): Item[] {
    let filteredItems = [...this.state.items];

    // 검색 필터
    const searchFilter = this.state.filters.search.toLowerCase();
    if (searchFilter) {
      filteredItems = filteredItems.filter(item =>
        item.title.toLowerCase().includes(searchFilter) ||
        item.description.toLowerCase().includes(searchFilter) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchFilter))
      );
    }

    // 카테고리 필터
    const categoryFilter = this.state.filters.category;
    if (categoryFilter && categoryFilter.length > 0) {
      filteredItems = filteredItems.filter(item => 
        categoryFilter.includes(item.category)
      );
    }

    // 가격 범위 필터
    const minPrice = this.state.filters.priceRange.min;
    const maxPrice = this.state.filters.priceRange.max;
    if (minPrice > 0 || maxPrice < 10000000) {
      filteredItems = filteredItems.filter(item =>
        item.currentBid >= minPrice && item.currentBid <= maxPrice
      );
    }

    // 정렬
    const sortBy = this.state.filters.sortBy;
    switch (sortBy) {
      case 'price-low':
        filteredItems.sort((a, b) => a.currentBid - b.currentBid);
        break;
      case 'price-high':
        filteredItems.sort((a, b) => b.currentBid - a.currentBid);
        break;
      case 'ending-soon':
        filteredItems.sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
        break;
      case 'newest':
        filteredItems.sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());
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

    return filteredItems;
  }

  // 페이지네이션된 아이템 가져오기
  getPaginatedItems(page: number = 1, itemsPerPage: number = this.state.itemsPerPage) {
    const filteredItems = this.getFilteredItems();
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // 페이지 범위 조정
    const adjustedPage = Math.max(1, Math.min(page, totalPages));
    
    const startIndex = (adjustedPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const items = filteredItems.slice(startIndex, endIndex);
    
    // 페이지네이션 정보 업데이트
    this.state.pagination = {
      currentPage: adjustedPage,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage,
      hasNextPage: adjustedPage < totalPages,
      hasPrevPage: adjustedPage > 1
    };
    
    this.state.currentPage = adjustedPage;
    this.state.itemsPerPage = itemsPerPage;
    
    return {
      items,
      pagination: this.state.pagination
    };
  }

  // 특별한 아이템들 가져오기
  getFeaturedItems(limit: number = 4): Item[] {
    return this.state.items
      .filter(item => item.featured)
      .slice(0, limit);
  }

  getEndingSoonItems(limit: number = 4): Item[] {
    const now = new Date();
    return this.state.items
      .filter(item => {
        const endTime = new Date(item.endTime);
        const timeLeft = endTime.getTime() - now.getTime();
        return timeLeft > 0 && timeLeft <= 24 * 60 * 60 * 1000; // 24시간 이내
      })
      .sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime())
      .slice(0, limit);
  }

  getPopularItems(limit: number = 4): Item[] {
    return this.state.items
      .sort((a, b) => b.totalBids - a.totalBids)
      .slice(0, limit);
  }

  // 통계 정보
  getStats() {
    const totalItems = this.state.items.length;
    const activeItems = this.state.items.filter(item => {
      const endTime = new Date(item.endTime);
      return endTime > new Date();
    }).length;
    
    const totalBids = this.state.items.reduce((sum, item) => sum + item.totalBids, 0);
    const totalValue = this.state.items.reduce((sum, item) => sum + item.currentBid, 0);
    
    return {
      totalItems,
      activeItems,
      totalBids,
      totalValue,
      featured: this.state.items.filter(item => item.featured).length,
      endingSoon: this.state.items.filter(item => item.endingSoon).length,
      categories: this.state.categories.length
    };
  }

  // 상태 가져오기
  getState(): DataManagerState {
    return { ...this.state };
  }

  // 상태 설정
  setState(newState: Partial<DataManagerState>): void {
    this.state = {
      ...this.state,
      ...newState
    };
  }

  // 초기화
  reset(): void {
    this.state = {
      items: [],
      categories: [],
      filters: {
        search: '',
        category: [],
        priceRange: { min: 0, max: 10000000 },
        sortBy: 'default',
        available: {
          categories: [],
          sortOptions: [
            { value: 'default', label: '기본순' },
            { value: 'price-low', label: '가격 낮은순' },
            { value: 'price-high', label: '가격 높은순' },
            { value: 'ending-soon', label: '마감임박순' },
            { value: 'newest', label: '최신순' }
          ]
        }
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 12,
        hasNextPage: false,
        hasPrevPage: false
      },
      currentPage: 1,
      itemsPerPage: 12
    };
  }
}
