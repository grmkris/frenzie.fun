"use client";
import { Web3Modal } from "@/app/_components/web3modal";
import React from "react";
import { UserProfileForm } from "./_components/UserProfileForm";
import { useCeramicProfile } from "@/lib/ceramic/useCeramicProfile";
import { useAccount } from "wagmi";
import { EnabledChain } from "@/wagmiConfig";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
  const account = useAccount();
  const profile = useCeramicProfile({
    chain: account.chain?.id as EnabledChain["id"],
    address: account.address,
  });

  if (!account.chain) {
    return (
      <div className="flex flex-col space-y-3">
        <p className="text-center">Please connect your wallet to continue</p>
        <Web3Modal />
      </div>
    );
  }

  if (profile.isLoading || !profile.data) {
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>;
  }

  return (
    <div className="flex flex-col">
      <div className={"flex justify-center"}>
        <Web3Modal />
      </div>
      <UserProfileForm data={profile.data} />
    </div>
  );
}

export default App;
