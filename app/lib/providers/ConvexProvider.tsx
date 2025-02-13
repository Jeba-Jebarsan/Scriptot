import { ConvexProvider, ConvexReactClient } from "convex/react";

if (!import.meta.env.VITE_CONVEX_URL) {
  throw new Error('VITE_CONVEX_URL is required');
}

const convexClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export function ConvexProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convexClient}>
      {children}
    </ConvexProvider>
  );
} 