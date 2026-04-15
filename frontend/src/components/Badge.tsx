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
  const baseClasses = 'inline-flex items-center gap-2 font-semibold rounded-full shadow-lg';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white',
    gray: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-5 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const pulseClass = pulse ? 'animate-pulse' : '';

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${pulseClass} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
