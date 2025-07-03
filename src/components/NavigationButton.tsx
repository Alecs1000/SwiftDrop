import React from 'react';

interface NavigationButtonProps {
  icon: React.ReactNode;
  label?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  icon,
  label,
  active = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all font-medium select-none focus:outline-none ${className}`}
      style={{
        background: active ? 'var(--surface-secondary)' : 'transparent',
        color: active ? 'var(--surface-brand)' : 'var(--icon-secondary)',
        boxShadow: active ? '0 2px 8px 0 rgba(0,0,0,0.04)' : 'none',
        border: active ? '1.5px solid var(--border-brand)' : '1.5px solid transparent',
        cursor: 'pointer',
        minWidth: 56,
        minHeight: 56,
        transition: 'background 0.15s, color 0.15s, border 0.15s',
      }}
      onClick={onClick}
      aria-pressed={active}
      tabIndex={0}
      onMouseOver={e => {
        (e.currentTarget as HTMLButtonElement).style.background = active ? 'var(--surface-secondary)' : 'var(--surface-primary)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--surface-brand)';
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLButtonElement).style.background = active ? 'var(--surface-secondary)' : 'transparent';
        (e.currentTarget as HTMLButtonElement).style.color = active ? 'var(--surface-brand)' : 'var(--icon-secondary)';
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: label ? 2 : 0 }}>
        {icon}
      </span>
      {label && (
        <span
          style={{
            fontSize: 12,
            marginTop: 2,
            color: active ? 'var(--surface-brand)' : 'var(--text-secondary)',
            fontWeight: active ? 600 : 500,
            letterSpacing: 0.1,
            transition: 'color 0.15s',
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
}; 