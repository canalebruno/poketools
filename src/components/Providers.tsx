"use client"; // This tells Next.js that this wrapper can safely handle React Context

import { SessionProvider } from "next-auth/react";
import { NuzlockeProvider } from "@/hooks/useNuzlocke";
import { WindowSizeProvider } from "@/hooks/useWindowSize";
import { PokedexProvider } from "@/hooks/usePokedex";
import { ControllerProvider } from "@/hooks/useController";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <NuzlockeProvider>
        <WindowSizeProvider>
          <PokedexProvider>
            <ControllerProvider>{children}</ControllerProvider>
          </PokedexProvider>
        </WindowSizeProvider>
      </NuzlockeProvider>
    </SessionProvider>
  );
}
