export const DEFAULT_CONVEX_URL = 'https://judicious-pelican-858.convex.cloud';
export const DEFAULT_GITHUB_CLIENT_ID = 'Ov23liA3PwvOtkwYOKUy';

export function getGitHubClientId(): string {
  return process.env.VITE_GITHUB_CLIENT_ID || import.meta.env.VITE_GITHUB_CLIENT_ID || DEFAULT_GITHUB_CLIENT_ID;
}

export function getConvexUrl(): string {
  const url = process.env.VITE_CONVEX_URL || import.meta.env.VITE_CONVEX_URL || DEFAULT_CONVEX_URL;

  if (!url.startsWith('https://')) {
    throw new Error('Invalid CONVEX_URL: Must start with https://');
  }

  return url;
}
