import React from 'react';
import { DESIGN_TOKENS, commonStyles } from '@/constants/design-tokens';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  disabled = false,
  required = false,
  error,
  label,
  id,
  name,
  autoComplete,
  className = '',
  style = {},
  'data-testid': testId,
}) => {
  const inputId = id || name || 'input';

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  };

  const labelStyles: React.CSSProperties = {
    ...commonStyles.text.body,
    fontWeight: DESIGN_TOKENS.fontWeights.medium,
    fontSize: DESIGN_TOKENS.fontSizes.base,
    color: DESIGN_TOKENS.colors.dark,
    marginBottom: DESIGN_TOKENS.spacing.sm,
  };

  const inputStyles: React.CSSProperties = {
    ...commonStyles.input.base,
    width: '100%',
    ...(error ? commonStyles.input.error : {}),
    ...style,
  };

  const errorStyles: React.CSSProperties = {
    fontSize: DESIGN_TOKENS.fontSizes.xs,
    color: DESIGN_TOKENS.colors.error,
    marginTop: DESIGN_TOKENS.spacing.xs,
  };

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <label htmlFor={inputId} style={labelStyles}>
          {label}
          {required && (
            <span style={{ color: DESIGN_TOKENS.colors.error, marginLeft: '2px' }}>
              *
            </span>
          )}
        </label>
      )}
      
      <input
        type={type}
        id={inputId}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        style={inputStyles}
        data-testid={testId}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      
      {error && (
        <span
          id={`${inputId}-error`}
          role="alert"
          style={errorStyles}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;