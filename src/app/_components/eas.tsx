import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import scrollSepoliaEAS from "@ethereum-attestation-service/eas-contracts/deployments/scroll-sepolia/EAS.json";
import sepoliaEAS from "@ethereum-attestation-service/eas-contracts/deployments/sepolia/EAS.json";
import { useMutation } from "@tanstack/react-query";
import { useEthersProvider, useEthersSigner } from "@/lib/ethers-wagmi.utils";
import { EnabledChain } from "@/wagmiConfig";

const createEAS = (chainId: EnabledChain["name"] | string) => {
  switch (chainId) {
    case "Scroll Sepolia":
      return new EAS(scrollSepoliaEAS.address);
    case "Sepolia":
      return new EAS(sepoliaEAS.address);
    default:
      throw new Error(`EAS not available on chain ${chainId}`);
  }
};

export const useEASOffChain = () => {
  const signer = useEthersSigner();
  const provider = useEthersProvider();
  return useMutation({
    mutationFn: async () => {
      console.log("signing 1");
      if (!signer) throw new Error("No signer available");
      if (!provider) throw new Error("No provider available");
      console.log("signing 2");
      // Initialize EAS with the EAS contract address on whichever chain where your schema is defined
      const network = await provider.getNetwork();
      const eas = createEAS(network.name);

      // Connects an ethers style provider/signingProvider to perform read/write functions.
      // MUST be a signer to do write operations!
      eas.connect(provider);
      const offchain = await eas.getOffchain();

      console.log("signing 3");

      // Initialize SchemaEncoder with the schema string
      // Note these values are sample values and should be filled with actual values
      // Code samples can be found when viewing each schema on easscan.org
      const schemaEncoder = new SchemaEncoder(
        "uint256 eventId, uint8 voteIndex",
      );
      const encodedData = schemaEncoder.encodeData([
        { name: "eventId", value: 1, type: "uint256" },
        { name: "voteIndex", value: 1, type: "uint8" },
      ]);

      const offchainAttestation = await offchain.signOffchainAttestation(
        {
          recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165",
          expirationTime: BigInt(0), // Unix timestamp of when attestation expires. (0 for no expiration)
          time: BigInt(Math.floor(Date.now() / 1000)), // Unix timestamp of current time
          revocable: true, // Be aware that if your schema is not revocable, this MUST be false
          schema:
            "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995",
          refUID:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          data: encodedData,
        },
        signer,
      );

      console.log(offchainAttestation);
    },
  });
};
