import KeyDIDResolver from "key-did-resolver";
import { randomBytes } from "crypto";
import { writeFile } from "fs";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";

export const RunCommands = async () => {
  const generateAdminKeyDid = async () => {
    const seed = new Uint8Array(randomBytes(32));
    const keyResolver = KeyDIDResolver.getResolver();
    const did = new DID({
      provider: new Ed25519Provider(seed),
      resolver: {
        ...keyResolver,
      },
    });
    await did.authenticate();
    return {
      seed: Buffer.from(seed).toString("hex"),
      did,
    };
  };


  const generateLocalConfig = async (adminSeed, adminDid) => {
    const configData = {
      anchor: {},
      "http-api": {
        "cors-allowed-origins": [".*"],
        "admin-dids": [adminDid.id],
      },
      ipfs: {
        mode: "bundled",
      },
      logger: {
        "log-level": 2,
        "log-to-files": false,
      },
      metrics: {
        "metrics-exporter-enabled": false,
        "metrics-port": 9090,
      },
      network: {
        name: "inmemory",
      },
      node: {},
      "state-store": {
        mode: "fs",
        "local-directory": `${process.cwd()}/.ceramic/.ceramic/statestore/`,
      },
      indexing: {
        db: `sqlite://${process.cwd()}/.ceramic/indexing.sqlite`,
        "allow-queries-before-historical-sync": true,
        models: [],
      },
    };
    writeFile(
        `${process.cwd()}/composedb.config.json`,
        JSON.stringify(configData, null, 2),
        (err) => {
          if (err) {
            console.error(err);
          }
        },
    );
    writeFile(`${process.cwd()}/admin_seed.txt`, adminSeed, (err) => {
      if (err) {
        console.error(err);
      }
    });
  };

  const generateProductionConfig = async (adminSeed, adminDid) => {
    const configData = {
      anchor: {},
      "http-api": {
        "cors-allowed-origins": [".*"],
        "admin-dids": [adminDid.id],
      },
      ipfs: {
        mode: "external",
        "api-endpoint": "http://localhost:5001",
      },
      logger: {
        "log-level": 2,
        "log-to-files": false,
      },
      metrics: {
        "metrics-exporter-enabled": false,
        "metrics-port": 9090,
      },
      network: {
        name: "mainnet",
      },
      node: {},
      "state-store": {
        mode: "fs",
        "local-directory": `${process.cwd()}/.ceramic/.ceramic/statestore/`,
      },
      indexing: {
        db: `sqlite://${process.cwd()}/.ceramic/indexing.sqlite`,
        "allow-queries-before-historical-sync": true,
        models: [],
      },
    };
    writeFile(
        `${process.cwd()}/composedb_prod.config.json`,
        JSON.stringify(configData, null, 2),
        (err) => {
          if (err) {
            console.error(err);
          }
        },
    );
    writeFile(`${process.cwd()}/admin_seed.txt`, adminSeed, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  const { seed, did } = await generateAdminKeyDid();
  await generateLocalConfig(seed, did);
  await generateProductionConfig(seed, did);
};
RunCommands();
