"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

interface Props {
  children: React.ReactNode;
}

const AppProviders = ({ children }: Props) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <SidebarProvider>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </SidebarProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
};

export { AppProviders };
