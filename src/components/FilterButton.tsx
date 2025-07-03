import React, { useState } from 'react';

interface FilterButtonProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  active = false,
  onClick,
  children,
  className = '',
  style = {},
}) => {
  const [hover, setHover] = useState(false);

  // Colors from design tokens
  const idleBg = 'var(--button-secondary)';
  const idleBorder = '1px solid var(--border-secondary)';
  const hoverBg = 'var(--button-secondary-hover)';
  const hoverBorder = '1px solid var(--border-secondary)';
  const activeBg = 'linear-gradient(0deg, rgba(223,120,23,0.06), rgba(223,120,23,0.06)), var(--surface-primary)';
  const activeBorder = '1px solid var(--border-brand)';
  const borderRadius = '12px';

  let background = idleBg;
  let border = idleBorder;
  if (active) {
    background = activeBg;
    border = activeBorder;
  } else if (hover) {
    background = hoverBg;
    border = hoverBorder;
  }

  return (
    <button
      type="button"
      className={className}
      aria-pressed={active}
      tabIndex={0}
      onClick={onClick}
      style={{
        borderRadius,
        background,
        border,
        color: 'var(--text-primary)',
        fontWeight: 500,
        fontSize: '1.15rem',
        letterSpacing: '0.02em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        padding: '0 20px',
        transition: 'background 0.18s, border 0.18s',
        outline: 'none',
        cursor: 'pointer',
        userSelect: 'none',
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={() => setHover(false)}
      onMouseUp={() => setHover(true)}
    >
      {children}
    </button>
  );
}; 