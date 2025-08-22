/**
 * Design Tokens - 디자인 시스템 기본 토큰
 * 모든 스타일 값들을 중앙화하여 일관성 유지 및 유지보수 향상
 */

export const DESIGN_TOKENS = {
  colors: {
    // Primary Colors
    primary: '#268CF5',
    primaryHover: '#1a6bc7',
    
    // Text Colors
    dark: '#121417',
    secondary: '#61758A',
    
    // Background Colors
    light: '#F0F2F5',
    white: '#FFFFFF',
    
    // Border Colors
    border: '#E5E8EB',
    borderLight: '#DBE0E5',
    
    // Status Colors
    error: '#DC2626',
    errorBg: '#FEE2E2',
    errorBorder: '#FCA5A5',
    success: '#059669',
    warning: '#D97706',
  },
  
  fonts: {
    primary: 'Work Sans, sans-serif',
    fallback: 'system-ui, -apple-system, sans-serif',
  },
  
  fontSizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '22px',
    '2xl': '28px',
    '3xl': '32px',
  },
  
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    tight: '1.25em',
    normal: '1.5em',
    relaxed: '1.75em',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
    '6xl': '56px',
  },
  
  layout: {
    containerWidth: '1280px',
    contentPadding: '20px 160px',
    headerPadding: '12px 40px',
    
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
    
    shadows: {
      sm: '0px 0px 4px 0px rgba(0, 0, 0, 0.1)',
      md: '0px 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    
    transitions: {
      fast: '150ms ease-in-out',
      normal: '300ms ease-in-out',
      slow: '500ms ease-in-out',
    },
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

/**
 * 공통 스타일 객체들
 */
export const commonStyles = {
  // 컨테이너 스타일
  container: {
    width: DESIGN_TOKENS.layout.containerWidth,
    margin: '0 auto',
    padding: DESIGN_TOKENS.layout.contentPadding,
  },
  
  // 헤더 스타일
  header: {
    borderBottom: `1px solid ${DESIGN_TOKENS.colors.border}`,
    backgroundColor: DESIGN_TOKENS.colors.white,
    padding: DESIGN_TOKENS.layout.headerPadding,
  },
  
  // 버튼 기본 스타일
  button: {
    base: {
      fontFamily: DESIGN_TOKENS.fonts.primary,
      fontWeight: DESIGN_TOKENS.fontWeights.bold,
      borderRadius: DESIGN_TOKENS.layout.borderRadius.md,
      border: 'none',
      cursor: 'pointer',
      transition: DESIGN_TOKENS.layout.transitions.normal,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    primary: {
      backgroundColor: DESIGN_TOKENS.colors.primary,
      color: DESIGN_TOKENS.colors.white,
      fontSize: DESIGN_TOKENS.fontSizes.sm,
      lineHeight: DESIGN_TOKENS.lineHeights.normal,
      padding: `0px ${DESIGN_TOKENS.spacing.lg}`,
      height: DESIGN_TOKENS.spacing['4xl'],
    },
    
    large: {
      fontSize: DESIGN_TOKENS.fontSizes.base,
      lineHeight: DESIGN_TOKENS.lineHeights.normal,
      padding: `0px ${DESIGN_TOKENS.spacing.xl}`,
      height: DESIGN_TOKENS.spacing['5xl'],
    },
    
    secondary: {
      backgroundColor: DESIGN_TOKENS.colors.light,
      color: DESIGN_TOKENS.colors.dark,
      fontSize: DESIGN_TOKENS.fontSizes.sm,
      lineHeight: DESIGN_TOKENS.lineHeights.normal,
    },
  },
  
  // 입력 필드 스타일
  input: {
    base: {
      backgroundColor: DESIGN_TOKENS.colors.light,
      border: 'none',
      outline: 'none',
      borderRadius: DESIGN_TOKENS.layout.borderRadius.md,
      fontFamily: DESIGN_TOKENS.fonts.primary,
      fontSize: DESIGN_TOKENS.fontSizes.base,
      lineHeight: DESIGN_TOKENS.lineHeights.normal,
      color: DESIGN_TOKENS.colors.secondary,
      padding: DESIGN_TOKENS.spacing.lg,
    },
    
    error: {
      border: `2px solid ${DESIGN_TOKENS.colors.error}`,
    },
  },
  
  // 카드 스타일
  card: {
    base: {
      backgroundColor: DESIGN_TOKENS.colors.white,
      borderRadius: DESIGN_TOKENS.layout.borderRadius.md,
      overflow: 'hidden',
      transition: DESIGN_TOKENS.layout.transitions.normal,
    },
    
    bordered: {
      border: `1px solid ${DESIGN_TOKENS.colors.borderLight}`,
    },
    
    shadow: {
      boxShadow: DESIGN_TOKENS.layout.shadows.sm,
    },
  },
  
  // 텍스트 스타일
  text: {
    heading: {
      fontFamily: DESIGN_TOKENS.fonts.primary,
      fontWeight: DESIGN_TOKENS.fontWeights.bold,
      color: DESIGN_TOKENS.colors.dark,
      margin: 0,
    },
    
    body: {
      fontFamily: DESIGN_TOKENS.fonts.primary,
      fontWeight: DESIGN_TOKENS.fontWeights.normal,
      color: DESIGN_TOKENS.colors.dark,
      lineHeight: DESIGN_TOKENS.lineHeights.normal,
    },
    
    secondary: {
      color: DESIGN_TOKENS.colors.secondary,
    },
  },
} as const;

/**
 * 반응형 유틸리티
 */
export const responsive = {
  mediaQuery: (breakpoint: keyof typeof DESIGN_TOKENS.breakpoints) => 
    `@media (min-width: ${DESIGN_TOKENS.breakpoints[breakpoint]})`,
    
  containerQuery: (width: string) => 
    `@container (min-width: ${width})`,
};

/**
 * 타입 정의
 */
export type ColorToken = keyof typeof DESIGN_TOKENS.colors;
export type SpacingToken = keyof typeof DESIGN_TOKENS.spacing;
export type FontSizeToken = keyof typeof DESIGN_TOKENS.fontSizes;
export type BorderRadiusToken = keyof typeof DESIGN_TOKENS.layout.borderRadius;