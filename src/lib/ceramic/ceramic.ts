import { DIDSession } from "did-session";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";

import { ComposeClient } from "@composedb/client";
import { RuntimeCompositeDefinition } from "@composedb/types";
import { definition } from "@/__generated__/definition";
import { Provider } from "@ethersproject/abstract-provider";
import { Address } from "viem";
import { UserProfileSchema } from "@/schemas/ceramic.schema";

export const createComposeClient = () => {
  return new ComposeClient({
    ceramic: "http://localhost:7007",
    definition: definition as RuntimeCompositeDefinition,
  });
};

export const createAuthenticatedComposeClient = async (props: {
  compose: ComposeClient;
  ethprovider: Provider;
  address: Address;
}) => {
  const accountId = await getAccountId(props.ethprovider, props.address);
  const authMethod = await EthereumWebAuth.getAuthMethod(
    props.ethprovider,
    accountId,
  );

  const session = await DIDSession.get(accountId, authMethod, {
    resources: props.compose.resources,
  });
  props.compose.setDID(session.did);
  return props.compose;
};
