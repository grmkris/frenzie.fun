"use client";
import { useQuery } from "@tanstack/react-query";
import { useCeramicContext } from "@/ceramicContext";
import { Address } from "viem";
import { EnabledChain } from "@/wagmiConfig";
import { getProfile } from "@/lib/ceramic/get-profile-query";

export const useCeramicProfile = (props: {
  address?: Address;
  chain?: EnabledChain["id"];
}) => {
  const { composeClient } = useCeramicContext();
  return useQuery({
    queryKey: ["profile", props],
    enabled: !!props.address,
    queryFn: async () => {
      if (!composeClient) throw new Error("No client");
      if (!props.address) throw new Error("No address");
      return await getProfile({
        compose: composeClient,
        address: props.address,
        chain: props.chain,
      });
    },
  });
};
