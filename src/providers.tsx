"use client";

import React, { ReactNode } from "react";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/wagmiConfig";
import { CeramicWrapper } from "@/ceramicContext";
import {env} from "../env.mjs";

// Setup queryClient
const queryClient = new QueryClient();

// Create modal
createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "",
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function ContextProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <CeramicWrapper>{children}</CeramicWrapper>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
