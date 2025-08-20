# BidHub - TypeScript + API 기반 경매 플랫폼

Figma 디자인을 기반으로 제작된 **TypeScript + API 기반** 현대적인 경매 플랫폼 웹사이트입니다.

## 🚀 주요 특징

### ✨ TypeScript 기반 개발
- **타입 안전성**: 컴파일 타임에 타입 오류 검출
- **IntelliSense 지원**: IDE에서 완벽한 자동완성 및 오류 검출
- **리팩토링 안전성**: 코드 변경 시 영향 범위 자동 감지
- **문서화**: 타입 정의를 통한 자동 문서 생성

### 🔌 API 기반 데이터 관리
- **MockAPI 시스템**: 실제 웹서버 API와 동일한 형식의 응답
- **비동기 데이터 로딩**: Promise 기반의 비동기 처리
- **에러 핸들링**: API 오류 시 대체 데이터 사용
- **로딩 상태 관리**: 사용자 경험을 위한 로딩 인디케이터

### 🏗️ 모듈화된 아키텍처
- **컴포넌트 기반 구조**: 재사용 가능한 UI 컴포넌트
- **ES6 모듈 시스템**: 깔끔한 의존성 관리
- **이벤트 기반 통신**: 컴포넌트 간 느슨한 결합

## 🛠️ 기술 스택

### Frontend
- **TypeScript 5.0+**: 정적 타입 검사 및 최신 JavaScript 기능
- **ES6 Modules**: 모듈화된 코드 구조
- **CSS3**: Flexbox, Grid, 반응형 디자인
- **HTML5**: 시맨틱 마크업

### Development Tools
- **TypeScript Compiler**: 엄격한 타입 검사 및 컴파일
- **ESLint**: 코드 품질 및 스타일 검사
- **Prettier**: 코드 포맷팅
- **Jest**: 단위 테스트
- **npm Scripts**: 빌드 및 개발 워크플로우

## 📁 프로젝트 구조

```
Project-Zero/
├── src/                          # TypeScript 소스 코드
│   ├── components/               # UI 컴포넌트
│   │   ├── header/              # 헤더 컴포넌트
│   │   ├── search/              # 검색 컴포넌트
│   │   ├── categories/          # 카테고리 컴포넌트
│   │   ├── items/               # 상품 카드 컴포넌트
│   │   └── pagination/          # 페이지네이션 컴포넌트
│   ├── utils/                   # 유틸리티 클래스
│   │   ├── EventBus.ts          # 이벤트 관리 시스템
│   │   ├── DataManager.ts       # 데이터 관리
│   │   └── api.ts               # API 시뮬레이션
│   ├── types/                   # TypeScript 타입 정의
│   │   └── index.ts             # 모든 타입 정의
│   ├── App.ts                   # 메인 애플리케이션 클래스
│   └── main.ts                  # 진입점
├── dist/                         # 컴파일된 JavaScript (자동 생성)
├── styles/                       # CSS 스타일시트
├── images/                       # 이미지 에셋
├── package.json                  # npm 패키지 설정
├── tsconfig.json                 # TypeScript 컴파일러 설정
├── index-typescript.html         # TypeScript 버전 HTML
└── README-TYPESCRIPT.md          # 이 파일
```

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. TypeScript 컴파일
```bash
# 개발 모드 (감시 모드)
npm run build:watch

# 프로덕션 빌드
npm run build
```

### 3. 개발 서버 실행
```bash
# TypeScript 컴파일 + 개발 서버
npm run dev

# 또는 별도로 실행
npm run build:watch  # 터미널 1
npm run start        # 터미널 2
```

### 4. 브라우저에서 접속
```
http://localhost:8000/index-typescript.html
```

## 🔧 개발 명령어

### 빌드 관련
```bash
npm run build          # TypeScript 컴파일
npm run build:watch   # 감시 모드로 컴파일
npm run clean         # dist 폴더 정리
```

### 개발 관련
```bash
npm run dev           # 개발 모드 (컴파일 + 서버)
npm run start         # 정적 서버만 실행
```

### 코드 품질
```bash
npm run lint          # ESLint 검사
npm run lint:fix      # ESLint 자동 수정
npm run format        # Prettier 포맷팅
```

### 테스트
```bash
npm run test          # Jest 테스트 실행
npm run test:watch    # 감시 모드로 테스트
```

## 📊 TypeScript 타입 시스템

### 핵심 인터페이스
```typescript
// 상품 아이템
interface Item {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  startingBid: number;
  image: string;
  images: string[];
  category: string;
  condition: ItemCondition;
  seller: Seller;
  auction: AuctionInfo;
  tags: string[];
  shipping: ShippingInfo;
  createdAt: string;
  updatedAt: string;
}

// API 응답
interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// 컴포넌트 옵션
interface ItemCardOptions {
  size?: 'large' | 'small';
  showBidInfo?: boolean;
  showCategory?: boolean;
  showTimeLeft?: boolean;
  onCardClick?: (data: { item: Item }) => void;
}
```

### 제네릭 활용
```typescript
// 이벤트 버스
class EventBus {
  on<T>(event: string, callback: EventCallback<T>): void;
  emit<T>(event: string, data: T): void;
}

// API 응답
interface APIInterface {
  getAllItems(options?: APIOptions): Promise<APIResponse<ItemsAPIResponse>>;
  getItemDetail(itemId: string): Promise<APIResponse<{ item: Item; metadata: any }>>;
}
```

