export const DEFAULT_CONVEX_URL = 'https://judicious-pelican-858.convex.cloud';

export function getConvexUrl(): string {
  const url = process.env.VITE_CONVEX_URL || import.meta.env.VITE_CONVEX_URL || DEFAULT_CONVEX_URL;
  
  if (!url.startsWith('https://')) {
    throw new Error('Invalid CONVEX_URL: Must start with https://');
  }
  
  return url;
} 