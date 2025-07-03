'use client';
import React from "react";
import { useRouter } from "next/navigation";

interface MockupCardProps {
  id: string;
  image: string;
  title: string;
  onClick?: (id: string) => void;
}

export const MockupCard: React.FC<MockupCardProps> = ({ id, image, title, onClick }) => {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div
        onClick={() => onClick ? onClick(id) : router.push(`/canvas?id=${id}`)}
        style={{
          width: '100%',
          aspectRatio: '4 / 5',
          background: 'var(--surface-secondary)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
      <div style={{ paddingTop: 12, fontSize: '1rem', color: 'var(--text-primary)', textAlign: 'left', width: '100%', paddingLeft: 4, paddingRight: 4 }}>
        {title}
      </div>
    </div>
  );
}; 