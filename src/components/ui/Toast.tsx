import { useEffect, useState } from 'react';
import { DESIGN_TOKENS } from '@/constants/design-tokens';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 4000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 마운트 시 애니메이션
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 자동 사라짐
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      top: '20px',
      right: '20px',
      minWidth: '320px',
      maxWidth: '500px',
      padding: DESIGN_TOKENS.spacing.lg,
      borderRadius: DESIGN_TOKENS.layout.borderRadius.lg,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: DESIGN_TOKENS.spacing.md,
      fontFamily: DESIGN_TOKENS.fonts.primary,
      zIndex: 1000,
      cursor: 'pointer',
      transform: isVisible && !isExiting ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible && !isExiting ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    const typeStyles = {
      success: {
        backgroundColor: DESIGN_TOKENS.colors.white,
        border: `1px solid ${DESIGN_TOKENS.colors.success}20`,
        borderLeftColor: DESIGN_TOKENS.colors.success,
        borderLeftWidth: '4px',
      },
      error: {
        backgroundColor: DESIGN_TOKENS.colors.white,
        border: `1px solid ${DESIGN_TOKENS.colors.error}20`,
        borderLeftColor: DESIGN_TOKENS.colors.error,
        borderLeftWidth: '4px',
      },
      warning: {
        backgroundColor: DESIGN_TOKENS.colors.white,
        border: `1px solid #F59E0B20`,
        borderLeftColor: '#F59E0B',
        borderLeftWidth: '4px',
      },
      info: {
        backgroundColor: DESIGN_TOKENS.colors.white,
        border: `1px solid ${DESIGN_TOKENS.colors.primary}20`,
        borderLeftColor: DESIGN_TOKENS.colors.primary,
        borderLeftWidth: '4px',
      },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIconStyles = () => ({
    width: '20px',
    height: '20px',
    flexShrink: 0,
    marginTop: '2px',
  });

  const getIcon = () => {
    const iconStyle = getIconStyles();
    
    switch (type) {
      case 'success':
        return (
          <svg style={iconStyle} fill={DESIGN_TOKENS.colors.success} viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg style={iconStyle} fill={DESIGN_TOKENS.colors.error} viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg style={iconStyle} fill="#F59E0B" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg style={iconStyle} fill={DESIGN_TOKENS.colors.primary} viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div style={getToastStyles()} onClick={handleClose}>
      {getIcon()}
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: DESIGN_TOKENS.fontSizes.sm,
          fontWeight: DESIGN_TOKENS.fontWeights.semibold,
          color: DESIGN_TOKENS.colors.dark,
          lineHeight: DESIGN_TOKENS.lineHeights.tight,
          marginBottom: message ? DESIGN_TOKENS.spacing.xs : 0,
        }}>
          {title}
        </div>
        
        {message && (
          <div style={{
            fontSize: DESIGN_TOKENS.fontSizes.sm,
            color: DESIGN_TOKENS.colors.secondary,
            lineHeight: DESIGN_TOKENS.lineHeights.relaxed,
          }}>
            {message}
          </div>
        )}
      </div>

      {/* 닫기 버튼 */}
      <button
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: DESIGN_TOKENS.spacing.xs,
          borderRadius: DESIGN_TOKENS.layout.borderRadius.sm,
          color: DESIGN_TOKENS.colors.secondary,
          fontSize: '18px',
          lineHeight: 1,
          transition: DESIGN_TOKENS.layout.transitions.normal,
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = DESIGN_TOKENS.colors.light;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;