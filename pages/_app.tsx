import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { PokedexProvider } from "../hooks/usePokedex";
import Nav from "../components/Nav";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PokedexProvider>
      <main>
        <Nav />
        <Component {...pageProps} />
      </main>
      <Analytics />
    </PokedexProvider>
  );
}
