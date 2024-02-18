import { useState } from "react";
import {
  EAS,
  Offchain,
  PartialTypedDataConfig,
  SignedOffchainAttestation,
} from "@ethereum-attestation-service/eas-sdk";
import { FullAttestation } from "@/types";
import { EASContractAddress, baseURL } from "@/lib/eas-ceramic.utils";
import { Button } from "@/components/ui/button";

type Props = {
  data: FullAttestation;
};

const eas = new EAS(EASContractAddress);

export function AttestToVerify({ data }: Props) {
  const address = data.recipient;
  const [confirming, setConfirming] = useState(false);
  const [validated, setValidated] = useState(false);

  if (!address) return null;

  const isAttester = data.attester.toLowerCase() === data.currAccount;

  return (
    <Button
      className="AttestContainer"
      onClick={() => {
        window.open(`${baseURL}/attestation/view/${data.id}`);
      }}
    >
      <div className="IconHolder">
        {validated && (
          <div style={{ fontSize: "2rem", color: "green" }}>Valid</div>
        )}
      </div>
      <div className="NameHolder">
        <p>From:</p> {data.attester} <p>To:</p> {data.recipient}
      </div>
      <div className="Check">
        {!validated && (
          <Button
            className="ConfirmButton"
            onClick={async (e) => {
              e.stopPropagation();
              setConfirming(true);
              try {
                // your offchain attestation
                const attestation = {
                  domain: {
                    name: "EAS Attestation",
                    version: data.easVersion,
                    chainId: BigInt(data.chainId),
                    verifyingContract: data.verifyingContract,
                  },
                  primaryType: "Attest",
                  types: {
                    Attest: data.types,
                  },
                  signature: {
                    r: data.r,
                    s: data.s,
                    v: data.v,
                  },
                  uid: data.uid,
                  message: {
                    version: data.version,
                    schema: data.schema,
                    refUID: data.refUID,
                    time: BigInt(data.time),
                    expirationTime: BigInt(0),
                    recipient: data.recipient,
                    revocable: true,
                    data: data.data,
                  },
                  version: data.version,
                } satisfies SignedOffchainAttestation;

                const EAS_CONFIG: PartialTypedDataConfig = {
                  address: attestation.domain.verifyingContract,
                  version: attestation.domain.version,
                  chainId: BigInt(attestation.domain.chainId),
                };
                const offchain = new Offchain(
                  EAS_CONFIG,
                  2,
                  new EAS(EASContractAddress),
                );
                const isValidAttestation =
                  offchain.verifyOffchainAttestationSignature(
                    data.attester,
                    attestation,
                  );

                if (isValidAttestation) {
                  setValidated(true);
                }
                setConfirming(false);
              } catch (e) {}
            }}
          >
            {confirming ? "Verifying..." : "Verify Attestation"}
          </Button>
        )}
      </div>
    </Button>
  );
}
