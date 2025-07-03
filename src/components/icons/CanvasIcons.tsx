import React from 'react';

// NOTE: Color styling will only work if the SVG uses currentColor for its fill/stroke
export const AngleIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src="/icons/canvas icons/angle.svg" alt="Angle" style={{ color: 'var(--icon-secondary)', ...props.style }} {...props} />
);
export const RotationIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src="/icons/canvas icons/rotation.svg" alt="Rotation" style={{ color: 'var(--icon-secondary)', ...props.style }} {...props} />
);
export const VerticalMirrorIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src="/icons/canvas icons/vertical mirror.svg" alt="Vertical Mirror" style={{ color: 'var(--icon-secondary)', ...props.style }} {...props} />
);
export const HorizontalMirrorIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src="/icons/canvas icons/horizontal mirror.svg" alt="Horizontal Mirror" style={{ color: 'var(--icon-secondary)', ...props.style }} {...props} />
); 