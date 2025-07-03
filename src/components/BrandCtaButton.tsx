import React from 'react';

interface BrandCtaButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
}

export const BrandCtaButton: React.FC<BrandCtaButtonProps> = ({
  children,
  onClick,
  disabled = false,
  size = 'md',
  variant = 'primary',
  className = '',
  type = 'button',
  icon,
}) => {
  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '6px 16px', fontSize: '14px', minHeight: '32px' };
      case 'lg':
        return { padding: '16px 32px', fontSize: '18px', minHeight: '56px' };
      default: // md
        return { padding: '6px 24px', fontSize: '16px', minHeight: '40px' };
    }
  };

  const getVariantStyles = (): React.CSSProperties => {
    if (disabled) {
      return {
        background: 'var(--disabled)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-primary)',
        cursor: 'not-allowed',
      };
    }

    if (variant === 'secondary') {
      return {
        background: 'var(--button-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-primary)',
        cursor: 'pointer',
      };
    }

    // primary variant
    return {
      background: 'var(--button-primary)',
      color: 'var(--text-contrast)',
      border: '1px solid var(--button-primary)',
      cursor: 'pointer',
    };
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    fontWeight: 600,
    letterSpacing: '0.025em',
    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    gap: icon ? '4px' : '0',
    ...getSizeStyles(),
    ...getVariantStyles(),
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const button = e.currentTarget;
    if (variant === 'primary') {
      button.style.background = 'var(--button-primary-hover)';
      button.style.borderColor = 'var(--button-primary-hover)';
      button.style.transform = 'translateY(-1px)';
      button.style.boxShadow = '0 4px 12px rgba(223, 120, 23, 0.3)';
    } else {
      button.style.background = 'var(--button-secondary-hover)';
      button.style.borderColor = 'var(--border-secondary)';
      button.style.transform = 'translateY(-1px)';
      button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const button = e.currentTarget;
    if (variant === 'primary') {
      button.style.background = 'var(--button-primary)';
      button.style.borderColor = 'var(--button-primary)';
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = 'none';
    } else {
      button.style.background = 'var(--button-secondary)';
      button.style.borderColor = 'var(--border-primary)';
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = 'none';
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const button = e.currentTarget;
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    
    if (variant === 'primary') {
      button.style.background = 'var(--button-primary-pressed)';
      button.style.borderColor = 'var(--button-primary-pressed)';
    } else {
      button.style.background = 'var(--button-secondary-pressed)';
      button.style.borderColor = 'var(--border-secondary)';
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const button = e.currentTarget;
    if (variant === 'primary') {
      button.style.background = 'var(--button-primary-hover)';
      button.style.borderColor = 'var(--button-primary-hover)';
      button.style.transform = 'translateY(-1px)';
      button.style.boxShadow = '0 4px 12px rgba(223, 120, 23, 0.3)';
    } else {
      button.style.background = 'var(--button-secondary-hover)';
      button.style.borderColor = 'var(--border-secondary)';
      button.style.transform = 'translateY(-1px)';
      button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }
  };

  return (
    <button
      type={type}
      className={`brand-cta-button ${className}`}
      style={baseStyles}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      aria-disabled={disabled}
    >
      {icon && (
        <img 
          src={`/icons/list icons/${icon}`}
          alt=""
          width={12}
          height={12}
          style={{ filter: 'var(--icon-invert-filter)' }}
        />
      )}
      {children}
    </button>
  );
}; 