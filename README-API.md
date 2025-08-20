# BidHub - API 기반 경매 플랫폼 웹사이트

Figma 디자인을 기반으로 제작된 **API 기반** 현대적인 경매 플랫폼 웹사이트입니다.

## 🚀 주요 특징

### ✨ API 기반 데이터 관리
- **MockAPI 시스템**: 실제 웹서버 API와 동일한 형식의 응답
- **비동기 데이터 로딩**: Promise 기반의 비동기 처리
- **에러 핸들링**: API 오류 시 대체 데이터 사용
- **로딩 상태 관리**: 사용자 경험을 위한 로딩 인디케이터

### 🏗️ 모듈화된 아키텍처
- **컴포넌트 기반 구조**: 재사용 가능한 UI 컴포넌트
- **ES6 모듈 시스템**: 깔끔한 의존성 관리
- **이벤트 기반 통신**: 컴포넌트 간 느슨한 결합

## 📊 API 응답 형식

### 상품 데이터 구조
```json
{
  "id": "item_001",
  "title": "Modern Living Room Set",
  "description": "현대적인 디자인의 프리미엄 거실 세트...",
  "currentBid": 1200,
  "startingBid": 800,
  "image": "images/living-room.jpg",
  "images": ["image1.jpg", "image2.jpg"],
  "category": "Home & Garden",
  "subcategory": "Furniture",
  "condition": "new",
  "location": "Seoul, South Korea",
  "seller": {
    "id": "seller_001",
    "name": "PremiumFurniture",
    "rating": 4.8,
    "totalSales": 1250
  },
  "auction": {
    "startTime": "2024-01-15T09:00:00Z",
    "endTime": "2024-01-22T18:00:00Z",
    "timeLeft": "3d 12h 45m",
    "status": "active",
    "totalBids": 15,
    "minBidIncrement": 50
  },
  "tags": ["modern", "furniture", "premium"],
  "shipping": {
    "cost": 150,
    "method": "Standard Delivery",
    "estimatedDays": 5,
    "freeShipping": false
  },
  "createdAt": "2024-01-15T09:00:00Z",
  "updatedAt": "2024-01-19T14:30:00Z"
}
```

### API 응답 형식
```json
{
  "success": true,
  "message": "데이터를 성공적으로 가져왔습니다.",
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 60,
      "itemsPerPage": 12,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "filters": {
      "applied": {...},
      "available": {...}
    },
    "categories": [...],
    "metadata": {
      "timestamp": "2024-01-19T14:30:00Z",
      "version": "1.0.0"
    }
  }
}
```

## 🛠️ 사용 가능한 API 엔드포인트

### 1. 상품 관련 API
- `getAllItems(options)` - 모든 상품 가져오기 (페이지네이션, 필터링, 정렬 지원)
- `getFeaturedItems(limit)` - 추천 상품 가져오기
- `getEndingSoonItems(limit)` - 곧 마감되는 상품 가져오기
- `getItemsByCategory(categoryId)` - 카테고리별 상품 가져오기
- `getItemDetail(itemId)` - 상품 상세 정보 가져오기

### 2. 검색 관련 API
- `getSearchSuggestions(query)` - 검색 제안 가져오기

### 3. API 옵션
```javascript
// 페이지네이션
{ page: 1, limit: 12 }

// 검색
{ search: "Electronics" }

// 카테고리 필터
{ category: "Electronics" }

// 정렬
{ sortBy: "price-low" | "price-high" | "title" | "newest" | "oldest" | "ending-soon" }

// 조합 사용
{ page: 2, limit: 8, search: "vintage", sortBy: "price-high" }
```

## 🎯 컴포넌트별 기능

### ItemCard 컴포넌트
- **동적 데이터 표시**: API 응답 데이터를 기반으로 UI 렌더링
- **상태별 배지**: 상품 상태(신품, 중고, 빈티지, 골동품) 표시
- **시간 표시**: 남은 시간에 따른 색상 및 애니메이션
- **마감임박 표시**: 곧 마감되는 상품 강조

