"use client";

import styles from "../styles/Nuzlocke.module.scss";

import LocationCard from "../../components/LocationCard";
import NuzlockeFilterControl from "../../components/NuzlockeFilterControl";
import Button from "@mui/material/Button";
import { useNuzlocke } from "../../hooks/useNuzlocke";
import { Pokemon, SVLocation } from "../../utils/types";
import { useState, useEffect } from "react";
import Head from "next/head";
import { useController } from "@/hooks/useController";

// interface NuzlockeProps {
//   nuzlockeJson: {
//     id: number;
//     name: string;
//     general: (Pokemon | undefined)[];
//     scarlet: (Pokemon | undefined)[];
//     violet: (Pokemon | undefined)[];
//   }[];
// }

export default function Nuzlocke() {
  const { handleGenerateNuzlockeHunt, hunt, setNuzlockeJson, nuzlockeJson } =
    useNuzlocke();
  const { getNuzlocke } = useController();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch("/api/nuzlocke")
    //   .then((res) => res.json())
    //   .then((data: SVLocation[]) => {
    //     let pokedex: Pokemon[];

    //     fetch("/api/paldeadex")
    //       .then((res) => res.json())
    //       .then((pokedexData: Pokemon[]) => {
    //         pokedex = pokedexData;

    //         const dataWorked = data.map((loc) => {
    //           return {
    //             id: loc.id,
    //             name: loc.name,
    //             general: loc.general.map((pkmnId) => {
    //               return pokedex.find((pkmn) => {
    //                 return pkmn.id === pkmnId;
    //               });
    //             }),
    //             scarlet: loc.scarlet.map((pkmnId) => {
    //               return pokedex.find((pkmn) => {
    //                 return pkmn.id === pkmnId;
    //               });
    //             }),
    //             violet: loc.violet.map((pkmnId) => {
    //               return pokedex.find((pkmn) => {
    //                 return pkmn.id === pkmnId;
    //               });
    //             }),
    //           };
    //         });

    //         setNuzlockeJson(dataWorked);
    //         setLoading(false);
    //       });
    //   });

    getNuzlocke();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (nuzlockeJson.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [nuzlockeJson]);

  return (
    <div className={styles.container}>
      {/* <Head>
        <title>Pokémon Tools | Nuzlocke Generator</title>
        <meta
          property="og:title"
          content="Pokémon Tools | Nuzlocke Generator"
          key="title"
        />
      </Head> */}
      <NuzlockeFilterControl />
      <Button
        sx={{ marginTop: "2rem", fontSize: "1.25rem" }}
        variant="contained"
        onClick={handleGenerateNuzlockeHunt}
        disabled={loading}
      >
        {loading ? "Loading data..." : "Generate"}
      </Button>
      <div className={styles.cardsGrid}>
        {hunt &&
          hunt.map((item) => {
            return (
              <LocationCard
                key={item.id}
                name={item.name}
                pokemon={item.pokemon && item.pokemon}
              />
            );
          })}
      </div>
    </div>
  );
}
