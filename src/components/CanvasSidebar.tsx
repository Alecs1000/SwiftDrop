import React from 'react';
import ExportButton from './ExportButton';
import { AngleIcon, RotationIcon, VerticalMirrorIcon, HorizontalMirrorIcon } from './icons/CanvasIcons';

const LABEL_WIDTH = 72;

const BUTTON_SIZE = 32;
const ICON_SIZE = 18;

const BOX_STYLE = {
  background: 'var(--button-secondary)',
  borderRadius: 8,
  padding: '8px 12px',
  fontWeight: 500,
  textAlign: 'center' as const,
  border: '1px solid var(--border-secondary)',
  fontSize: '0.875rem',
  minWidth: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-primary)',
  transition: 'background 0.15s, color 0.15s',
};

const FormButton: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties; onClick?: () => void }>> = ({ children, style, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <button
      style={{
        background: isHovered ? 'var(--button-secondary-hover)' : 'var(--button-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-secondary)',
        borderRadius: 8,
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s',
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

const ColorSwatch = ({ color }: { color: string }) => (
  <div style={{ width: 32, height: 32, borderRadius: 8, background: color, marginRight: 16 }} />
);

const ColorBox = ({ value }: { value: string }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div
      style={{
        ...BOX_STYLE,
        marginRight: 16,
        background: isHovered ? 'var(--button-secondary-hover)' : 'var(--button-secondary)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {value}
    </div>
  );
};

const OpacityBox = ({ value, style }: { value: string, style?: React.CSSProperties }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div
      style={{
        ...BOX_STYLE,
        padding: '8px 8px',
        borderRadius: 16,
        minWidth: 56,
        background: isHovered ? 'var(--button-secondary-hover)' : 'var(--button-secondary)',
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {value}
    </div>
  );
};

const BlendControls: React.FC<{
  opacity?: number;
  blendMode?: string;
  onChangeOpacity?: (opacity: number) => void;
  onChangeBlendMode?: (mode: string) => void;
}> = ({ opacity = 1, blendMode = 'normal', onChangeOpacity, onChangeBlendMode }) => {
  const [editing, setEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(Math.round(opacity * 100).toString());
  React.useEffect(() => {
    setInputValue(Math.round(opacity * 100).toString());
  }, [opacity]);
  const blendOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Multiply', value: 'multiply' },
    { label: 'Overlay', value: 'overlay' },
  ];
  return (
    <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontWeight: 550, fontSize: '1.1rem', marginBottom: 0 }}>Blend</div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
        <span style={{ fontSize: '1rem', fontWeight: 400, whiteSpace: 'nowrap', marginRight: 16, width: LABEL_WIDTH, minWidth: LABEL_WIDTH, display: 'inline-block' }}>Opacity</span>
        <div style={{ display: 'flex', gap: 12, flex: 1 }}>
          <div style={{ ...BOX_STYLE, flex: 1, minWidth: 56, borderRadius: 16, cursor: 'pointer', background: editing ? 'var(--button-secondary-hover)' : 'var(--button-secondary)' }}
            onClick={() => setEditing(true)}>
            {editing ? (
              <input
                type="number"
                min={0}
                max={100}
                value={inputValue}
                autoFocus
                style={{ width: 48, border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '1em', textAlign: 'center' }}
                onChange={e => setInputValue(e.target.value.replace(/[^0-9]/g, ''))}
                onBlur={() => {
                  setEditing(false);
                  let val = parseInt(inputValue, 10);
                  if (isNaN(val)) val = 100;
                  if (val < 0) val = 0;
                  if (val > 100) val = 100;
                  onChangeOpacity && onChangeOpacity(val / 100);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
              />
            ) : (
              <span>{Math.round(opacity * 100)}%</span>
            )}
          </div>
          <div style={{ ...BOX_STYLE, flex: 1, minWidth: 120, borderRadius: 20, cursor: 'pointer', position: 'relative' }}>
            <select
              value={blendMode}
              onChange={e => onChangeBlendMode && onChangeBlendMode(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '1em',
                padding: '4px 0',
                cursor: 'pointer',
                appearance: 'none',
                outline: 'none',
              }}
            >
              {blendOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <path d="M6 8L10 12L14 8" stroke="#68686a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CanvasSidebarProps {
  width?: number;
  height?: number;
  rotation?: number;
  mainColor?: string;
  onChangeWidth?: (w: number) => void;
  onChangeHeight?: (h: number) => void;
  onChangeRotation?: (r: number) => void;
  onMirrorVertical?: () => void;
  onMirrorHorizontal?: () => void;
  onChangeMainColor?: (color: string) => void;
  onExport?: (format: 'png' | 'jpg' | 'tiff') => void;
  opacity?: number;
  blendMode?: string;
  onChangeOpacity?: (opacity: number) => void;
  onChangeBlendMode?: (mode: string) => void;
  mockup?: any;
  onSelectVariant?: (variant: any) => void;
}

const TransformControls: React.FC<{
  width?: number;
  height?: number;
  rotation?: number;
  onChangeWidth?: (w: number) => void;
  onChangeHeight?: (h: number) => void;
  onChangeRotation?: (r: number) => void;
  onMirrorVertical?: () => void;
  onMirrorHorizontal?: () => void;
}> = ({ width, height, rotation, onChangeRotation, onMirrorVertical, onMirrorHorizontal }) => (
  <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
      <span style={{ fontWeight: 550, fontSize: '1.1rem' }}>Transform</span>
    </div>
    {/* Size Controls */}
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
      <span style={{ fontSize: '1rem', fontWeight: 400, whiteSpace: 'nowrap', marginRight: 16, width: LABEL_WIDTH, minWidth: LABEL_WIDTH, display: 'inline-block' }}>Size</span>
      <div style={{ display: 'flex', gap: 8, flex: 1 }}>
        <div style={{ ...BOX_STYLE, flex: 1, minWidth: 0 }}>
          W {width ? Math.round(width) : '--'}px
        </div>
        <div style={{ ...BOX_STYLE, flex: 1, minWidth: 0 }}>
          H {height ? Math.round(height) : '--'}px
        </div>
      </div>
    </div>
    {/* Rotation Controls */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <span style={{ fontSize: '1rem', fontWeight: 400, whiteSpace: 'nowrap', marginRight: 16, width: LABEL_WIDTH, minWidth: LABEL_WIDTH, display: 'inline-block' }}>Rotation</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <div style={{ ...BOX_STYLE, flex: 1.2, minWidth: 80, marginRight: 8, display: 'flex', gap: 6 }}>
          <AngleIcon style={{ width: 18, height: 18 }} />
          {rotation !== undefined ? `${Math.round(rotation)}°` : '--'}
        </div>
        <FormButton onClick={() => onChangeRotation && onChangeRotation((rotation || 0) + 45)}><RotationIcon style={{ width: ICON_SIZE, height: ICON_SIZE }} /></FormButton>
        <FormButton onClick={onMirrorVertical}><VerticalMirrorIcon style={{ width: ICON_SIZE, height: ICON_SIZE }} /></FormButton>
        <FormButton onClick={onMirrorHorizontal}><HorizontalMirrorIcon style={{ width: ICON_SIZE, height: ICON_SIZE }} /></FormButton>
      </div>
    </div>
  </div>
);

const VariantButton: React.FC<{ variants: any[]; onSelect?: (variant: any) => void }> = ({ variants, onSelect }) => {
  const [open, setOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  let background = 'var(--button-secondary)';
  if (isPressed) background = 'var(--button-secondary-pressed)';
  else if (isHovered) background = 'var(--button-secondary-hover)';
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        style={{
          width: '100%',
          padding: '12px 12px',
          background,
          color: 'var(--text-primary)',
          border: '1px solid var(--border-secondary)',
          borderRadius: 12,
          fontSize: '1rem',
          fontWeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background 0.15s, color 0.15s',
          outline: 'none',
          marginTop: 16,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => { setIsPressed(false); setOpen(o => !o); }}
      >
        <span style={{ fontSize: '1rem', fontWeight: 400 }}>Mockup Variants</span>
        {/* Chevron Down SVG */}
        <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 12L16 20L24 12" stroke="#68686a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
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
        }}>
          {variants.map(variant => (
            <VariantDropdownItem key={variant.key} label={variant.label} onClick={() => { setOpen(false); onSelect && onSelect(variant); }} />
          ))}
        </div>
      )}
    </div>
  );
};

// Dropdown item for variant menu with hover
function VariantDropdownItem({ label, onClick }: { label: string; onClick: () => void }) {
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

const ColorControls: React.FC<{ mainColor?: string; onChangeMainColor?: (color: string) => void }> = ({ mainColor, onChangeMainColor }) => {
  const [editingColor, setEditingColor] = React.useState(false);
  const [colorValue, setColorValue] = React.useState(mainColor || '');
  React.useEffect(() => {
    setColorValue(mainColor || '');
  }, [mainColor]);
  return (
    <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontWeight: 550, fontSize: '1.1rem', marginBottom: 0 }}>Colors</div>
      {/* Lg Color Row */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
        <span style={{ fontSize: '1rem', fontWeight: 400, whiteSpace: 'nowrap', marginRight: 16, width: LABEL_WIDTH, minWidth: LABEL_WIDTH, display: 'inline-block' }}>LG Color</span>
        <ColorSwatch color={mainColor || '#DF7818'} />
        {mainColor ? (
          editingColor ? (
            <input
              type="text"
              value={colorValue}
              autoFocus
              onChange={e => setColorValue(e.target.value)}
              onBlur={() => {
                setEditingColor(false);
                if (colorValue !== mainColor && onChangeMainColor) onChangeMainColor(colorValue);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                } else if (e.key === 'Escape') {
                  setEditingColor(false);
                  setColorValue(mainColor);
                }
              }}
              style={{ ...BOX_STYLE, marginRight: 16, width: 80, fontFamily: 'monospace', fontSize: '0.95em' }}
              maxLength={7}
            />
          ) : (
            <div
              style={{ ...BOX_STYLE, marginRight: 16, width: 80, fontFamily: 'monospace', fontSize: '0.95em', cursor: 'pointer' }}
              onClick={() => setEditingColor(true)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setEditingColor(true); }}
            >
              {mainColor}
            </div>
          )
        ) : (
          <ColorBox value="#DF7818" />
        )}
        <OpacityBox value="100%" />
      </div>
      {/* BG Color Row */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '1rem', fontWeight: 400, whiteSpace: 'nowrap', marginRight: 16, width: LABEL_WIDTH, minWidth: LABEL_WIDTH, display: 'inline-block' }}>BG Color</span>
        <ColorSwatch color="#DA9633" />
        <ColorBox value="#DA9633" />
        <OpacityBox value="100%" />
      </div>
    </div>
  );
};

const CanvasSidebar: React.FC<CanvasSidebarProps> = ({ width, height, rotation, mainColor, onChangeWidth, onChangeHeight, onChangeRotation, onMirrorVertical, onMirrorHorizontal, onChangeMainColor, onExport, opacity, blendMode, onChangeOpacity, onChangeBlendMode, mockup, onSelectVariant }) => {
  return (
    <aside
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        bottom: 24,
        height: 'auto',
        width: 320,
        background: 'var(--surface-primary)',
        borderRadius: 12,
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      {/* Export Button with 12px horizontal padding */}
      <div style={{ padding: '0 12px' }}>
        <ExportButton onExport={onExport ?? (() => {})} />
      </div>
      {/* Separation line */}
      <div style={{ height: 0.5, background: 'var(--border-secondary)', width: '100%', margin: '0 0' }} />
      {/* Transform Controls */}
      <TransformControls width={width} height={height} rotation={rotation} onChangeWidth={onChangeWidth} onChangeHeight={onChangeHeight} onChangeRotation={onChangeRotation} onMirrorVertical={onMirrorVertical} onMirrorHorizontal={onMirrorHorizontal} />
      {/* Separation line */}
      <div style={{ height: 0.5, background: 'var(--border-secondary)', width: '100%', margin: '0 0' }} />
      {/* Color Controls */}
      <ColorControls mainColor={mainColor} onChangeMainColor={onChangeMainColor} />
      {/* Separation line */}
      <div style={{ height: 0.5, background: 'var(--border-secondary)', width: '100%', margin: '0 0' }} />
      {/* Blend Controls */}
      <BlendControls opacity={opacity} blendMode={blendMode} onChangeOpacity={onChangeOpacity} onChangeBlendMode={onChangeBlendMode} />
      {/* Separation line */}
      <div style={{ height: 0.5, background: 'var(--border-secondary)', width: '100%', margin: '0 0 0 0' }} />
      {/* Separation line and Variant Button only if mockup has variants */}
      {mockup && Array.isArray(mockup.variants) && mockup.variants.length > 1 && (
        <>
          <div style={{ padding: '0 12px', marginTop: 0 }}>
            <VariantButton variants={mockup.variants} onSelect={onSelectVariant} />
          </div>
          <div style={{ height: 0.5, background: 'var(--border-secondary)', width: '100%', margin: '0 0' }} />
        </>
      )}
      {/* Placeholder for controls */}
      <div style={{ flex: 1 }} />
    </aside>
  );
};

export default CanvasSidebar; 