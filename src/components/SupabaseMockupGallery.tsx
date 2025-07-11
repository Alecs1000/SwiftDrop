import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { MockupCard } from './MockupCard';
import { useRouter } from 'next/navigation';

interface SupabaseMockupGalleryProps {
  category?: string;
  search?: string;
}

export default function SupabaseMockupGallery({ category = 'all', search = '' }: SupabaseMockupGalleryProps) {
  const [mockups, setMockups] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMockups = async () => {
      const { data, error } = await supabase.from('mockups').select('*');
      if (data) setMockups(data);
      if (error) console.error('Supabase fetch error:', error);
      console.log('Fetched mockups:', data);
    };
    fetchMockups();
  }, []);

  const filtered = mockups.filter((mockup) => {
    const matchesCategory = category === 'all' || (mockup.category && mockup.category.toLowerCase() === category.toLowerCase());
    const matchesSearch = !search || (mockup.name && mockup.name.toLowerCase().includes(search.toLowerCase())) || (mockup.description && mockup.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  console.log('Filtered mockups:', filtered);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '24px',
      marginLeft: '32px',
      paddingRight: '64px',
      paddingTop: '24px',
      width: '100%',
      alignItems: 'start',
    }}>
      {filtered.map((mockup) => {
        const { data: urlData } = supabase.storage.from('mockups').getPublicUrl(mockup.image_path);
        return (
          <MockupCard
            key={mockup.id}
            id={mockup.id}
            image={urlData.publicUrl}
            title={mockup.name}
            onClick={() => router.push(`/canvas?id=${mockup.id}`)}
          />
        );
      })}
    </div>
  );
} 