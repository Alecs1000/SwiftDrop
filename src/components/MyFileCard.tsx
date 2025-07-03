import React, { useState, useRef, useEffect } from 'react';

interface MyFileCardProps {
  image: string;
  title: string;
  lastEdited: string;
  view?: 'grid' | 'list';
  id?: string;
  onOpen?: (id: string) => void;
  onRename?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const MyFileCard: React.FC<MyFileCardProps> = ({ image, title, lastEdited, view = 'grid', id, onOpen, onRename, onDuplicate, onDelete }) => {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  if (view === 'list') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          minHeight: 96,
          borderRadius: 16,
          background: hover ? 'var(--surface-secondary)' : 'var(--surface-primary)',
          transition: 'background 0.15s',
          padding: '8px 16px',
          position: 'relative',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => { setHover(false); setMenuOpen(false); }}
      >
        <div
          style={{
            width: 48,
            minWidth: 48,
            aspectRatio: '4 / 5',
            background: 'var(--surface-secondary)',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 20,
          }}
        >
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
              display: 'block',
            }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'left', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lastEdited}</div>
        </div>
        <div style={{ position: 'relative', marginLeft: 20 }} ref={menuRef}>
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              transition: 'background 0.15s',
            }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Show actions"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="4" r="1.5" fill="var(--icon-secondary)" />
              <circle cx="10" cy="10" r="1.5" fill="var(--icon-secondary)" />
              <circle cx="10" cy="16" r="1.5" fill="var(--icon-secondary)" />
            </svg>
          </button>
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 36,
                right: 0,
                minWidth: 140,
                background: 'var(--surface-primary)',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                zIndex: 100,
                padding: '8px 0',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{ padding: '8px 32px', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 8, transition: 'background 0.12s, color 0.12s' }}
                onMouseDown={e => e.preventDefault()}
                onClick={() => { setMenuOpen(false); if (onOpen && id) onOpen(id); }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-brand)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >Open</div>
              <div
                style={{ padding: '8px 32px', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 8, transition: 'background 0.12s, color 0.12s' }}
                onMouseDown={e => e.preventDefault()}
                onClick={() => { setMenuOpen(false); if (onRename && id) onRename(id); }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-brand)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >Rename</div>
              <div
                style={{ padding: '8px 32px', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 8, transition: 'background 0.12s, color 0.12s' }}
                onMouseDown={e => e.preventDefault()}
                onClick={() => { setMenuOpen(false); if (onDuplicate && id) onDuplicate(id); }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-brand)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >Duplicate</div>
              <div
                style={{ padding: '8px 32px', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 8, transition: 'background 0.12s, color 0.12s' }}
                onMouseDown={e => e.preventDefault()}
                onClick={() => { setMenuOpen(false); if (onDelete && id) onDelete(id); }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-brand)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >Move to archive</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // grid view (default)
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', cursor: onOpen && id ? 'pointer' : undefined }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setMenuOpen(false); }}
      onClick={e => {
        // Prevent open if menu is open or click is on menu button
        if (menuOpen) return;
        // If click is inside the menu button or menu, don't open
        if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
        if (onOpen && id) onOpen(id);
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '4 / 5',
          background: 'var(--surface-secondary)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: hover ? '1px solid var(--border-brand)' : '1px solid transparent',
          transition: 'border 0.15s',
          cursor: onOpen && id ? 'pointer' : undefined,
        }}
        onClick={e => {
          // Prevent open if menu is open or click is on menu button
          e.stopPropagation();
          if (menuOpen) return;
          if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
          if (onOpen && id) onOpen(id);
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
            display: 'block',
            pointerEvents: 'none', // so the parent div handles the click
          }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingTop: 12, paddingLeft: 4, paddingRight: 4 }}>
        <div style={{ fontSize: '1rem', color: 'var(--text-primary)', textAlign: 'left', flex: 1, fontWeight: 500 }}>
          {title}
        </div>
        {hover && (
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              style={{
                background: 'none',
                border: 'none',
                padding: 4,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                transition: 'background 0.15s',
              }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Show actions"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="4" cy="10" r="1.5" fill="var(--icon-secondary)" />
                <circle cx="10" cy="10" r="1.5" fill="var(--icon-secondary)" />
                <circle cx="16" cy="10" r="1.5" fill="var(--icon-secondary)" />
              </svg>
            </button>
            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 28,
                  right: 0,
                  minWidth: 140,
                  background: 'var(--surface-primary)',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  zIndex: 100,
                  padding: '8px 0',
                }}
              >
                <div
                  style={{ padding: '8px 32px', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 8, transition: 'background 0.12s, color 0.12s' }}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setMenuOpen(false); if (onOpen && id) onOpen(id); }}
                  onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-brand)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >Open</div>
                <div
                  style={{ padding: '8px 32px', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 8, transition: 'background 0.12s, color 0.12s' }}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setMenuOpen(false); if (onRename && id) onRename(id); }}
                  onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-brand)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >Rename</div>
                <div
                  style={{ padding: '8px 32px', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 8, transition: 'background 0.12s, color 0.12s' }}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setMenuOpen(false); if (onDuplicate && id) onDuplicate(id); }}
                  onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-brand)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >Duplicate</div>
                <div
                  style={{ padding: '8px 32px', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 8, transition: 'background 0.12s, color 0.12s' }}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setMenuOpen(false); if (onDelete && id) onDelete(id); }}
                  onMouseOver={e => { e.currentTarget.style.background = 'var(--surface-brand)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >Move to archive</div>
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'left', width: '100%', paddingLeft: 4, paddingRight: 4, marginTop: 2 }}>
        {lastEdited}
      </div>
    </div>
  );
}; 