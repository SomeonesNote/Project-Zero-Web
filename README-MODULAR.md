# BidHub - 모듈화된 경매 플랫폼 웹사이트

Figma 디자인을 기반으로 제작된 **모듈화된** 현대적인 경매 플랫폼 웹사이트입니다.

## 🏗️ 모듈화 아키텍처

### 컴포넌트 기반 구조
```
Project-Zero/
├── components/                 # 재사용 가능한 컴포넌트들
│   ├── header/               # 헤더 컴포넌트
│   │   └── Header.js
│   ├── search/               # 검색 컴포넌트
│   │   └── SearchBar.js
│   ├── categories/           # 카테고리 컴포넌트
│   │   └── CategoryTags.js
│   ├── items/                # 상품 아이템 컴포넌트
│   │   └── ItemCard.js
│   ├── pagination/           # 페이지네이션 컴포넌트
│   │   └── Pagination.js
│   └── App.js                # 메인 애플리케이션 클래스
├── utils/                     # 유틸리티 함수들
│   ├── EventBus.js           # 이벤트 버스
│   └── DataManager.js        # 데이터 관리
├── styles/                    # 스타일 파일들
│   └── components.css        # 컴포넌트별 스타일
├── index.html                 # 기존 HTML 파일
├── index-modular.html         # 모듈화된 HTML 파일
├── main.js                    # 모듈화된 메인 JavaScript
├── script.js                  # 기존 JavaScript 파일
├── styles.css                 # 기존 CSS 파일
└── README-MODULAR.md          # 이 파일
```

## 🚀 주요 특징

### ✨ 모듈화된 구조
- **재사용 가능한 컴포넌트**: 각 UI 요소를 독립적인 컴포넌트로 분리
- **ES6 모듈 시스템**: `import`/`export`를 사용한 깔끔한 의존성 관리
- **컴포넌트 생명주기**: 생성, 업데이트, 제거를 위한 메서드 제공

### 🔧 컴포넌트별 기능

#### 1. Header 컴포넌트
- 로고 및 브랜딩
- 네비게이션 메뉴
- 검색 기능
- 로그인/회원가입 버튼
- 스크롤 시 자동 숨김/표시

#### 2. SearchBar 컴포넌트
- 크기 조절 가능 (small/large)
- 실시간 검색 제안
- 검색 이벤트 처리
- 포커스/블러 상태 관리

#### 3. CategoryTags 컴포넌트
- 단일/다중 선택 모드
- 동적 카테고리 관리
- 필터링 및 검색 기능
- 선택 상태 시각적 표시

#### 4. ItemCard 컴포넌트
- 다양한 크기 옵션
- 상품 정보 표시
- 입찰 및 상세보기 버튼
- 클릭 이벤트 처리

#### 5. Pagination 컴포넌트
- 동적 페이지 수 계산
- 이전/다음 버튼
- 페이지 번호 표시
- 반응형 레이아웃

### 📊 데이터 관리
- **중앙화된 데이터 관리**: `DataManager` 클래스로 모든 데이터 통합 관리
- **필터링 시스템**: 검색어, 카테고리, 가격 범위 기반 필터링
- **정렬 기능**: 가격, 제목, 날짜 기준 정렬
- **페이지네이션**: 효율적인 데이터 분할 표시

### 🔄 이벤트 시스템
- **커스텀 이벤트**: 컴포넌트 간 통신을 위한 이벤트 버스
- **전역 이벤트 관리**: `EventBus` 클래스로 이벤트 중앙 관리
- **이벤트 위임**: 효율적인 이벤트 처리

## 🛠️ 사용 방법

### 1. 모듈화된 버전 실행
```bash
# 로컬 서버 실행 (ES6 모듈 지원 필요)
python -m http.server 8000
# 또는
npx serve .

# 브라우저에서 접속
http://localhost:8000/index-modular.html
```

### 2. 컴포넌트 사용 예시

#### 검색바 컴포넌트
```javascript
import { SearchBar } from './components/search/SearchBar.js';

const searchContainer = document.getElementById('search-container');
const searchBar = new SearchBar(searchContainer, {
    size: 'large',
    placeholder: '상품을 검색하세요',
    onSearch: (term) => console.log('검색:', term),
    onInput: (term) => console.log('입력:', term)
});
```

