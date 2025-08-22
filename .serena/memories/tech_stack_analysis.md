# 기술 스택 분석

## 현재 구조의 특징
1. **Vanilla TypeScript**: React 없는 순수 TypeScript 구현
2. **컴포넌트 패턴**: 클래스 기반 컴포넌트 구조
3. **이벤트 기반 통신**: EventBus를 통한 컴포넌트 간 통신
4. **Mock API**: JSON 파일 기반 데이터 처리

## 개발 도구
- **TypeScript**: ES2020 타겟, 엄격한 타입 검사
- **ESLint**: TypeScript 린팅 및 Prettier 통합
- **Jest**: 테스트 프레임워크
- **Serve**: 개발 서버

## 빌드 프로세스
- TypeScript 컴파일 → dist/ 폴더 출력
- 개발 시 watch 모드 지원
- 프로덕션 빌드 최적화 부족