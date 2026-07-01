import type { Metadata } from "next";
import "./styles/globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers"; // Import your new client wrapper

export const metadata: Metadata = {
  title: "Pokémon Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main>
            <Nav />
            {children}
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
