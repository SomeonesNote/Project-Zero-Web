import { AppConfig, Category, CategoryChangeEvent, Item, ItemClickEvent, ItemsAPIResponse, NavigationEvent, PageChangeEvent, SearchEvent } from '../types';
import {
    CategoryTags,
    DataManager,
    EventBus,
    Header,
    ItemGrid,
    Pagination,
    SearchBar,
    mockAPI
} from './index';

export class App {
  private dataManager: DataManager;
  private eventBus: EventBus;
  private api: typeof mockAPI;
  private config: AppConfig;
  private components: Record<string, any>;

  constructor(config: AppConfig = {}) {
    this.config = {
      enableDebugMode: false,
      enableErrorReporting: true,
      apiDelay: 500,
      defaultItemsPerPage: 12,
      ...config
    };

    this.dataManager = new DataManager();
    this.eventBus = new EventBus();
    this.api = mockAPI;
    this.components = {};

    // API 지연 시간 설정
    if (this.config.apiDelay) {
      this.api.setDelay(this.config.apiDelay);
    }

    this.init();
  }

  private async init(): Promise<void> {
    try {
      // API에서 초기 데이터 로드
      await this.setupData();
      
      // 컴포넌트 초기화
      this.initializeComponents();
      
      // 이벤트 리스너 설정
      this.setupEventListeners();
      
      // 초기 디스플레이 업데이트
      this.updateDisplay();
      
      if (this.config.enableDebugMode) {
        console.log('BidHub 앱이 성공적으로 초기화되었습니다.');
      }
    } catch (error) {
      console.error('앱 초기화 중 오류 발생:', error);
      if (this.config.enableErrorReporting) {
        // 에러 리포팅 로직
      }
    }
  }

  private async setupData(): Promise<void> {
    try {
      // 병렬로 데이터 로드
      const [featuredResponse, endingSoonResponse, categoriesResponse] = await Promise.all([
        this.api.getFeaturedItems(4),
        this.api.getEndingSoonItems(4),
        this.api.getCategories()
      ]);

      // 데이터 매니저에 설정
      this.dataManager.setItems(featuredResponse.concat(endingSoonResponse));
      this.dataManager.setCategories(categoriesResponse);

      // 통계 로깅
      if (this.config.enableDebugMode) {
        const stats = this.dataManager.getStats();
        console.log('초기 데이터 로드 완료:', {
          featured: featuredResponse.length,
          endingSoon: endingSoonResponse.length,
          categories: categoriesResponse.length
        });
      }
    } catch (error) {
      console.error('초기 데이터 로드 실패:', error);
      
      // 폴백 데이터 설정
      this.setupFallbackData();
    }
  }

  private setupFallbackData(): void {
    // 기본 샘플 데이터 설정
    const fallbackItems: Item[] = [
      {
        id: 'fallback-1',
        title: '샘플 상품 1',
        description: '샘플 상품 설명입니다.',
        image: 'images/sample1.jpg',
        startingBid: 10000,
        currentBid: 15000,
        totalBids: 5,
        seller: {
          id: 'seller1',
          name: '샘플 판매자',
          rating: 4.5,
          totalSales: 100
        },
        location: '서울시',
        condition: 'new',
        tags: ['샘플', '테스트'],
        endTime: '2024-12-31T23:59:59Z',
        category: '전자제품',
        featured: true,
        endingSoon: false
      }
    ];

    const fallbackCategories: Category[] = [
      { id: 'electronics', name: '전자제품', count: 1 },
      { id: 'fashion', name: '패션', count: 0 },
      { id: 'antiques', name: '골동품', count: 0 }
    ];

    this.dataManager.setItems(fallbackItems);
    this.dataManager.setCategories(fallbackCategories);
  }

  private initializeComponents(): void {
    // 헤더 컴포넌트
    this.components.header = new Header();

    // 메인 검색바 컴포넌트
    const mainSearchContainer = document.querySelector('.main-search') as HTMLElement;
    if (mainSearchContainer) {
      this.components.mainSearch = new SearchBar(mainSearchContainer, {
        placeholder: '찾고 싶은 상품을 검색해보세요...',
        size: 'large',
        onSearch: this.handleMainSearch.bind(this)
      });
    }

    // 카테고리 태그 컴포넌트
    const categoryContainer = document.querySelector('.category-tags') as HTMLElement;
    if (categoryContainer) {
      this.components.categoryTags = new CategoryTags(categoryContainer, {
        categories: this.dataManager.getCategories(),
        multiSelect: true,
        onCategoryChange: (selectedCategories: string[]) => {
          this.handleCategoryChange({ detail: { selectedCategories } } as CustomEvent<CategoryChangeEvent>);
        }
      });
    }

    // 추천 상품 그리드
    this.createFeaturedGrid();

    // 마감임박 상품 그리드
    this.createEndingSoonGrid();

    // 페이지네이션 컴포넌트
    const paginationContainer = document.querySelector('.pagination-container') as HTMLElement;
    if (paginationContainer) {
      this.components.pagination = new Pagination(paginationContainer, {
        container: paginationContainer,
        currentPage: 1,
        totalItems: this.dataManager.getItems().length,
        itemsPerPage: this.config.defaultItemsPerPage || 12,
        onPageChange: (page: number) => {
          this.handlePageChange({ detail: { page } } as CustomEvent<PageChangeEvent>);
        }
      });
    }
  }

