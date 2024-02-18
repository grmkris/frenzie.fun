import { UserProfileSchema } from "@/schemas/ceramic.schema";
import { ENABLED_CHAINS, EnabledChain } from "@/wagmiConfig";
import { ComposeClient } from "@composedb/client";
import { Address } from "viem";
import { fromZodError } from "zod-validation-error";

export const getProfileQuery = (props: {
  address: Address;
  chain?: EnabledChain["id"];
}) => {
  return `
      {
    node(id: "did:pkh:eip155:${props.chain}:${props.address.toLowerCase()}") {
        id
    ... on CeramicAccount {
        basicProfile {
            name
            description
            emoji
            urls {
                 url
                 description
            }
        }
    }
}
    }
      `;
};

export const getProfile = async (props: {
  compose: ComposeClient;
  address: Address;
  chain?: EnabledChain["id"];
}) => {
  // first try to get the profile from the chain if provided
  if (props.chain) {
    const profile = await props.compose.executeQuery(getProfileQuery(props));
    console.log("profile", profile);
    if (profile.data?.node) {
      const parsed = UserProfileSchema.safeParse(
          // @ts-ignore
        profile.data?.node?.basicProfile,
      );
      if (!parsed.success) {
        console.error("Failed to parse profile", fromZodError(parsed.error));
        throw new Error(fromZodError(parsed.error).toString());
      }
      console.log("parsed", parsed);
      return parsed.data;
    }
  }

  // if not found, try to get the profile from the other chains
  for (let i = 0; i < ENABLED_CHAINS.length; i++) {
    const x = ENABLED_CHAINS[i];
    const profile = await props.compose.executeQuery(
      getProfileQuery({ ...props, chain: x.id }),
    );
    const parsed = UserProfileSchema.safeParse(
        // @ts-ignore
      profile.data?.node?.basicProfile,
    );
    if (!parsed.success) {
      console.error("Failed to parse profile", fromZodError(parsed.error));
      continue;
    }
    console.log("parsed", parsed);
    return parsed.data;
  }
};
