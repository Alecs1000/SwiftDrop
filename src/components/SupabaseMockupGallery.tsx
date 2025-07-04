import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { MockupCard } from './MockupCard';

export default function SupabaseMockupGallery() {
  const [mockups, setMockups] = useState<any[]>([]);

  useEffect(() => {
    const fetchMockups = async () => {
      const { data, error } = await supabase.from('mockups').select('*');
      if (data) setMockups(data);
    };
    fetchMockups();
  }, []);

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
      {mockups.map((mockup) => {
        const { data: urlData } = supabase.storage.from('mockups').getPublicUrl(mockup.image_path);
        return (
          <MockupCard
            key={mockup.id}
            id={mockup.id}
            image={urlData.publicUrl}
            title={mockup.name}
          />
        );
      })}
    </div>
  );
} 