## 🎯 컴포넌트별 기능

### ItemCard 컴포넌트
- **타입 안전성**: Item 인터페이스를 통한 데이터 검증
- **옵션 기반 렌더링**: TypeScript 옵션 타입으로 유연한 UI 구성
- **이벤트 핸들링**: 타입이 지정된 이벤트 콜백

### DataManager 클래스
- **상태 관리**: 타입이 지정된 상태 객체
- **필터링/정렬**: 제네릭을 활용한 유연한 데이터 처리
- **에러 처리**: 타입 안전한 에러 핸들링

### API 클래스
- **인터페이스 구현**: APIInterface를 통한 계약 보장
- **비동기 처리**: Promise 기반의 타입 안전한 비동기 작업
- **에러 핸들링**: 타입이 지정된 에러 응답

## 🔍 개발자 도구

### TypeScript 컴파일러 옵션
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "declaration": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### ESLint 설정
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"]
}
```

### 개발자 콘솔 명령어
```typescript
// 애플리케이션 인스턴스
BidHubUtils.getApp()

// API 테스트
BidHubUtils.testAPI.getAllItems()
BidHubUtils.testAPI.getFeaturedItems(4)

// 설정 관리
BidHubUtils.getConfig()
BidHubUtils.updateConfig({ enableDebugMode: true })

// 데이터 관리
BidHubUtils.addSampleItem()
BidHubUtils.exportItems()
```

## 📱 반응형 디자인

모든 TypeScript 컴포넌트는 반응형 디자인을 지원하며, 타입 안전성을 유지하면서 동적으로 레이아웃이 조정됩니다:

- **데스크톱 (1280px+)**: 4열 그리드, 상세 정보 표시
- **태블릿 (768px-1199px)**: 3열 그리드, 중간 정보 표시
- **모바일 (480px-767px)**: 2열 그리드, 핵심 정보만 표시
- **소형 모바일 (480px 이하)**: 1열 그리드, 최소 정보 표시

## 🎨 시각적 개선사항

### 상태별 배지 시스템
- **신품 (new)**: 초록색 배지
- **중고 (used)**: 주황색 배지
- **빈티지 (vintage)**: 보라색 배지
- **골동품 (antique)**: 갈색 배지

### 시간 표시 시스템
- **정상**: 빨간색 배경
- **경고 (1일 이내)**: 주황색 배경
- **긴급 (시간 단위)**: 빨간색 배경 + 깜빡임 애니메이션

### 호버 효과
- **상품 카드**: 위로 이동 + 그림자 효과
- **이미지**: 확대 효과
- **태그**: 색상 변경 효과
- **버튼**: 위로 이동 + 그림자 효과

## 🚧 향후 개선 계획

### TypeScript 확장
- [ ] **데코레이터 활용**: 클래스 및 메서드 데코레이터로 기능 확장
- [ ] **고급 타입**: 조건부 타입, 매핑 타입 등 고급 TypeScript 기능 활용
- [ ] **타입 가드**: 런타임 타입 검증을 위한 타입 가드 구현
- [ ] **제네릭 제약**: 더 엄격한 제네릭 타입 제약 조건

### API 확장
- [ ] **실제 백엔드 연동**: MockAPI를 실제 웹서버 API로 교체
- [ ] **데이터베이스 연동**: MongoDB, PostgreSQL 등과 연동
- [ ] **실시간 업데이트**: WebSocket을 통한 실시간 입찰 정보
- [ ] **이미지 업로드**: 상품 이미지 업로드 및 관리

### 기능 확장
- [ ] **사용자 인증**: JWT 기반 로그인/회원가입
- [ ] **입찰 시스템**: 실시간 입찰 및 알림
- [ ] **결제 시스템**: 안전한 결제 처리
- [ ] **관리자 대시보드**: 상품 및 사용자 관리

### 성능 최적화
- [ ] **코드 분할**: 동적 import를 통한 번들 최적화
- [ ] **트리 쉐이킹**: 사용하지 않는 코드 자동 제거
- [ ] **타입 최적화**: 컴파일 타임 타입 최적화
- [ ] **메모이제이션**: React.memo와 유사한 컴포넌트 메모이제이션

## 🤝 기여하기

TypeScript 기반 구조로 인해 새로운 기능 추가가 훨씬 안전하고 쉬워졌습니다:

1. **새 컴포넌트**: 타입 정의를 먼저 작성하고 컴포넌트 구현
2. **API 확장**: 인터페이스를 확장하여 새로운 API 메서드 추가
3. **타입 안전성**: 제네릭과 유니온 타입을 활용한 유연한 타입 시스템
4. **테스트**: Jest와 TypeScript를 활용한 타입 안전한 테스트 작성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**BidHub TypeScript + API 버전** - 타입 안전성과 API 기반으로 구축된 현대적인 경매 플랫폼! 🚀✨

## 🚀 npm 배포 준비

### 1. 패키지 빌드
```bash
npm run build
```

### 2. npm 배포
```bash
npm publish
```

### 3. 다른 프로젝트에서 사용
```bash
npm install bidhub-auction-platform
```

```typescript
import { App, ItemCard, DataManager } from 'bidhub-auction-platform';

const app = new App({
  enableDebugMode: true,
  apiDelay: 1000
});
```
