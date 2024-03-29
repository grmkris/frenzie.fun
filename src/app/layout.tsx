import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { cookieToInitialState } from "wagmi";
import { wagmiConfig } from "@/wagmiConfig";
import { ContextProvider } from "@/providers";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LiveIslandComp } from "@/app/_components/LiveIslandComp";
import {Toaster} from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Frenzie.fun",
  description: "Stay connected with your friends and family",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    wagmiConfig,
    headers().get("cookie"),
  );
  return (
    <html lang="en">
      <body>
        <ContextProvider initialState={initialState}>
          <LiveIslandComp />
          <div className="h-full max-w-xs mx-auto overflow-scroll rounded-lg shadow-lg mt-12">
            <AspectRatio ratio={9 / 16}>
              <div className="bg-background p-4 h-full">{children}</div>
            </AspectRatio>
          </div>
          <Toaster />
        </ContextProvider>
      </body>
    </html>
  );
}
