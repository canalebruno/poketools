import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { PokedexProvider } from "../hooks/usePokedex";
import Nav from "../components/Nav";
import Head from "next/head";
import { WindowSizeProvider } from "../hooks/useWindowSize";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WindowSizeProvider>
      <PokedexProvider>
        <Head>
          <title>Pokémon Boxes Organizer</title>
        </Head>
        <main>
          <Nav />
          <Component {...pageProps} />
        </main>
        <Analytics />
      </PokedexProvider>
    </WindowSizeProvider>
  );
}
