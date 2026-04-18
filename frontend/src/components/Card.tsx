import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'gradient' | 'glass' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  glow?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  hoverable = false,
  onClick,
  glow = false,
}: CardProps) {
  const baseStyles: React.CSSProperties = {
    borderRadius: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: hoverable || onClick ? 'pointer' : 'default',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: '#1e2d3d',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    },
    gradient: {
      background: 'linear-gradient(135deg, #1e2d3d 0%, #253545 100%)',
      border: '1px solid rgba(45, 212, 168, 0.15)',
      boxShadow: glow
        ? '0 4px 24px rgba(45, 212, 168, 0.15), 0 0 40px rgba(45, 212, 168, 0.05)'
        : '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    glass: {
      background: 'rgba(30, 45, 61, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    elevated: {
      background: '#253545',
      border: '1px solid rgba(255, 255, 255, 0.04)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    },
  };

  const paddingMap: Record<string, string> = {
    none: '0',
    sm: '12px',
    md: '20px',
    lg: '24px',
    xl: '32px',
  };

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    padding: paddingMap[padding],
  };

  return (
    <div
      onClick={onClick}
      style={combinedStyles}
      className={`${hoverable ? 'game-card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
