import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    borderRadius: '14px',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled ? 0.4 : 1,
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    overflow: 'hidden',
    letterSpacing: '0.02em',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '10px 20px', fontSize: '13px' },
    md: { padding: '14px 28px', fontSize: '15px' },
    lg: { padding: '16px 36px', fontSize: '16px' },
    xl: { padding: '18px 42px', fontSize: '17px' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, #2dd4a8, #1a9e7a)',
      color: '#0f1923',
      boxShadow: '0 4px 20px rgba(45, 212, 168, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.06)',
      color: '#8899a6',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: 'none',
    },
    success: {
      background: 'linear-gradient(135deg, #2dd4a8, #1a9e7a)',
      color: '#0f1923',
      boxShadow: '0 4px 20px rgba(45, 212, 168, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: '#fff',
      boxShadow: '0 4px 20px rgba(239, 68, 68, 0.35)',
    },
    ghost: {
      background: 'transparent',
      color: '#8899a6',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    },
    outline: {
      background: 'transparent',
      color: '#2dd4a8',
      border: '2px solid #2dd4a8',
      boxShadow: '0 0 20px rgba(45, 212, 168, 0.1)',
    },
  };

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={combinedStyles}
      className={`game-btn game-btn-${variant} ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
}
