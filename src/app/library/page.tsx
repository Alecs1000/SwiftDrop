'use client';
import React, { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { FilterButton } from "../../components/FilterButton";
import { SearchBar } from "../../components/SearchBar";
import { mockups } from "../../lib/mockups";
import { MockupCard } from "../../components/MockupCard";
import SeeAllButton from "../../components/SeeAllButton";
import { useRouter } from "next/navigation";
import { saveProject } from "../../lib/projectStorage";
import { CanvasProject } from "../../lib/project";

const filterCategories = [
  { key: 'all', label: 'All' },
  { key: 'chef', label: 'Chef' },
  { key: 'polos', label: 'Polos' },
  { key: 'apron', label: 'Apron' },
  { key: 'medical', label: 'Medical' },
  { key: 'accessories', label: 'Accessories' },
];

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  // fallback
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default function LibraryPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  function handleMockupClick(mockupId: string) {
    const id = generateUUID();
    const mockup = require('../../lib/mockups').mockups.find((m: any) => m.id === mockupId);
    const project: CanvasProject = {
      id,
      title: mockup?.title || 'Untitled Project',
      mockupId,
      placedLogos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProject(project);
    router.push(`/canvas?projectId=${id}`);
  }

  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--background)', position: 'relative' }}>
      <Sidebar />
      {/* SearchBar top right */}
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <SearchBar value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div
        className="ml-64"
        style={{
          paddingTop: '24px',
          paddingLeft: '32px',
        }}
      >
        <h5
          className="text-xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Library
        </h5>
        {/* Filter Buttons and Cards Row */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: '0px' }}>
          {/* Filter Buttons */}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
            {filterCategories.map(cat => (
              <FilterButton
                key={cat.key}
                active={false}
                onClick={() => router.push(cat.key === 'all' ? '/library' : `/library/${cat.key}`)}
              >
                {cat.label}
              </FilterButton>
            ))}
          </div>
          {/* Cards Grid and h6 */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '24px',
                marginLeft: '32px',
                paddingRight: '64px',
                paddingTop: '24px',
                width: '100%',
                alignItems: 'start',
              }}
            >
              {mockups.slice(-5).map((mockup) => (
                <MockupCard key={mockup.id} id={mockup.id} image={mockup.image} title={mockup.title} onClick={handleMockupClick} />
              ))}
            </div>
            {/* Sectioned collections for each filter after 'All' */}
            {filterCategories.slice(1).map((cat, idx) => (
              <div key={cat.key} style={{ paddingTop: idx === 0 ? 0 : '0px' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginLeft: '32px',
                  paddingTop: '32px',
                  paddingRight: '24px',
                }}>
                  <h6
                    className="text-base font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {cat.label}
                  </h6>
                  <SeeAllButton onClick={() => router.push(`/library/${cat.key}`)} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '24px',
                    marginLeft: '32px',
                    paddingRight: '24px',
                    width: '100%',
                    alignItems: 'start',
                    marginTop: '24px',
                  }}
                >
                  {mockups.filter(m => m.category === cat.key).slice(0, 5).map((mockup) => (
                    <MockupCard key={mockup.id} id={mockup.id} image={mockup.image} title={mockup.title} onClick={handleMockupClick} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Future library content goes here */}
    </div>
  );
} 