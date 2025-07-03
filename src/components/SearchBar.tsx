import React, { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search',
  className = '',
  style = {},
}) => {
  const [active, setActive] = useState(false);
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--surface-secondary)',
        borderRadius: '12px',
        boxShadow: '0 1px 4px 0 rgba(31,31,31,0.04)',
        padding: '0 24px 0 16px',
        height: 38,
        width: 200,
        minWidth: 0,
        border: active ? '1px solid var(--border-brand)' : 'none',
        transition: 'border 0.18s',
        ...style,
      }}
    >
      <img
        src="/icons/list icons/search.svg"
        alt="Search"
        style={{
          marginRight: 8,
          width: 12,
          height: 10,
          display: 'block',
          color: 'var(--icon-secondary)',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          fontWeight: 400,
          width: '100%',
        }}
        aria-label={placeholder}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      />
    </div>
  );
}; 