import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { PokedexProvider } from "../hooks/usePokedex";
import Nav from "../components/Nav";
import Head from "next/head";
import { WindowSizeProvider } from "../hooks/useWindowSize";
import { NuzlockeProvider } from "../hooks/useNuzlocke";
import Router from "next/router";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setIsLoading(true);
    });

    Router.events.on("routeChangeComplete", (url) => {
      setIsLoading(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setIsLoading(false);
    });
  }, [Router]);

  return (
    <NuzlockeProvider>
      <WindowSizeProvider>
        <PokedexProvider>
          <Head>
            <title>Pokémon Tools</title>
          </Head>
          <main>
            <Nav />
            {isLoading && <Loader />}
            <Component {...pageProps} />
          </main>
          <Analytics />
        </PokedexProvider>
      </WindowSizeProvider>
    </NuzlockeProvider>
  );
}
