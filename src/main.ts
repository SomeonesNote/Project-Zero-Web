import { App } from './components/App';
import { DeveloperUtils } from './types';

let app: App | null = null;

document.addEventListener('DOMContentLoaded', function() {
  try {
    app = new App({
      enableDebugMode: true,
      enableErrorReporting: true,
      apiDelay: 500,
      defaultItemsPerPage: 12
    });
    (window as any).bidHubApp = app;
    console.log('BidHub 웹사이트가 성공적으로 로드되었습니다!');
  } catch (error) {
    console.error('BidHub 웹사이트 로드 중 오류 발생:', error);
    
    // 오류 발생 시 사용자에게 알림
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
      <h2>오류가 발생했습니다</h2>
      <p>BidHub 웹사이트를 로드하는 중 문제가 발생했습니다.</p>
      <p>페이지를 새로고침하거나 잠시 후 다시 시도해주세요.</p>
      <button onclick="location.reload()">새로고침</button>
    `;
    errorMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border: 2px solid #e74c3c;
      border-radius: 8px;
      text-align: center;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(errorMessage);
  }
});

window.addEventListener('beforeunload', function() {
  if (app) {
    app.destroy();
  }
});

// 개발자 도구를 전역으로 노출
(window as any).BidHubUtils = {
  // 애플리케이션 인스턴스 가져오기
  getApp: () => app,
  
  // 데이터 매니저 가져오기
  getDataManager: () => app?.getState().dataManager || null,
  
  // 컴포넌트들 가져오기
  getComponents: () => app?.getState().components || null,
  
  // API 인스턴스 가져오기
  getAPI: () => app ? (app as any).api : null,
  
  // 테스트용 API 호출
  testAPI: {
    async getAllItems() {
      const api = (app as any)?.api;
      if (api) {
        try {
          const result = await api.getAllItems();
          console.log('API 테스트 - getAllItems:', result);
          return result;
        } catch (error) {
          console.error('API 테스트 실패:', error);
          return null;
        }
      }
      return null;
    },
    
    async getFeaturedItems() {
      const api = (app as any)?.api;
      if (api) {
        try {
          const result = await api.getFeaturedItems(4);
          console.log('API 테스트 - getFeaturedItems:', result);
          return result;
        } catch (error) {
          console.error('API 테스트 실패:', error);
          return null;
        }
      }
      return null;
    },
    
    async getItemDetail(id: string) {
      const api = (app as any)?.api;
      if (api) {
        try {
          const result = await api.getItemDetail(id);
          console.log('API 테스트 - getItemDetail:', result);
          return result;
        } catch (error) {
          console.error('API 테스트 실패:', error);
          return null;
        }
      }
      return null;
    }
  },
  
  // API 지연 시간 설정
  setAPIDelay(delay: number) {
    const api = (app as any)?.api;
    if (api && api.setDelay) {
      api.setDelay(delay);
      console.log(`API 지연 시간이 ${delay}ms로 설정되었습니다.`);
    }
  },
  
  // 데이터 내보내기
  exportItems() {
    const dataManager = app?.getState().dataManager;
    if (dataManager) {
      const data = JSON.stringify(dataManager, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bidhub-items.json';
      a.click();
      URL.revokeObjectURL(url);
      console.log('상품 데이터가 내보내기되었습니다.');
    }
  },
  
  // 데이터 가져오기
  importItems(jsonData: string) {
    try {
      const data = JSON.parse(jsonData);
      const appInstance = app;
      if (appInstance && data.items) {
        const dataManager = appInstance.getState().dataManager;
        if (dataManager && data.items) {
          // DataManager 인스턴스의 메서드를 직접 호출
          const dm = appInstance.getState().dataManager as any;
          if (dm && dm.setItems) {
            dm.setItems(data.items);
            if (data.categories && dm.setCategories) {
              dm.setCategories(data.categories);
            }
            appInstance.updateDisplay();
            console.log('상품 데이터가 가져와졌습니다.');
          }
        }
      }
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
    }
  },
  
  // 샘플 상품 추가
  addSampleItem() {
    const appInstance = app;
    if (appInstance) {
      const dataManager = appInstance.getState().dataManager;
      if (dataManager) {
        const newItem = {
          id: `sample_${Date.now()}`,
          title: '샘플 상품',
          description: '개발자 도구로 추가된 샘플 상품입니다.',
          image: 'images/sample.jpg',
          startingBid: 10000,
          currentBid: 12000,
          totalBids: 3,
          seller: {
            id: 'sample_seller',
            name: '샘플 판매자',
            rating: 4.5,
            totalSales: 50
          },
          location: '서울시',
          condition: 'new' as const,
          tags: ['샘플', '테스트'],
          endTime: '2024-12-31T23:59:59Z',
          category: '전자제품',
          featured: false,
          endingSoon: false
        };
        
        // DataManager 인스턴스의 메서드를 직접 호출
        const dm = appInstance.getState().dataManager as any;
        if (dm && dm.addItem) {
          dm.addItem(newItem);
          appInstance.updateDisplay();
          console.log('샘플 상품이 추가되었습니다:', newItem);
        }
      }
    }
  },
  
  // 검색어 설정
  setSearchTerm(term: string) {
    const searchInput = document.querySelector('.main-search input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = term;
      searchInput.dispatchEvent(new Event('input'));
      console.log(`검색어가 "${term}"으로 설정되었습니다.`);
    }
  },
  
  // 설정 업데이트
  updateConfig(newConfig: any) {
    if (app) {
      app.updateConfig(newConfig);
      console.log('설정이 업데이트되었습니다:', newConfig);
    }
  }
} as DeveloperUtils;

// 개발 환경에서만 개발자 도구 안내 메시지 표시
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log(`
    🚀 BidHub 개발자 도구 (TypeScript + API 버전)
    
    사용 가능한 명령어:
    - BidHubUtils.getApp() - 앱 인스턴스 가져오기
    - BidHubUtils.getDataManager() - 데이터 매니저 가져오기
    - BidHubUtils.getComponents() - 컴포넌트들 가져오기
    - BidHubUtils.getAPI() - API 인스턴스 가져오기
    - BidHubUtils.testAPI.getAllItems() - 전체 상품 API 테스트
    - BidHubUtils.testAPI.getFeaturedItems() - 추천 상품 API 테스트
    - BidHubUtils.testAPI.getItemDetail(id) - 상품 상세 API 테스트
    - BidHubUtils.setAPIDelay(delay) - API 지연 시간 설정
    - BidHubUtils.exportItems() - 상품 데이터 내보내기
    - BidHubUtils.importItems(jsonData) - 상품 데이터 가져오기
    - BidHubUtils.addSampleItem() - 샘플 상품 추가
    - BidHubUtils.setSearchTerm(term) - 검색어 설정
    - BidHubUtils.updateConfig(config) - 설정 업데이트
    
    예시:
    BidHubUtils.testAPI.getAllItems()
    BidHubUtils.setAPIDelay(1000)
    BidHubUtils.addSampleItem()
  `);
}
