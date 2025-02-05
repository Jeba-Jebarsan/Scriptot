import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useEffect, useState } from "react";

export function ConvexProviderWrapper({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<ConvexReactClient | null>(null);

  useEffect(() => {
    const convexUrl = import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) {
      console.error("Missing VITE_CONVEX_URL environment variable");
      return;
    }
    const newClient = new ConvexReactClient(convexUrl);
    setClient(newClient);
  }, []);

  if (!client) return null;

  return (
    <ConvexProvider client={client}>
      {children}
    </ConvexProvider>
  );
} 