import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { PokedexProvider } from "../hooks/usePokedex";
import Nav from "../components/Nav";
import Head from "next/head";
import { WindowSizeProvider } from "../hooks/useWindowSize";
import { NuzlockeProvider } from "../hooks/useNuzlocke";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NuzlockeProvider>
      <WindowSizeProvider>
        <PokedexProvider>
          <Head>
            <title>Pokémon Tools</title>
          </Head>
          <main>
            <Nav />
            <Component {...pageProps} />
          </main>
          <Analytics />
        </PokedexProvider>
      </WindowSizeProvider>
    </NuzlockeProvider>
  );
}
