import React from 'react';

// Helper to import SVG as React component
function SvgIcon({ src, alt, ...props }: { src: string; alt?: string; [key: string]: any }) {
  return <img src={src} alt={alt} {...props} />;
}

// Navigation Icons (matching actual filenames)
export const NavigationIconHome = (props: React.ComponentProps<'img'>) => (
  <img src="/icons/navigation icons /home.svg" alt="Home" {...props} />
);
export const NavigationIconLibrary = (props: React.ComponentProps<'img'>) => (
  <img src="/icons/navigation icons /library.svg" alt="Library" {...props} />
);
export const NavigationIconCanvas = (props: React.ComponentProps<'img'>) => (
  <img src="/icons/navigation icons /canvas.svg" alt="Canvas" {...props} />
);
export const NavigationIconArchive = (props: React.ComponentProps<'img'>) => (
  <img src="/icons/navigation icons /archive.svg" alt="Archive" {...props} />
);
export const NavigationIconFeed = (props: React.ComponentProps<'img'>) => (
  <img src="/icons/navigation icons /feed.svg" alt="Feed" {...props} />
);
export const NavigationIconFiles = (props: React.ComponentProps<'img'>) => (
  <img src="/icons/navigation icons /files.svg" alt="Files" {...props} />
); 