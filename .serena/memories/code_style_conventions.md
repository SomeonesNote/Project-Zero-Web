# 코드 스타일 및 컨벤션

## TypeScript 설정
- **타겟**: ES2020
- **모듈**: ESNext
- **엄격 모드**: 활성화
- **소스맵**: 활성화
- **선언 파일**: 자동 생성

## ESLint 규칙
- TypeScript 권장 설정 사용
- Prettier 통합
- 미사용 변수 에러 처리
- 명시적 함수 반환 타입 권장
- `any` 타입 사용 제한

## 네이밍 컨벤션
- **클래스**: PascalCase (App, DataManager)
- **메서드/변수**: camelCase (handleSearch, currentPage)
- **파일명**: PascalCase.ts (App.ts, DataManager.ts)
- **상수**: UPPER_SNAKE_CASE

## 폴더 구조
- `src/components/`: 컴포넌트 파일들
- `src/utils/`: 유틸리티 클래스들
- `src/types/`: 타입 정의들
- `styles/`: CSS 파일들

## Path Alias
- `@/*`: src/* 경로
- `@/components/*`: src/components/* 경로
- `@/utils/*`: src/utils/* 경로
- `@/types/*`: src/types/* 경로