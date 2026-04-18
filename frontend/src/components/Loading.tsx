import Icons from './Icons';

interface LoadingProps {
  message?: string;
  submessage?: string;
  variant?: 'primary' | 'secondary' | 'multi';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCancel?: boolean;
  onCancel?: () => void;
}

export default function Loading({
  message = 'Loading...',
  submessage,
  variant = 'primary',
  size = 'md',
  showCancel = false,
  onCancel,
}: LoadingProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    minHeight: '300px',
  };

  const sizes: Record<string, number> = {
    sm: 48,
    md: 72,
    lg: 96,
    xl: 120,
  };

  const spinnerSize = sizes[size];

  const renderSpinner = () => {
    if (variant === 'multi') {
      return (
        <div style={{
          position: 'relative',
          width: spinnerSize,
          height: spinnerSize,
          margin: '0 auto 32px',
        }}>
          {/* Outer glow */}
          <div style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45, 212, 168, 0.15), transparent 70%)',
          }} className="animate-glow-pulse" />

          {/* Outer ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid rgba(45, 212, 168, 0.15)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#2dd4a8',
          }} className="animate-spin-slow" />

          {/* Inner ring */}
          <div style={{
            position: 'absolute',
            inset: '12px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderBottomColor: 'rgba(45, 212, 168, 0.5)',
          }} className="animate-spin-reverse" />

          {/* Center icon */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icons.Search
              className={`text-[#2dd4a8]`}
            />
          </div>
        </div>
      );
    }

    if (variant === 'secondary') {
      return (
        <div style={{
          position: 'relative',
          width: spinnerSize,
          height: spinnerSize,
          margin: '0 auto 32px',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid rgba(45, 212, 168, 0.12)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#2dd4a8',
          }} className="animate-spin-slow" />
        </div>
      );
    }

    // Primary variant
    return (
      <div style={{
        position: 'relative',
        width: spinnerSize,
        height: spinnerSize,
        margin: '0 auto 32px',
      }}>
        <div style={{
          position: 'absolute',
          inset: '-16px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45, 212, 168, 0.12), transparent 70%)',
        }} className="animate-glow-pulse" />
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icons.Spinner className={`text-[#2dd4a8]`} style={{ width: spinnerSize * 0.7, height: spinnerSize * 0.7 } as React.CSSProperties} />
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      {renderSpinner()}

      <h2 style={{
        fontSize: size === 'xl' ? '28px' : size === 'lg' ? '24px' : size === 'md' ? '20px' : '16px',
        fontWeight: 700,
        color: '#e8edf2',
        marginBottom: '8px',
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        letterSpacing: '-0.01em',
      }}>
        {message}
      </h2>

      {submessage && (
        <p style={{
          color: '#5b6f80',
          fontSize: '14px',
          marginTop: '4px',
          lineHeight: 1.5,
        }}>
          {submessage}
        </p>
      )}

      {variant === 'multi' && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '24px',
        }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#2dd4a8',
                display: 'block',
                animation: `bounce-dot 1.2s ease-in-out ${i * 0.16}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {showCancel && onCancel && (
        <button
          onClick={onCancel}
          style={{
            marginTop: '32px',
            padding: '10px 28px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            color: '#8899a6',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
