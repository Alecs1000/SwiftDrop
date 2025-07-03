import React, { useState, useRef, useEffect } from 'react';

interface DropdownButtonProps {
  label: string;
  options: string[];
  onSelect?: (option: string) => void;
}

export default function DropdownButton({ label, options, onSelect }: DropdownButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: open ? 'var(--surface-secondary)' : 'var(--surface-primary)',
          color: 'var(--text-secondary)',
          border: 'none',
          borderRadius: 12,
          fontSize: '1rem',
          fontWeight: 400,
          padding: '8px 12px',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
      >
        <span>{label}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
          <path d="M7 10l5 5 5-5" stroke="#68686A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            minWidth: '100%',
            background: 'var(--surface-primary)',
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginTop: 8,
            zIndex: 100,
          }}
        >
          {options.map(option => (
            <div
              key={option}
              onClick={() => { setOpen(false); onSelect?.(option); }}
              style={{
                padding: '8px 12px',
                fontSize: '.875rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                borderRadius: 12,
                transition: 'background 0.12s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'var(--surface-brand)';
                e.currentTarget.style.color = 'var(--text-invert)';
              }}
              onMouseOut={e => (e.currentTarget.style.background = 'var(--surface-primary)')}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 