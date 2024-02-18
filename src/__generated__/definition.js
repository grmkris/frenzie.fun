// This is an auto-generated file, do not edit manually
export const definition = {
  models: {
    Attestation: {
      interface: false,
      implements: [],
      id: "kjzl6hvfrbw6c7u05eto3cuxcdaeo7c6aa6nfrbn6yaz15hzgy1akij4bg3m67a",
      accountRelation: { type: "list" },
    },
    Confirm: {
      interface: false,
      implements: [],
      id: "kjzl6hvfrbw6c95qdvxp86njam64nblpqvy1q9wpxrwyvz09sugxlsvdjmzt0r4",
      accountRelation: { type: "list" },
    },
    BasicProfile: {
      interface: false,
      implements: [],
      id: "kjzl6hvfrbw6c9papyrz7docoww9qyovvbqdpg4r5u7yr8r0bjq1dspaob9irr3",
      accountRelation: { type: "single" },
    },
  },
  objects: {
    Types: {
      name: { type: "string", required: true },
      type: { type: "string", required: true },
    },
    Attestation: {
      r: { type: "string", required: true },
      s: { type: "string", required: true },
      v: { type: "integer", required: true },
      uid: { type: "string", required: true },
      data: { type: "string", required: true },
      time: { type: "integer", required: true },
      types: {
        type: "list",
        required: false,
        item: {
          type: "reference",
          refType: "object",
          refName: "Types",
          required: false,
        },
      },
      refUID: { type: "string", required: false },
      schema: { type: "string", required: true },
      chainId: { type: "integer", required: true },
      version: { type: "integer", required: true },
      attester: { type: "string", required: true, indexed: true },
      recipient: { type: "string", required: false, indexed: true },
      easVersion: { type: "string", required: true },
      expirationTime: { type: "datetime", required: false },
      revocationTime: { type: "datetime", required: false },
      verifyingContract: { type: "string", required: true },
      publisher: { type: "view", viewType: "documentAccount" },
      confirm: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6c95qdvxp86njam64nblpqvy1q9wpxrwyvz09sugxlsvdjmzt0r4",
          property: "attestationId",
        },
      },
    },
    Confirm: {
      r: { type: "string", required: true },
      s: { type: "string", required: true },
      v: { type: "integer", required: true },
      uid: { type: "string", required: true },
      data: { type: "string", required: true },
      time: { type: "integer", required: true },
      types: {
        type: "list",
        required: false,
        item: {
          type: "reference",
          refType: "object",
          refName: "Types",
          required: false,
        },
      },
      refUID: { type: "string", required: false },
      schema: { type: "string", required: true },
      chainId: { type: "integer", required: true },
      version: { type: "integer", required: true },
      attester: { type: "string", required: true, indexed: true },
      recipient: { type: "string", required: false, indexed: true },
      easVersion: { type: "string", required: true },
      attestationId: { type: "streamid", required: true },
      expirationTime: { type: "datetime", required: false },
      revocationTime: { type: "datetime", required: false },
      verifyingContract: { type: "string", required: true },
      publisher: { type: "view", viewType: "documentAccount" },
      attestation: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "document",
          model:
            "kjzl6hvfrbw6c7u05eto3cuxcdaeo7c6aa6nfrbn6yaz15hzgy1akij4bg3m67a",
          property: "attestationId",
        },
      },
    },
    ProfileUrls: {
      url: { type: "string", required: true },
      description: { type: "string", required: false },
    },
    BasicProfile: {
      name: { type: "string", required: true, indexed: true },
      urls: {
        type: "list",
        required: true,
        item: {
          type: "reference",
          refType: "object",
          refName: "ProfileUrls",
          required: true,
        },
      },
      emoji: { type: "string", required: false },
      description: { type: "string", required: false },
      author: { type: "view", viewType: "documentAccount" },
    },
  },
  enums: {},
  accountData: {
    attestationList: { type: "connection", name: "Attestation" },
    confirmList: { type: "connection", name: "Confirm" },
    basicProfile: { type: "node", name: "BasicProfile" },
  },
};
