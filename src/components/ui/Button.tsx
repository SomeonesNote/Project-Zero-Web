import React from 'react';
import { DESIGN_TOKENS, commonStyles } from '@/constants/design-tokens';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  style = {},
  'data-testid': testId,
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          ...commonStyles.button.primary,
          backgroundColor: disabled || loading ? DESIGN_TOKENS.colors.secondary : DESIGN_TOKENS.colors.primary,
        };
      case 'secondary':
        return {
          ...commonStyles.button.secondary,
          backgroundColor: DESIGN_TOKENS.colors.light,
          color: DESIGN_TOKENS.colors.dark,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: DESIGN_TOKENS.colors.primary,
          border: `2px solid ${DESIGN_TOKENS.colors.primary}`,
        };
      default:
        return commonStyles.button.primary;
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'small':
        return {
          fontSize: DESIGN_TOKENS.fontSizes.xs,
          padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.md}`,
          height: DESIGN_TOKENS.spacing['3xl'],
        };
      case 'medium':
        return {
          fontSize: DESIGN_TOKENS.fontSizes.sm,
          padding: `0px ${DESIGN_TOKENS.spacing.lg}`,
          height: DESIGN_TOKENS.spacing['4xl'],
        };
      case 'large':
        return {
          ...commonStyles.button.large,
        };
      default:
        return {};
    }
  };

  const combinedStyles: React.CSSProperties = {
    ...commonStyles.button.base,
    ...getVariantStyles(),
    ...getSizeStyles(),
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      type={type}
      style={combinedStyles}
      onClick={handleClick}
      disabled={disabled || loading}
      className={className}
      data-testid={testId}
    >
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_TOKENS.spacing.sm }}>
          <div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTop: `2px solid ${variant === 'primary' ? DESIGN_TOKENS.colors.white : DESIGN_TOKENS.colors.primary}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;