declare module 'use-image' {
  const useImage: (url: string, crossOrigin?: string) => [HTMLImageElement | undefined, 'loading' | 'loaded' | 'failed'];
  export default useImage;
} 