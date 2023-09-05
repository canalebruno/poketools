import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { PokedexProvider } from "../hooks/usePokedex";
import Nav from "../components/Nav";
import Head from "next/head";
import { WindowSizeProvider } from "../hooks/useWindowSize";
import { NuzlockeProvider } from "../hooks/useNuzlocke";
import Footer from "../components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NuzlockeProvider>
      <WindowSizeProvider>
        <PokedexProvider>
          <Head>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            ></script>
            <script>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}')
              `}
            </script>
            <title>Pokémon Tools</title>
          </Head>
          <main>
            <Nav />
            <Component {...pageProps} />
            <Footer />
          </main>
          <Analytics />
        </PokedexProvider>
      </WindowSizeProvider>
    </NuzlockeProvider>
  );
}
