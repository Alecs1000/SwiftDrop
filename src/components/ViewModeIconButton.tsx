import React, { useState } from 'react';

interface ViewModeIconButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ViewModeIconButton: React.FC<ViewModeIconButtonProps> = ({
  icon,
  active = false,
  onClick,
  className = '',
  style = {},
}) => {
  const [hover, setHover] = useState(false);

  // Colors from design tokens (same as FilterButton)
  const idleBg = 'var(--surface-primary)';
  const idleBorder = '1px solid var(--border-secondary)';
  const hoverBg = 'var(--surface-secondary)';
  const hoverBorder = '1px solid var(--border-secondary)';
  const activeBg = 'var(--surface-primary)';
  const activeBorder = '1.5px solid var(--border-brand)';
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
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        minWidth: 38,
        minHeight: 38,
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
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
        {icon}
      </span>
    </button>
  );
}; 