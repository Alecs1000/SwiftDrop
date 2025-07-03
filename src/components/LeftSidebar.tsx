import React, { useState, useEffect } from 'react';
import { GridIcon, PlusIcon, ArrowIcon, ListIcon } from './icons/ListIcons';
import { NavigationIconLibrary } from './icons/NavigationIcons';
import { SearchBar } from './SearchBar';
import { useRouter } from 'next/navigation';

const iconStyle = { width: 20, height: 20, display: 'inline-block', verticalAlign: 'middle' };
const sectionLine = <div style={{ height: 1, background: 'var(--border-secondary)', width: '100%', margin: '12px 0 0 0' }} />;

interface LeftSidebarProps {
  onLogoSelect?: (logoUrl: string) => void;
  placedLogos?: string[];
  onRemoveLogo?: (logoUrl: string) => void;
  projectTitle?: string;
  onProjectTitleChange?: (title: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onLogoSelect, placedLogos = [], onRemoveLogo, projectTitle = 'Untitled project', onProjectTitleChange }) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState<'levels' | 'assets'>('levels');
  const [logos, setLogos] = useState<string[]>([]);
  const [assetView, setAssetView] = useState<'grid' | 'list'>('grid');
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(projectTitle);

  useEffect(() => {
    if (activeTab === 'assets') {
      fetch('/api/list-logos')
        .then(res => res.json())
        .then(data => setLogos(data.logos || []));
    }
  }, [activeTab]);

  useEffect(() => { setTitleValue(projectTitle); }, [projectTitle]);

  const filteredLogos = logos.filter(filename => filename.toLowerCase().includes(searchValue.toLowerCase()));

  function handlePlusClick() {
    if (activeTab === 'levels') {
      setActiveTab('assets');
    } else if (activeTab === 'assets') {
      if (fileInputRef.current) fileInputRef.current.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: Implement upload logic here (e.g., POST to /api/upload-logo)
    // After upload, refresh logos list
    // For now, just clear the input
    e.target.value = '';
  }

  return (
    <aside
      style={{
        position: 'fixed',
        left: 24,
        top: 24,
        bottom: 24,
        width: 320,
        background: 'var(--surface-primary)',
        borderRadius: 20,
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        gap: 0,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '24px 24px 0 24px', gap: 12 }}>
        {/* Back Arrow */}
        <span
          style={{ cursor: 'pointer', fontSize: 22, marginRight: 8, display: 'inline-block', transform: 'scaleX(-1)' }}
          onClick={() => router.push('/library')}
        >
          <ArrowIcon style={{ width: 16, height: 16, display: 'block' }} />
        </span>
        {onProjectTitleChange ? (
          editingTitle ? (
            <input
              type="text"
              value={titleValue}
              autoFocus
              maxLength={48}
              onChange={e => setTitleValue(e.target.value)}
              onBlur={() => {
                setEditingTitle(false);
                if (titleValue.trim() && titleValue !== projectTitle) {
                  onProjectTitleChange(titleValue.trim());
                } else {
                  setTitleValue(projectTitle);
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                } else if (e.key === 'Escape') {
                  setEditingTitle(false);
                  setTitleValue(projectTitle);
                }
              }}
              style={{
                fontWeight: 500,
                fontSize: '1.1rem',
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                padding: 0,
                margin: 0,
                minWidth: 0,
              }}
            />
          ) : (
            <span
              style={{ fontWeight: 500, fontSize: '1.1rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
              title={projectTitle}
              onClick={() => setEditingTitle(true)}
            >
              {projectTitle.length > 24 ? projectTitle.slice(0, 22) + '…' : projectTitle}
            </span>
          )
        ) : (
          <span style={{ fontWeight: 500, fontSize: '1.1rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {projectTitle.length > 24 ? projectTitle.slice(0, 22) + '…' : projectTitle}
          </span>
        )}
      </div>
      {sectionLine}
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '16px 24px 0 24px' }}>
        <button
          style={{
            flex: 1,
            background: activeTab === 'levels' ? 'var(--button-secondary)' : 'none',
            border: activeTab === 'levels' ? '0.5px solid var(--border-primary)' : 'none',
            borderRadius: 12,
            padding: '10px 0',
            fontWeight: 500,
            fontSize: 16,
            cursor: 'pointer',
            width: '100%',
            boxSizing: 'border-box',
            color: activeTab === 'levels' ? 'var(--text-primary)' : 'var(--text-secondary)',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { if (activeTab !== 'levels') e.currentTarget.style.background = 'var(--button-secondary-hover)'; }}
          onMouseLeave={e => { if (activeTab !== 'levels') e.currentTarget.style.background = 'none'; }}
          onClick={() => setActiveTab('levels')}
        >
          Levels
        </button>
        <button
          style={{
            flex: 1,
            background: activeTab === 'assets' ? 'var(--button-secondary)' : 'none',
            border: activeTab === 'assets' ? '0.5px solid var(--border-primary)' : 'none',
            borderRadius: 12,
            padding: '10px 0',
            fontWeight: 500,
            fontSize: 16,
            color: activeTab === 'assets' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            width: '100%',
            boxSizing: 'border-box',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { if (activeTab !== 'assets') e.currentTarget.style.background = 'var(--button-secondary-hover)'; }}
          onMouseLeave={e => { if (activeTab !== 'assets') e.currentTarget.style.background = 'none'; }}
          onClick={() => setActiveTab('assets')}
        >
          Assets
        </button>
      </div>
      {sectionLine}
      {/* Scene or Assets Section */}
      {activeTab === 'levels' ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px 0 24px', fontWeight: 400, fontSize: '1rem' }}>
            <span style={{ flex: 1 }}>Scene</span>
            <span style={{ ...iconStyle, marginRight: 8 }}><GridIcon style={{ width: 16, height: 16 }} /></span>
            <span style={{ ...iconStyle, cursor: 'pointer' }} onClick={handlePlusClick}><PlusIcon style={{ width: 16, height: 16 }} /></span>
          </div>
          {sectionLine}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px 0 24px', fontWeight: 400, fontSize: '1rem' }}>
            <span style={{ flex: 1 }}>Assets</span>
            {assetView === 'grid' ? (
              <span style={{ ...iconStyle, marginRight: 8, cursor: 'pointer' }} onClick={() => setAssetView('list')}><ListIcon style={{ width: 16, height: 16 }} /></span>
            ) : (
              <span style={{ ...iconStyle, marginRight: 8, cursor: 'pointer' }} onClick={() => setAssetView('grid')}><GridIcon style={{ width: 16, height: 16 }} /></span>
            )}
            <span style={{ ...iconStyle, cursor: 'pointer' }} onClick={handlePlusClick}><PlusIcon style={{ width: 16, height: 16 }} /></span>
          </div>
          {sectionLine}
        </>
      )}
      {/* Search Bar */}
      <div style={{ padding: '16px 12px 0 12px' }}>
        <SearchBar value={searchValue} onChange={e => setSearchValue(e.target.value)} style={{ width: '100%' }} />
      </div>
      {/* Scene Items or Logo Assets */}
      {activeTab === 'levels' ? (
        <div style={{ padding: '16px 24px 0 24px', flex: 1, overflowY: 'auto' }}>
          {placedLogos.length === 0 ? (
            <span style={{ color: '#68686a', fontSize: 15 }}>No logos placed yet.</span>
          ) : (
            placedLogos.map(filename => (
              <div
                key={filename}
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, position: 'relative' }}
                onMouseEnter={e => {
                  const xBtn = e.currentTarget.querySelector('.remove-x');
                  if (xBtn) xBtn.setAttribute('style', 'display:block;position:absolute;right:0;top:50%;transform:translateY(-50%);background:none;border:none;color:#bfbfc0;font-size:16px;cursor:pointer;padding:0 4px;');
                }}
                onMouseLeave={e => {
                  const xBtn = e.currentTarget.querySelector('.remove-x');
                  if (xBtn) xBtn.setAttribute('style', 'display:none');
                }}
              >
                <div style={{ width: 24, height: 24, borderRadius: 6, background: '#F6F6F6', overflow: 'hidden' }}>
                  <img src={filename} alt={filename} style={{ width: 24, height: 24, objectFit: 'contain', borderRadius: 6 }} />
                </div>
                <span style={{ fontSize: 16, color: '#68686a', wordBreak: 'break-all' }}>{filename.split('/').pop()}</span>
                <button
                  className="remove-x"
                  style={{ display: 'none' }}
                  onClick={e => { e.stopPropagation(); onRemoveLogo && onRemoveLogo(filename); }}
                  aria-label="Remove logo"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        assetView === 'grid' ? (
          <div style={{ padding: '16px 24px 0 24px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {filteredLogos.length === 0 ? (
                <span style={{ color: '#68686a', fontSize: 15, gridColumn: '1 / -1' }}>No logos uploaded.</span>
              ) : (
                filteredLogos.map(filename => (
                  <div key={filename} style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 64, cursor: 'pointer' }} onClick={() => onLogoSelect && onLogoSelect(`/logos/${filename}`)}>
                    <img src={`/logos/${filename}`} alt={filename} style={{ maxWidth: 40, maxHeight: 40, objectFit: 'contain' }} />
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px 24px 0 24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredLogos.length === 0 ? (
              <span style={{ color: '#68686a', fontSize: 15 }}>No logos uploaded.</span>
            ) : (
              filteredLogos.map(filename => (
                <div key={filename} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => onLogoSelect && onLogoSelect(`/logos/${filename}`)}>
                  <img src={`/logos/${filename}`} alt={filename} style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6, background: '#fff', border: '1px solid var(--border-secondary)' }} />
                  <span style={{ fontSize: 15, color: '#68686a', wordBreak: 'break-all' }}>{filename}</span>
                </div>
              ))
            )}
          </div>
        )
      )}
      {/* Footer */}
      <div style={{ marginTop: 'auto', padding: '24px', borderTop: '1px solid var(--border-secondary)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <NavigationIconLibrary style={{ width: 20, height: 20 }} />
          <span style={{ fontSize: 16, color: '#68686a' }}>Library</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          {/* Use a question mark or a Help icon from NavigationIcons if available */}
          <span style={{ fontSize: 20, color: '#68686a', fontWeight: 700 }}>?</span>
          <span style={{ fontSize: 16, color: '#68686a' }}>Help & Feedback</span>
        </div>
      </div>
      {/* Hidden file input for logo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*, .svg"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </aside>
  );
};

export default LeftSidebar; 