  private async createFeaturedGrid(): Promise<void> {
    try {
      const response = await this.api.getFeaturedItems(4);
      
      if (response.length > 0) {
        const container = document.querySelector('.featured-items .items-grid') as HTMLElement;
        if (container) {
          this.components.featuredGrid = new ItemGrid(container, {
            container,
            items: response,
            onItemClick: (data: { item: Item }) => this.handleItemClick({ detail: data } as CustomEvent<ItemClickEvent>),
            onBidClick: (data: { item: Item }) => this.handleBidClick({ detail: data } as CustomEvent<ItemClickEvent>)
          });
        }
      }
    } catch (error) {
      console.error('추천 상품 그리드 생성 실패:', error);
    }
  }

  private async createEndingSoonGrid(): Promise<void> {
    try {
      const response = await this.api.getEndingSoonItems(4);
      
      if (response.length > 0) {
        const container = document.querySelector('.ending-soon .items-grid') as HTMLElement;
        if (container) {
          this.components.endingSoonGrid = new ItemGrid(container, {
            container,
            items: response,
            onItemClick: (data: { item: Item }) => this.handleItemClick({ detail: data } as CustomEvent<ItemClickEvent>),
            onBidClick: (data: { item: Item }) => this.handleBidClick({ detail: data } as CustomEvent<ItemClickEvent>)
          });
        }
      }
    } catch (error) {
      console.error('마감임박 상품 그리드 생성 실패:', error);
    }
  }

  private setupEventListeners(): void {
    // 네비게이션 이벤트
    document.addEventListener('navigation', (e: Event) => {
      this.handleNavigation(e as CustomEvent<NavigationEvent>);
    });

    // 헤더 검색 이벤트
    document.addEventListener('headerSearch', (e: Event) => {
      this.handleHeaderSearch(e as CustomEvent<SearchEvent>);
    });
    document.addEventListener('headerSearchSubmit', (e: Event) => {
      this.handleHeaderSearchSubmit(e as CustomEvent<SearchEvent>);
    });

    // 카테고리 변경 이벤트
    document.addEventListener('categoryChange', (e: Event) => {
      this.handleCategoryChange(e as CustomEvent<CategoryChangeEvent>);
    });

    // 검색 이벤트
    document.addEventListener('searchInput', (e: Event) => {
      this.handleSearchInput(e as CustomEvent<SearchEvent>);
    });
    document.addEventListener('searchSubmit', (e: Event) => {
      this.handleSearchSubmit(e as CustomEvent<SearchEvent>);
    });

    // 아이템 클릭 이벤트
    document.addEventListener('itemCardClick', (e: Event) => {
      this.handleItemClick(e as CustomEvent<ItemClickEvent>);
    });
    document.addEventListener('itemBidClick', (e: Event) => {
      this.handleBidClick(e as CustomEvent<ItemClickEvent>);
    });

    // 페이지 변경 이벤트
    document.addEventListener('pageChange', (e: Event) => {
      this.handlePageChange(e as CustomEvent<PageChangeEvent>);
    });
  }

  private async handleNavigation(event: CustomEvent<NavigationEvent>): Promise<void> {
    const { text, href } = event.detail;
    
    if (this.config.enableDebugMode) {
      console.log('네비게이션:', { text, href });
    }
    
    // 네비게이션 처리 로직
    // 예: 페이지 이동, 모달 열기 등
  }

  private async handleHeaderSearch(event: CustomEvent<SearchEvent>): Promise<void> {
    const { term } = event.detail;
    
    if (this.config.enableDebugMode) {
      console.log('헤더 검색 입력:', term);
    }
    
    // 실시간 검색 제안 표시
    try {
      const suggestions = await this.api.getSearchSuggestions(term);
      // 검색 제안 UI 업데이트
    } catch (error) {
      console.error('검색 제안 로드 실패:', error);
    }
  }

  private async handleHeaderSearchSubmit(event: CustomEvent<SearchEvent>): Promise<void> {
    const { term } = event.detail;
    
    if (this.config.enableDebugMode) {
      console.log('헤더 검색 제출:', term);
    }
    
    await this.performSearch(term);
  }

