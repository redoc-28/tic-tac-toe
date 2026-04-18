import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  pulse?: boolean;
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  pulse = false,
  className = '',
}: BadgeProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 700,
    borderRadius: '999px',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.02em',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'rgba(45, 212, 168, 0.15)',
      color: '#2dd4a8',
      border: '1px solid rgba(45, 212, 168, 0.3)',
      boxShadow: '0 0 20px rgba(45, 212, 168, 0.1)',
    },
    success: {
      background: 'rgba(45, 212, 168, 0.15)',
      color: '#2dd4a8',
      border: '1px solid rgba(45, 212, 168, 0.3)',
      boxShadow: '0 0 20px rgba(45, 212, 168, 0.15)',
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.15)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      boxShadow: '0 0 20px rgba(239, 68, 68, 0.1)',
    },
    warning: {
      background: 'rgba(251, 191, 36, 0.15)',
      color: '#fbbf24',
      border: '1px solid rgba(251, 191, 36, 0.3)',
      boxShadow: '0 0 20px rgba(251, 191, 36, 0.1)',
    },
    info: {
      background: 'rgba(59, 130, 246, 0.15)',
      color: '#3b82f6',
      border: '1px solid rgba(59, 130, 246, 0.3)',
    },
    gray: {
      background: 'rgba(136, 153, 166, 0.12)',
      color: '#8899a6',
      border: '1px solid rgba(136, 153, 166, 0.2)',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '4px 12px', fontSize: '12px' },
    md: { padding: '6px 16px', fontSize: '14px' },
    lg: { padding: '10px 24px', fontSize: '16px' },
  };

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  return (
    <span
      style={combinedStyles}
      className={`${pulse ? 'animate-pulse-glow' : ''} ${className}`}
    >
      {icon && <span style={{ display: 'flex', flexShrink: 0 }}>{icon}</span>}
      {children}
    </span>
  );
}
