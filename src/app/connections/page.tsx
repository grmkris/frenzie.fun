"use client";
import React, { useState } from "react";
import { AttestationItem } from "@/app/connections/_components/AttestationItem";
import { ResolvedAttestation } from "@/types";
import { useAccount } from "wagmi";

export default function Home() {
  const account = useAccount();
  const [attestations, setAttestations] = useState<ResolvedAttestation[]>([]);
  const [loading, setLoading] = useState(false);

  //method to get all attestations
  async function getAtts() {
    setLoading(true);
    const requestBody = { account: account };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };
    const tmpAttestations = await fetch("/api/all", requestOptions)
      .then((response) => response.json())
      .then((data) => data);
    setAttestations([]);

    //exit call if no attestations are found
    if (!account || !tmpAttestations.data) {
      return;
    }

    //establish allRecords to check whether corresponding confirmations exist
    const allRecords = tmpAttestations.data.attestationIndex.edges;
    const addresses = new Set<string>();

    for (const att of allRecords) {
      const obj = att.node;
      addresses.add(obj.attester);
      addresses.add(obj.recipient);
    }

    const records = [];
    for (const att of allRecords) {
      const item = att.node;
      //if confirm field contains an item, a confirmation has been found
      if (att.node.confirm.edges.length) {
        item.confirmation = true;
      }
      item.uid = att.node.uid;
      item.currAccount = account;
      records.push(item);
    }
    setAttestations([...attestations, ...records]);
    console.log(records);
    setLoading(false);
  }

  return (
    <>
      <div className="relative flex flex-1">
        <div className="flex-center flex h-full flex-1 flex-col items-center justify-center text-center">
          <div>
            {account.address && (
              <div className="right">
                <img alt="Network logo" className="logo" src={"/ethlogo.png"} />
                <p style={{ textAlign: "center" }}>
                  {" "}
                  Connected with: {account.address.slice(0, 6)}...
                  {account.address.slice(-4)}{" "}
                </p>
              </div>
            )}
            <a
              className="SubText"
              href={"/"}
              style={{
                margin: "auto",
                position: "relative",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Back home
            </a>

            <div>Who you met IRL.</div>
            <div>
              <div>
                {loading && <div>Loading...</div>}
                {!loading && !attestations.length && <div>No one here</div>}
                {attestations.length > 0 || loading ? (
                  attestations.map((attestation, i) => (
                    <AttestationItem key={attestation.uid} data={attestation} />
                  ))
                ) : (
                  <div>No one here</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