### ItemGrid 컴포넌트
- **API 데이터 연동**: 비동기 데이터 로딩 및 표시
- **에러 처리**: API 오류 시 대체 UI 표시
- **로딩 상태**: 데이터 로딩 중 사용자 피드백

### SearchBar 컴포넌트
- **실시간 검색**: API 기반 검색 제안
- **검색 제안**: 카테고리, 태그, 상품명 기반 제안
- **검색 히스토리**: 사용자 검색 패턴 분석

## 🔧 개발자 도구

### API 테스트
```javascript
// 모든 상품 가져오기
BidHubUtils.testAPI.getAllItems({ page: 1, limit: 8 })

// 추천 상품 가져오기
BidHubUtils.testAPI.getFeaturedItems(4)

// 곧 마감되는 상품 가져오기
BidHubUtils.testAPI.getEndingSoonItems(4)

// 카테고리별 상품
BidHubUtils.testAPI.getItemsByCategory('Electronics')

// 상품 상세 정보
BidHubUtils.testAPI.getItemDetail('item_001')

// 검색 제안
BidHubUtils.testAPI.getSearchSuggestions('Electronics')
```

### API 설정
```javascript
// API 지연 시간 설정 (네트워크 지연 시뮬레이션)
BidHubUtils.setAPIDelay(2000)

// 상품 데이터 내보내기
BidHubUtils.exportItems()

// 상품 데이터 가져오기
BidHubUtils.importItems(jsonData)
```

## 📱 반응형 디자인

모든 컴포넌트는 반응형 디자인을 지원하며, API 데이터에 따라 동적으로 레이아웃이 조정됩니다:

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

### API 확장
- [ ] **실제 백엔드 연동**: Node.js/Express 또는 Django 백엔드
- [ ] **데이터베이스 연동**: MongoDB, PostgreSQL 등
- [ ] **실시간 업데이트**: WebSocket을 통한 실시간 입찰 정보
- [ ] **이미지 업로드**: 상품 이미지 업로드 및 관리

### 기능 확장
- [ ] **사용자 인증**: JWT 기반 로그인/회원가입
- [ ] **입찰 시스템**: 실시간 입찰 및 알림
- [ ] **결제 시스템**: 안전한 결제 처리
- [ ] **관리자 대시보드**: 상품 및 사용자 관리

### 성능 최적화
- [ ] **이미지 최적화**: WebP 포맷, 지연 로딩
- [ ] **캐싱 시스템**: Redis를 통한 데이터 캐싱
- [ ] **CDN 연동**: 이미지 및 정적 파일 CDN 배포
- [ ] **코드 분할**: 동적 import를 통한 번들 최적화

## 🤝 기여하기

API 기반 구조로 인해 새로운 기능 추가가 훨씬 쉬워졌습니다:

1. **새 API 엔드포인트**: `utils/api.js`에 새로운 API 메서드 추가
2. **데이터 형식 확장**: `ITEM_DATA_FORMAT`에 새로운 필드 추가
3. **컴포넌트 확장**: 기존 컴포넌트를 상속하여 새로운 기능 추가
4. **백엔드 연동**: 실제 웹서버 API로 MockAPI 교체

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**BidHub API 버전** - 실제 웹서버 API와 동일한 형식으로 구축된 현대적인 경매 플랫폼! 🚀✨

## 🚀 실행 방법

### 1. 모듈화된 API 버전 실행
```bash
# 로컬 서버 실행 (ES6 모듈 지원 필요)
python -m http.server 8000
# 또는
npx serve .

# 브라우저에서 접속
http://localhost:8000/index-modular.html
```

### 2. 개발자 도구 활용
브라우저 콘솔에서 API 테스트 및 데이터 관리가 가능합니다:

```javascript
// API 테스트
BidHubUtils.testAPI.getAllItems()
BidHubUtils.testAPI.getFeaturedItems(4)

// 설정 변경
BidHubUtils.setAPIDelay(1000)
BidHubUtils.setSearchTerm('Electronics')
```
