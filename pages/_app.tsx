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
import { ShinyTrackerProvider } from "../hooks/useShinyTracker";
import Footer from "../components/Footer";

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
          <ShinyTrackerProvider>
            <script async src=`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`></script>
            <script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', `${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`);
            </script>
            <Head>         
              <title>Pokémon Tools</title>
            </Head>
            <main>
              <Nav />
              {isLoading && <Loader />}
              <Component {...pageProps} />
              {/* <Footer /> */}
            </main>
            <Analytics />
          </ShinyTrackerProvider>
        </PokedexProvider>
      </WindowSizeProvider>
    </NuzlockeProvider>
  );
}
