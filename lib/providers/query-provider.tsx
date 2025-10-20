"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: 5 minutes (data considered fresh for 5 min)
            staleTime: 5 * 60 * 1000,
            // Cache time: 10 minutes (keep unused data in cache for 10 min)
            gcTime: 10 * 60 * 1000,
            // Retry failed requests
            retry: 1,
            // Refetch on window focus (useful for horoscopes)
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