#### 카테고리 태그 컴포넌트
```javascript
import { CategoryTags } from './components/categories/CategoryTags.js';

const categoryContainer = document.getElementById('category-container');
const categoryTags = new CategoryTags(categoryContainer, {
    categories: ['Electronics', 'Fashion', 'Art'],
    multiSelect: true,
    onCategoryChange: (selected) => console.log('선택된 카테고리:', selected)
});
```

#### 상품 그리드 컴포넌트
```javascript
import { ItemGrid } from './components/items/ItemCard.js';

const gridContainer = document.getElementById('grid-container');
const itemGrid = new ItemGrid(gridContainer, {
    items: sampleItems,
    columns: 4,
    onItemClick: (item) => console.log('상품 클릭:', item),
    onBidClick: (item) => console.log('입찰 클릭:', item)
});
```

### 3. 개발자 도구 활용

브라우저 콘솔에서 다음 명령어들을 사용할 수 있습니다:

```javascript
// 애플리케이션 인스턴스 가져오기
const app = BidHubUtils.getApp();

// 데이터 매니저 접근
const dataManager = BidHubUtils.getDataManager();

// 컴포넌트들 접근
const components = BidHubUtils.getComponents();

// 샘플 상품 추가
BidHubUtils.addSampleItem();

// 필터 초기화
BidHubUtils.clearFilters();

// 검색어 설정
BidHubUtils.setSearchTerm('Electronics');

// 카테고리 필터 설정
BidHubUtils.setCategoryFilter('Fashion');
```

## 🔧 커스터마이징

### 컴포넌트 확장
각 컴포넌트는 상속을 통해 확장할 수 있습니다:

```javascript
class CustomSearchBar extends SearchBar {
    constructor(container, options) {
        super(container, options);
        this.customFeature = true;
    }
    
    // 커스텀 메서드 추가
    customSearch() {
        // 구현
    }
}
```

### 스타일 커스터마이징
`styles/components.css`에서 컴포넌트별 스타일을 수정할 수 있습니다.

### 이벤트 커스텀
새로운 이벤트를 추가하거나 기존 이벤트를 수정할 수 있습니다:

```javascript
// 새로운 이벤트 리스너 등록
globalEventBus.on('customEvent', (data) => {
    console.log('커스텀 이벤트:', data);
});

// 이벤트 발생
globalEventBus.emit('customEvent', { message: 'Hello' });
```

## 📱 반응형 디자인

모든 컴포넌트는 반응형 디자인을 지원합니다:

- **데스크톱 (1280px+)**: 4열 그리드
- **태블릿 (768px-1199px)**: 3열 그리드
- **모바일 (480px-767px)**: 2열 그리드
- **소형 모바일 (480px 이하)**: 1열 그리드

## 🎯 성능 최적화

### 코드 분할
- 각 컴포넌트를 독립적인 모듈로 분리
- 필요한 컴포넌트만 동적으로 로드 가능

### 이벤트 최적화
- 이벤트 위임을 통한 메모리 효율성
- 불필요한 이벤트 리스너 자동 정리

### 렌더링 최적화
- 가상 DOM 개념을 활용한 효율적인 DOM 업데이트
- 변경된 부분만 선택적으로 렌더링

## 🚧 향후 개선 계획

- [ ] **상태 관리 시스템**: Redux/Zustand와 유사한 상태 관리
- [ ] **라우팅 시스템**: SPA 라우팅 구현
- [ ] **테스트 프레임워크**: Jest/Vitest를 사용한 단위 테스트
- [ ] **타입 안전성**: TypeScript 지원
- [ ] **번들링**: Webpack/Vite를 사용한 번들 최적화
- [ ] **PWA 지원**: 서비스 워커 및 오프라인 기능
- [ ] **국제화**: 다국어 지원 시스템
- [ ] **테마 시스템**: 다크/라이트 모드 및 커스텀 테마

## 🤝 기여하기

모듈화된 구조로 인해 새로운 기능 추가가 훨씬 쉬워졌습니다:

1. **새 컴포넌트 생성**: `components/` 폴더에 새 컴포넌트 추가
2. **기존 컴포넌트 확장**: 상속을 통한 기능 확장
3. **유틸리티 추가**: `utils/` 폴더에 헬퍼 함수 추가
4. **스타일 개선**: `styles/` 폴더에 CSS 추가

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**BidHub 모듈화 버전** - 재사용 가능하고 확장 가능한 컴포넌트 기반 아키텍처로 구축된 현대적인 경매 플랫폼! 🏗️✨
