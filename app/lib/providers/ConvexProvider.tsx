import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://default-deployment.convex.cloud';
const convexClient = new ConvexReactClient(convexUrl);

export function ConvexProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convexClient}>
      {children}
    </ConvexProvider>
  );
} 