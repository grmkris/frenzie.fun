import { useState } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import Link from "next/link";
import { EASContractAddress } from "@/lib/eas-ceramic.utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount, useEnsName } from "wagmi";
import { useEthersSigner } from "@/lib/ethers-wagmi.utils";

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const eas = new EAS(EASContractAddress);

export const Attestation = () => {
  const [selectedAddress, setSelectedAddress] = useState("");
  const account = useAccount();
  const [attesting, setAttesting] = useState(false);
  const ethersSigner = useEthersSigner();

  return (
    <div>
      <div className="GradientBar" />
      <div className="WhiteBox">
        <div className="Title">
          I <b>attest</b> that I met
        </div>

        <div className="InputContainer">
          <Input
            className="InputBlock"
            autoCorrect={"off"}
            autoComplete={"off"}
            autoCapitalize={"off"}
            placeholder={"Address/ENS"}
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
          />
        </div>

        <Button
          onClick={async () => {
            try {
              if (!ethersSigner) throw new Error("No signer");
              eas.connect(ethersSigner);

              const schemaEncoder = new SchemaEncoder("bool metIRL");
              const encoded = schemaEncoder.encodeData([
                { name: "metIRL", type: "bool", value: true },
              ]);
              const recipient = selectedAddress;

              if (!recipient) {
                alert("Incorrect recipient address");
                return;
              }
              const offchain = await eas.getOffchain();

              const time = BigInt(Math.floor(Date.now() / 1000));
              const offchainAttestation =
                await offchain.signOffchainAttestation(
                  {
                    recipient: recipient.toLowerCase(),
                    // Unix timestamp of when attestation expires. (0 for no expiration)
                    expirationTime: BigInt(0),
                    // Unix timestamp of current time
                    time,
                    revocable: true,
                    schema:
                      "0xc59265615401143689cbfe73046a922c975c99d97e4c248070435b1104b2dea7",
                    refUID:
                      "0x0000000000000000000000000000000000000000000000000000000000000000",
                    data: encoded,
                  },
                  ethersSigner,
                );
              // un-comment the below to process an on-chain timestamp
              // const transaction = await eas.timestamp(offchainAttestation.uid);
              // // Optional: Wait for the transaction to be validated
              // await transaction.wait();
              const userAddress = await ethersSigner.getAddress();
              console.log(offchainAttestation);
              const requestBody = {
                ...offchainAttestation,
                account: userAddress.toLowerCase(),
              };
              const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
              };

              // call attest api endpoint to store attestation on ComposeDB
              const result = await fetch("/api/profile", {
                method: "POST",
              });
              const parsed = await result.json();
              console.log("parsed", parsed);

              // call attest api endpoint to store attestation on ComposeDB
              await fetch("/api/attest", requestOptions)
                .then((response) => response.json())
                .then((data) => console.log(data));

              setAttesting(false);
            } catch (e) {
              console.log(e);
            }
          }}
        >
          {attesting ? "Attesting..." : "Make Offchain attestation"}
        </Button>

        {account.status === "connected" && (
          <>
            <div className="SubText">
              {" "}
              <Link href="/src/app/connections/connections">Connections</Link>
            </div>
            <div className="SubText">
              {" "}
              <Link href="/verify">Verify Attestations</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
