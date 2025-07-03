"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Sidebar } from "../../../components/Sidebar";
import { FilterButton } from "../../../components/FilterButton";
import { SearchBar } from "../../../components/SearchBar";
import { mockups } from "../../../lib/mockups";
import { MockupCard } from "../../../components/MockupCard";

const filterCategories = [
  { key: 'all', label: 'All' },
  { key: 'chef', label: 'Chef' },
  { key: 'polos', label: 'Polos' },
  { key: 'apron', label: 'Apron' },
  { key: 'medical', label: 'Medical' },
  { key: 'accessories', label: 'Accessories' },
];

export default function LibraryCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = params?.category as string;
  const [search, setSearch] = React.useState("");

  // If category is invalid, redirect to /library
  const validCategory = filterCategories.find(cat => cat.key === category);
  React.useEffect(() => {
    if (!validCategory) router.replace("/library");
  }, [category, validCategory, router]);

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
        {/* Main content row: filter sidebar and cards grid */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: '24px' }}>
          {/* Filter Buttons Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
            {filterCategories.map(cat => (
              <FilterButton
                key={cat.key}
                active={cat.key === category}
                onClick={() => router.push(cat.key === 'all' ? '/library' : `/library/${cat.key}`)}
              >
                {cat.label}
              </FilterButton>
            ))}
          </div>
          {/* Cards Grid */}
          <div style={{ marginLeft: '32px', paddingRight: '24px', flex: 1 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '32px',
                alignItems: 'start',
              }}
            >
              {mockups.filter(m => m.category === category).map((mockup) => (
                <MockupCard
                  key={mockup.id}
                  id={mockup.id}
                  image={mockup.image}
                  title={mockup.title}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 