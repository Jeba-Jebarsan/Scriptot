import { ConvexProvider, ConvexReactClient } from "convex/react";
import { getConvexUrl } from "../config/environment";

const convexUrl = getConvexUrl();
const convexClient = new ConvexReactClient(convexUrl);

export function ConvexProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convexClient}>
      {children}
    </ConvexProvider>
  );
} 