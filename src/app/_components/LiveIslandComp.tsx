"use client";

import React, { useEffect, useState } from "react";
import LiveIsland from "react-live-island";
import { QRCodeSVG } from "qrcode.react";
import { useAccount, useEnsName } from "wagmi";
import { SLIDE_IN_FROM_TOP } from "@/lib/animations";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";

// Define the words as a constant array of strings
const words = [
  "Hello 👋",
  "Hola 🌞",
  "Bonjour 🥐",
  "Hallo 🍻",
  "Ciao 🍕",
  "Olá 🏖️",
  "Привет 🇷🇺",
  "你好 🇨🇳",
  "こんにちは 🗾",
  "안녕하세요 🇰🇷",
  "مرحبا 🌍",
  "नमस्ते 🙏",
  "Jambo 🦁",
  "Merhaba 🌙",
  "Hallo 🚲",
  "Γειά σου 🏛️",
  "שלום ✡️",
  "สวัสดี 🐘",
];

const RotatinText = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) =>
        prevIndex === words.length - 1 ? 0 : prevIndex + 1,
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const createWord = (word: string) => {
    return (
      <div
        key={word}
        className="animate-in fade-in duration-700 ease-in fond-bold"
      >
        {word}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center h-full">
      {createWord(words[currentWordIndex])}
    </div>
  );
};

export const LiveIslandComp: React.FC = () => {
  const account = useAccount();
  const ens = useEnsName({
    address: account.address,
  });
  return (
    <LiveIsland
      initialAnimation={false}
      triggerType={"click"}
      largeClassName={"z-50"}
      largeHeight={"50vh"}
    >
      {(isSmall) =>
        isSmall ? (
          <RotatinText />
        ) : (
            <div className="flex flex-col items-center m-4 space-y-1">

              <QRCodeSVG
                  value={`http://localhost:3000/${ens.data ?? formatAddress(account.address ?? '')}`}
                  includeMargin={true}
                  size={200}
                  // rounded corners
                  className="rounded-2xl"
              />
              <Separator className={"m-2"} />

              <a href={`http://localhost:3000/${ens.data ?? formatAddress(account.address ?? '')}`} className={"w-full"}
                    target="_blank"
                    rel="noreferrer"
              >
              <Button className="py-2 px-4 rounded-full w-full">
                  Share {ens.data ?? formatAddress(account.address ?? '')} ✈️
                </Button>
              </a>
              <Button className="py-2 px-4 rounded-full w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(`http://localhost:3000/${ens.data ?? formatAddress(account.address ?? '')}`);
                      }}
              >
                Copy url 📋
                </Button>
                <Button className="py-2 px-4 rounded-full w-full">
                  Commemorate Connection 🚀
                </Button>
            </div>
        )
      }
    </LiveIsland>
  );
};

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
