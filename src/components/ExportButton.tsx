import React, { useState, useRef } from 'react';

const BUTTON_PRIMARY = 'var(--button-primary)';
const BUTTON_PRIMARY_HOVER = 'var(--button-primary-hover)';
const BUTTON_PRIMARY_PRESSED = 'var(--button-primary-pressed)';

interface ExportButtonProps {
  onExport: (format: 'png' | 'jpg' | 'tiff') => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  let background = BUTTON_PRIMARY;
  if (isPressed) background = BUTTON_PRIMARY_PRESSED;
  else if (isHovered) background = BUTTON_PRIMARY_HOVER;

  function handleMouseDown() {
    setIsPressed(true);
    pressTimer.current = setTimeout(() => {
      setShowDropdown(true);
    }, 500); // 500ms for long press
  }
  function handleMouseUp() {
    setIsPressed(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (!showDropdown) {
      onExport('png'); // Fast click: export PNG
    }
  }
  function handleMouseLeave() {
    setIsHovered(false);
    setIsPressed(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        style={{
          width: '100%',
          padding: '12px 12px',
          background,
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          fontSize: '1rem',
          fontWeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background 0.15s',
          outline: 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <span style={{ fontSize: '1rem', fontWeight: 400 }}>Export</span>
        {/* Chevron Down SVG */}
        <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 12L16 20L24 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          width: '100%',
          background: 'var(--button-secondary)',
          border: '1px solid var(--border-secondary)',
          borderRadius: 8,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
          zIndex: 10,
        }}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <DropdownItem label="Export as JPG" onClick={() => { setShowDropdown(false); onExport('jpg'); }} />
          <DropdownItem label="Export as TIFF" onClick={() => { setShowDropdown(false); onExport('tiff'); }} />
        </div>
      )}
    </div>
  );
};

// DropdownItem component for consistent hover styling
function DropdownItem({ label, onClick }: { label: string; onClick: () => void }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      style={{
        padding: '12px',
        cursor: 'pointer',
        color: 'var(--text-primary)',
        background: hover ? 'var(--button-secondary-hover)' : 'var(--button-secondary)',
        borderRadius: 6,
        transition: 'background 0.15s',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

export default ExportButton; 