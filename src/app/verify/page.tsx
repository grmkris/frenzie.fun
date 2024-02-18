"use client";
import { FullAttestation } from "@/types";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { AttestToVerify } from "@/app/verify/_components/AttestToVerify";

export default function Home() {
  const account = useAccount();
  const [attestations, setAttestations] = useState<FullAttestation[]>([]);
  const [loading, setLoading] = useState(false);

  //method to get all attestations
  async function getAtts() {
    setLoading(true);
    const requestBody = { account };
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
          <div className="Container">
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
            <div className="GradientBar" />

            <div className="NewConnection">Who you met IRL.</div>
            <div className="AttestationHolder">
              <div className="WhiteBox">
                {loading && <div>Loading...</div>}
                {!loading && !attestations.length && <div>No one here</div>}
                {attestations.length > 0 || loading ? (
                  attestations.map((attestation, i) => (
                    <AttestToVerify key={attestation.uid} data={attestation} />
                  ))
                ) : (
                  <div>Nothing</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
