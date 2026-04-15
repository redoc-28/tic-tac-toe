import Icons from './Icons';

interface LoadingProps {
  message?: string;
  submessage?: string;
  variant?: 'primary' | 'secondary' | 'multi';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Loading({
  message = 'Loading...',
  submessage,
  variant = 'primary',
  size = 'md',
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const renderLoadingAnimation = () => {
    if (variant === 'multi') {
      return (
        <div className={`relative ${sizeClasses[size]} mx-auto mb-8`}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
          <div className="relative w-full h-full flex items-center justify-center">
            <Icons.Search className={`${iconSizes[size]} text-purple-600 animate-pulse`} />
            <div className="absolute inset-0 border-4 border-purple-300 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <div
              className="absolute inset-4 border-4 border-pink-300 border-b-transparent rounded-full animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1s' }}
            ></div>
          </div>
        </div>
      );
    }

    if (variant === 'secondary') {
      return (
        <div className={`relative ${sizeClasses[size]} mx-auto mb-6`}>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
      );
    }

    // Primary variant
    return (
      <div className={`relative ${sizeClasses[size]} mx-auto mb-8`}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="relative flex items-center justify-center w-full h-full">
          <Icons.Spinner className={`${iconSizes[size]} text-indigo-600`} />
        </div>
      </div>
    );
  };

  return (
    <div className="text-center py-12">
      {renderLoadingAnimation()}
      <h2 className={`${textSizes[size]} font-bold text-gray-800 mb-2`}>{message}</h2>
      {submessage && <p className="text-gray-500">{submessage}</p>}
      {variant === 'multi' && (
        <div className="flex justify-center gap-2 mt-4">
          <span
            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></span>
          <span
            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></span>
          <span
            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></span>
        </div>
      )}
    </div>
  );
}
