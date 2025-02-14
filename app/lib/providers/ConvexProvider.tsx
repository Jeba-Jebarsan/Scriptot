import { ConvexProvider, ConvexReactClient } from "convex/react";

const DEFAULT_CONVEX_URL = 'https://relaxed-elk-576.convex.cloud';
const convexUrl = import.meta.env.VITE_CONVEX_URL || DEFAULT_CONVEX_URL;

if (!convexUrl.startsWith('https://') && !convexUrl.startsWith('http://')) {
  throw new Error('Invalid CONVEX_URL: Must start with https:// or http://');
}

const convexClient = new ConvexReactClient(convexUrl);

export function ConvexProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convexClient}>
      {children}
    </ConvexProvider>
  );
} 