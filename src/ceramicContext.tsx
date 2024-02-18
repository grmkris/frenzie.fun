"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
  createAuthenticatedComposeClient,
  createComposeClient,
} from "@/lib/ceramic/ceramic";
import { ComposeClient } from "@composedb/client";

// Assuming you have these types defined somewhere
import { Provider } from "@ethersproject/abstract-provider";
import { useAccount } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

interface ICeramicContext {
  composeClient?: ComposeClient;
  // tanstack mutation
  authenticate?: ReturnType<
    typeof useMutation<ComposeClient, unknown, void, unknown>
  >;
  isAuthenticated: boolean;
  canAuthenticate: boolean;
}

const CeramicContext = createContext<ICeramicContext>({
  composeClient: undefined,
  authenticate: undefined,
  isAuthenticated: false,
  canAuthenticate: false,
});

interface CeramicWrapperProps {
  children: ReactNode;
}

export const CeramicWrapper: React.FC<CeramicWrapperProps> = ({ children }) => {
  const account = useAccount();
  const [composeClient, setComposeClient] = React.useState<ComposeClient>(
    createComposeClient(),
  );

  const authenticate = useMutation({
    mutationFn: async () => {
      console.log("authenticating");
      const ethprovider = (await account?.connector?.getProvider()) as Provider;
      const address = account?.address;
      if (!ethprovider || !address) throw new Error("No provider or address");
      console.log("authenticating", ethprovider, address);
      const compose = await createAuthenticatedComposeClient({
        compose: composeClient,
        ethprovider: ethprovider,
        address: address,
      });
      console.log("authenticated");
      setComposeClient(compose);
      return compose;
    },
  });

  const canAuthenticate = !!account?.address;

  const isAuthenticated = !!composeClient?.did;
  return (
    <CeramicContext.Provider
      value={{
        composeClient: composeClient,
        authenticate,
        canAuthenticate,
        isAuthenticated,
      }}
    >
      {children}
    </CeramicContext.Provider>
  );
};

export const useCeramicContext = () => useContext(CeramicContext);