  private async handleMainSearch(term: string): Promise<void> {
    if (this.config.enableDebugMode) {
      console.log('메인 검색:', term);
    }
    
    await this.performSearch(term);
  }

  private async handleMainSearchInput(term: string): Promise<void> {
    if (this.config.enableDebugMode) {
      console.log('메인 검색 입력:', term);
    }
    
    // 실시간 검색 결과 업데이트
    try {
      const response = await this.api.getAllItems({ search: term, limit: 20 });
      
      if (response.items.length > 0) {
        this.dataManager.setItems(response.items);
        this.updateDisplay();
        
        if (this.components.pagination) {
          this.components.pagination.setTotalItems(response.total);
          this.components.pagination.setCurrentPage(1);
        }
        
        if (this.config.enableDebugMode) {
          console.log('검색 결과 업데이트 완료:', response.total, '개 상품');
        }
      }
    } catch (error) {
      console.error('검색 실패:', error);
    }
  }

  private async handleCategoryChange(event: CustomEvent<CategoryChangeEvent>): Promise<void> {
    const { selectedCategories } = event.detail;
    
    if (this.config.enableDebugMode) {
      console.log('카테고리 변경:', selectedCategories);
    }
    
    try {
      let response: ItemsAPIResponse;
      
      if (selectedCategories.length === 0) {
        // 모든 상품 가져오기
        response = await this.api.getAllItems({ limit: 20 });
      } else {
        // 선택된 카테고리의 상품 가져오기
        const categoryId = selectedCategories[0]; // 첫 번째 카테고리 사용
        response = await this.api.getItemsByCategory(categoryId, { limit: 20 });
      }
      
      if (response.items.length > 0) {
        this.dataManager.setItems(response.items);
        this.updateDisplay();
        
        if (this.components.pagination) {
          this.components.pagination.setTotalItems(response.total);
          this.components.pagination.setCurrentPage(1);
        }
        
        if (this.config.enableDebugMode) {
          console.log('카테고리 필터링 완료:', response.total, '개 상품');
        }
      }
    } catch (error) {
      console.error('카테고리 필터링 실패:', error);
    }
  }

  private async handleSearchInput(event: CustomEvent<SearchEvent>): Promise<void> {
    const { term } = event.detail;
    
    if (this.config.enableDebugMode) {
      console.log('검색 입력:', term);
    }
    
    await this.handleMainSearchInput(term);
  }

  private async handleSearchSubmit(event: CustomEvent<SearchEvent>): Promise<void> {
    const { term } = event.detail;
    
    if (this.config.enableDebugMode) {
      console.log('검색 제출:', term);
    }
    
    await this.performSearch(term);
  }

  private async performSearch(term: string): Promise<void> {
    try {
      const response = await this.api.getAllItems({ 
        search: term, 
        limit: this.config.defaultItemsPerPage 
      });
      
      if (response.items.length > 0) {
        this.dataManager.setItems(response.items);
        this.updateDisplay();
        
        if (this.components.pagination) {
          this.components.pagination.setTotalItems(response.total);
          this.components.pagination.setCurrentPage(1);
        }
        
        if (this.config.enableDebugMode) {
          console.log('검색 완료:', response.total, '개 상품');
        }
      } else {
        // 검색 결과가 없을 때 처리
        this.showNoResultsMessage(term);
      }
    } catch (error) {
      console.error('검색 실패:', error);
      this.showErrorMessage('검색 중 오류가 발생했습니다.');
    }
  }

  private async handleItemClick(event: CustomEvent<ItemClickEvent>): Promise<void> {
    const { item } = event.detail;
    
    if (this.config.enableDebugMode) {
      console.log('아이템 클릭:', item.title);
    }
    
    // 상품 상세 페이지로 이동 또는 모달 열기
    try {
      const itemDetail = await this.api.getItemDetail(item.id);
      this.showItemDetail(itemDetail);
    } catch (error) {
      console.error('상품 상세 정보 로드 실패:', error);
      this.showErrorMessage('상품 정보를 불러올 수 없습니다.');
    }
  }

  private async handleBidClick(event: CustomEvent<ItemClickEvent>): Promise<void> {
    const { item } = event.detail;
    
    if (this.config.enableDebugMode) {
      console.log('입찰 클릭:', item.title);
    }
    
    // 입찰 모달 열기
    this.showBidModal(item);
  }

