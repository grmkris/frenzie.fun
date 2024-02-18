"use client";

import { useCeramicProfile } from "@/lib/ceramic/useCeramicProfile";
import { Address } from "viem";
import { Button } from "@/components/ui/button";
import {useEnsAddress, useEnsAvatar, useEnsName} from "wagmi";
import { mainnet } from "viem/chains";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { UserProfileSchema } from "@/schemas/ceramic.schema";
import { Separator } from "@/components/ui/separator";
import { isAddress } from 'viem'

export default function ProfilePage({
  params,
}: { params: { address: Address } }) {

  // check if param is valid address
  const isValidAddress = isAddress(params.address);

  const ensAddress = useEnsAddress({
    name: params.address,
  })

  const profile = useCeramicProfile({
    address: isValidAddress ? params.address.toLowerCase() as Address: ensAddress.data?.toLowerCase() as Address,
  });

  if (!isValidAddress && !ensAddress.data) {
    return <div>Invalid address</div>;
  }

  return <UserProfileView address={isValidAddress ? params.address.toLowerCase() as Address : ensAddress.data?.toLowerCase() as Address} data={profile.data} />;
}

/**
 * Beautifully display the user profile
 * @param props
 * @constructor
 */
const UserProfileView = (props: {
  data?: UserProfileSchema;
  address: Address;
}) => {
  const ensName = useEnsName({
    address: props.address,
    chainId: mainnet.id,
  });

  const ensAvatar = useEnsAvatar({
    name: ensName.data ?? undefined,
    chainId: mainnet.id,
  });

  console.log("ensName",{
    ensName: ensName.data,
    ensAvatar: ensAvatar.data,
    address: props.address
  });

  return (
    <div className="space-y-4">
      <div className="text-left">
        <p className={"text-4xl font-bold"}>
          {props.data?.name} {props.data?.emoji}
        </p>
        <div>
          <p className={"text-gray-500 text-lg"}>{props.data?.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          {ensAvatar.data && (
            <Image
              alt={ensName.data ?? "User Avatar"}
              src={ensAvatar.data ?? "/images/default-avatar.png"}
              width={50}
              height={50}
              className="rounded-full"
            />
          )}
          {ensName.data && <Badge variant="outline">{ensName.data}</Badge>}
          <Badge variant="outline">
            {props.address.substring(0, 6)}...
            {props.address.substring(props.address.length - 4)}
          </Badge>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Separator />
        {props.data?.urls.map((url) => (
          <div key={url.url} className="flex flex-col space-y-1">
            <a href={url.url} target="_blank" rel="noreferrer">
              <Button
                variant={"outline"}
                className="py-2 px-4 rounded-full w-full hover:bg-gray-100"
              >
                <p>{url.description}</p>
              </Button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
