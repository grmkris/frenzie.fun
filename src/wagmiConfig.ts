import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { sepolia, scrollSepolia } from "wagmi/chains";
import { mainnet } from "viem/chains";
import {env} from "../env.mjs";

export const ENABLED_CHAINS = [sepolia, scrollSepolia, mainnet] as const;

export type EnabledChain = (typeof ENABLED_CHAINS)[number];

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
export const wagmiConfig = defaultWagmiConfig({
  chains: ENABLED_CHAINS, // required
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "", // required
  metadata, // required
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
});
