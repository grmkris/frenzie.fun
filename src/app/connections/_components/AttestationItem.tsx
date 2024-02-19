import { useState } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { ResolvedAttestation } from "@/types";
import { CUSTOM_SCHEMAS, EASContractAddress } from "@/lib/eas-ceramic.utils";
import { Button } from "@/components/ui/button";
import { useEthersSigner } from "@/lib/ethers-wagmi.utils";
import {env} from "../../../../env.mjs";

type Props = {
  data: ResolvedAttestation;
};

const eas = new EAS(EASContractAddress);

export function AttestationItem({ data }: Props) {
  const address = data.recipient;
  const signer = useEthersSigner();
  const [confirming, setConfirming] = useState(false);

  if (!address) return null;

  const isAttester = data.attester.toLowerCase() === data.currAccount;
  console.log(data.currAccount);
  const isConfirmed = !!data.confirmation;
  const isConfirmable = !isAttester && !isConfirmed;

  return (
    <Button
      className="AttestContainer"
      onClick={() => {
        window.open(`${env}/api/v0/streams/${data.id}`);
      }}
    >
      <div className="NameHolder">
        <p>From:</p> {data.attester} <p>To:</p> {data.recipient}
      </div>
      <div className="Check">
        {isConfirmable ? (
          <Button
            className="ConfirmButton"
            onClick={async (e) => {
              e.stopPropagation();
              setConfirming(true);
              if (!signer) throw new Error("No signer");
              try {
                console.log(signer);
                eas.connect(signer);

                const schemaEncoder = new SchemaEncoder("bool confirm");
                const encoded = schemaEncoder.encodeData([
                  { name: "confirm", type: "bool", value: true },
                ]);

                const offchain = await eas.getOffchain();
                const time = BigInt(Math.floor(Date.now() / 1000));
                const offchainAttestation =
                  await offchain.signOffchainAttestation(
                    {
                      recipient: ethers.ZeroAddress,
                      // Unix timestamp of when attestation expires. (0 for no expiration)
                      expirationTime: BigInt(0),
                      // Unix timestamp of current time
                      time,
                      revocable: true,
                      schema: CUSTOM_SCHEMAS.CONFIRM_SCHEMA,
                      refUID: data.uid,
                      data: encoded,
                    },
                    signer,
                  );

                // un-comment the below to process an on-chain timestamp
                // const transaction = await eas.timestamp(offchainAttestation.uid);
                // Optional: Wait for the transaction to be validated
                // await transaction.wait();
                const userAddress = await signer.getAddress();
                console.log(offchainAttestation);
                const requestBody = {
                  ...offchainAttestation,
                  account: userAddress,
                  stream: data.id,
                };
                const requestOptions = {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(requestBody),
                };
                //call confirmAttest endpoint to create a corresponding confirmation
                await fetch("/api/confirmAttest", requestOptions)
                  .then((response) => response.json())
                  .then((data) => console.log(data));
                setConfirming(false);
                window.location.reload();
              } catch (e) {}
            }}
          >
            {confirming ? "Confirming..." : "Confirm we met"}
          </Button>
        ) : (
          <div className="VerifyIconContainer">
            {isConfirmed && (
              <div style={{ fontSize: "2rem", color: "green" }}>Confirmed</div>
            )}
          </div>
        )}
      </div>
    </Button>
  );
}
