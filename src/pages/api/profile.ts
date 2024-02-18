import { CeramicClient } from "@ceramicnetwork/http-client";
import { ComposeClient } from "@composedb/client";
import { RuntimeCompositeDefinition } from "@composedb/types";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import { NextApiRequest, NextApiResponse } from "next";

import { env } from "../../../env.mjs";

import { definition } from "@/__generated__/definition";
import { fromHexString } from "@/lib/fromHexString";

const uniqueKey = process.env.AUTHOR_KEY;

export default async function createProfile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { message, uid, account, domain, types, signature } = req.body;
  console.log(env.AUTHOR_KEY);
  //instantiate a ceramic client instance
  const ceramic = new CeramicClient("http://localhost:7007");

  //instantiate a composeDB client instance
  const composeClient = new ComposeClient({
    ceramic: "http://localhost:7007",
    definition: definition as RuntimeCompositeDefinition,
  });
  console.log("qweqeqwe 1");

  //authenticate developer DID in order to create a write transaction
  const authenticateDID = async (seed: string) => {
    const provider = new Ed25519Provider(fromHexString(seed));
    const staticDid = new DID({
      resolver: KeyResolver.getResolver(),
      provider,
    });
    await staticDid.authenticate();
    ceramic.did = staticDid;
    return staticDid;
  };
  console.log("qweqeqwe 2");
  try {
    if (uniqueKey) {
      const did = await authenticateDID(uniqueKey);
      composeClient.setDID(did);
      const data = await composeClient.executeQuery(`
      mutation {
        createBasicProfile(input: {
          content: {
            name: "Name1"
            username: "Username"
            description: "Description"
            gender: "Gender"
            emoji: "22"
        }
      }) 
      {
        document {
          name
          username
          description
          gender
          emoji
        }
      }
    }
    `);
      console.log("response", data);
      // @ts-ignore
      if (data.data?.createBasicProfile?.document) {
        return res.json(data);
      }
      return res.json({
        error: "There was an error processing your write request",
      });
    }
  } catch (err) {
    res.json({
      err,
    });
  }
}
