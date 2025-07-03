import React from 'react';

interface ExploreCardProps {
  title: string;
  subtitle: string;
  image: string;
  alt?: string;
  size?: 'lg' | 'sm';
  link?: string;
}

export const ExploreCard: React.FC<ExploreCardProps> = ({ title, subtitle, image, alt, size = 'lg', link }) => {
  const isSmall = size === 'sm';
  const borderRadius = isSmall ? '24px' : '32px';

  const cardContent = (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        borderRadius,
        background: 'var(--surface-secondary)',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
        minHeight: isSmall ? '180px' : '320px',
        padding: isSmall ? '24px 24px' : '48px 56px',
        overflow: 'hidden',
        width: '100%',
        marginBottom: isSmall ? 0 : '32px',
        maxWidth: isSmall ? '340px' : undefined,
        cursor: link ? 'pointer' : undefined,
        transition: 'box-shadow 0.18s',
      }}
      tabIndex={link ? 0 : undefined}
      className={link ? 'explore-card-hover' : undefined}
    >
      {/* Absolutely Positioned Image Behind Text */}
      <img
        src={image}
        alt={alt || title}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          maxHeight: isSmall ? '140px' : '320px',
          objectFit: 'contain',
          background: 'transparent',
          pointerEvents: 'none',
        }}
      />
      {/* Text Section */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3
          style={{
            color: 'var(--text-primary)',
            fontSize: isSmall ? '1.5rem' : '2.75rem',
            fontWeight: 600,
            marginBottom: isSmall ? '8px' : '16px',
            lineHeight: 1.1,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: isSmall ? '1rem' : '1.5rem',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}
        >
          {subtitle}
        </p>
      </div>
      {/* Bottom Fade Overlay */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: isSmall ? '32px' : '60px',
          background: 'linear-gradient(180deg, rgba(249,249,250,0) 0%, var(--surface-primary) 100%)',
          borderRadius: isSmall ? '0 0 24px 24px' : '0 0 32px 32px',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      {/* Border Overlay with Ellipse Mask and Blur */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          border: '1px solid var(--border-invert)',
          background: 'none',
          opacity: .2,
          pointerEvents: 'none',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 100% 0%, #000 80%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 60% at 100% 0%, #000 80%, transparent 100%)',
          zIndex: 3,
        }}
      />
    </div>
  );

  return link ? (
    <a href={link} style={{ textDecoration: 'none', display: 'block' }} tabIndex={0}>
      {cardContent}
    </a>
  ) : cardContent;
};

// Add a hover effect for .explore-card-hover in your global CSS:
// .explore-card-hover:hover { box-shadow: 0 4px 24px 0 rgba(0,0,0,0.16); } 