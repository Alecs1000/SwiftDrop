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
import SupabaseMockupGallery from '../../components/SupabaseMockupGallery';

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
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      <div className="ml-64" style={{ paddingTop: '24px', paddingLeft: '32px' }}>
        <h5 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Library
        </h5>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: '24px' }}>
          {/* Filter Buttons Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
            {filterCategories.map(cat => (
              <FilterButton
                key={cat.key}
                active={cat.key === selectedCategory}
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.label}
              </FilterButton>
            ))}
          </div>
          {/* Cards Grid */}
          <div style={{ marginLeft: '32px', paddingRight: '24px', flex: 1 }}>
            <SupabaseMockupGallery category={selectedCategory} search={search} />
          </div>
        </div>
      </div>
    </div>
  );
} 