  private async handlePageChange(event: CustomEvent<PageChangeEvent>): Promise<void> {
    const { page } = event.detail;
    
    if (this.config.enableDebugMode) {
      console.log('페이지 변경:', page);
    }
    
    try {
      const response = await this.api.getAllItems({ 
        page, 
        limit: this.config.defaultItemsPerPage 
      });
      
      if (response.items.length > 0) {
        this.dataManager.setItems(response.items);
        this.updateDisplay();
        
        if (this.components.pagination) {
          this.components.pagination.setCurrentPage(page);
        }
        
        if (this.config.enableDebugMode) {
          console.log('페이지 업데이트 완료:', response.total, '개 상품');
        }
      }
    } catch (error) {
      console.error('페이지 업데이트 실패:', error);
    }
  }

  // updateDisplay 메서드를 public으로 변경
  public updateDisplay(): void {
    // 현재 필터링된 아이템들로 그리드 업데이트
    const filteredItems = this.dataManager.getFilteredItems();
    
    // 추천 상품 그리드 업데이트
    if (this.components.featuredGrid) {
      const featuredItems = this.dataManager.getFeaturedItems(4);
      this.components.featuredGrid.updateItems(featuredItems);
    }
    
    // 마감임박 상품 그리드 업데이트
    if (this.components.endingSoonGrid) {
      const endingSoonItems = this.dataManager.getEndingSoonItems(4);
      this.components.endingSoonGrid.updateItems(endingSoonItems);
    }
    
    // 페이지네이션 업데이트
    if (this.components.pagination) {
      this.components.pagination.setTotalItems(filteredItems.length);
    }
  }

  private showNoResultsMessage(term: string): void {
    // 검색 결과가 없을 때 메시지 표시
    const message = `"${term}"에 대한 검색 결과가 없습니다.`;
    console.log(message);
    
    // UI에 메시지 표시 로직
  }

  private showErrorMessage(message: string): void {
    console.error(message);
    
    // UI에 에러 메시지 표시 로직
  }

  private showItemDetail(item: Item): void {
    // 상품 상세 정보 표시 (모달 또는 새 페이지)
    if (this.config.enableDebugMode) {
      console.log('상품 상세 정보 표시:', item.title);
    }
    
    // 상품 상세 UI 표시 로직
  }

  private showBidModal(item: Item): void {
    // 입찰 모달 표시
    if (this.config.enableDebugMode) {
      console.log('입찰 모달 표시:', item.title);
    }
    
    // 입찰 모달 UI 표시 로직
  }

  // 설정 업데이트
  updateConfig(newConfig: Partial<AppConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // API 지연 시간 업데이트
    if (newConfig.apiDelay !== undefined) {
      this.api.setDelay(newConfig.apiDelay);
    }
    
    if (this.config.enableDebugMode) {
      console.log('설정 업데이트:', newConfig);
    }
  }

  // 앱 상태 가져오기
  getState() {
    return {
      config: this.config,
      dataManager: this.dataManager.getState(),
      components: Object.keys(this.components)
    };
  }

  // 앱 재시작
  async restart(): Promise<void> {
    if (this.config.enableDebugMode) {
      console.log('앱 재시작 중...');
    }
    
    // 컴포넌트 정리
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    
    // 데이터 초기화
    this.dataManager.reset();
    
    // 재초기화
    await this.init();
  }

  // 앱 정리
  destroy(): void {
    if (this.config.enableDebugMode) {
      console.log('앱 정리 중...');
    }
    
    // 이벤트 리스너 제거
    document.removeEventListener('navigation', (e: Event) => {
      this.handleNavigation(e as CustomEvent<NavigationEvent>);
    });
    document.removeEventListener('headerSearch', (e: Event) => {
      this.handleHeaderSearch(e as CustomEvent<SearchEvent>);
    });
    document.removeEventListener('headerSearchSubmit', (e: Event) => {
      this.handleHeaderSearchSubmit(e as CustomEvent<SearchEvent>);
    });
    document.removeEventListener('categoryChange', (e: Event) => {
      this.handleCategoryChange(e as CustomEvent<CategoryChangeEvent>);
    });
    document.removeEventListener('searchInput', (e: Event) => {
      this.handleSearchInput(e as CustomEvent<SearchEvent>);
    });
    document.removeEventListener('searchSubmit', (e: Event) => {
      this.handleSearchSubmit(e as CustomEvent<SearchEvent>);
    });
    document.removeEventListener('itemCardClick', (e: Event) => {
      this.handleItemClick(e as CustomEvent<ItemClickEvent>);
    });
    document.removeEventListener('itemBidClick', (e: Event) => {
      this.handleBidClick(e as CustomEvent<ItemClickEvent>);
    });
    document.removeEventListener('pageChange', (e: Event) => {
      this.handlePageChange(e as CustomEvent<PageChangeEvent>);
    });
    
    // 컴포넌트 정리
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    
    // 데이터 정리
    this.dataManager.reset();
  }
}
