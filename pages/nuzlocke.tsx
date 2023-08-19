import styles from "../styles/Nuzlocke.module.scss";
import { GetStaticProps } from "next";

import LocationCard from "../components/LocationCard";
import NuzlockeFilterControl from "../components/NuzlockeFilterControl";
import Button from "@mui/material/Button";
import { useNuzlocke } from "../hooks/useNuzlocke";
import { Pokemon, SVLocation } from "../utils/types";
import { useState, useEffect } from "react";
import clientPromise from "../utils/mongodb";
import Head from "next/head";

interface NuzlockeProps {
  nuzlockeJson: {
    id: number;
    name: string;
    general: (Pokemon | undefined)[];
    scarlet: (Pokemon | undefined)[];
    violet: (Pokemon | undefined)[];
  }[];
}

export default function Nuzlocke({ nuzlockeJson }: NuzlockeProps) {
  const [] = useState();

  const { handleGenerateNuzlockeHunt, hunt, setNuzlockeJson } = useNuzlocke();

  useEffect(() => {
    // console.log(nuzlockeJson);
    setNuzlockeJson(nuzlockeJson);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokémon Tools | Nuzlocke Generator</title>
        <meta
          property="og:title"
          content="Pokémon Tools | Nuzlocke Generator"
          key="title"
        />
      </Head>
      <NuzlockeFilterControl />
      <Button
        sx={{ marginTop: "2rem", fontSize: "1.25rem" }}
        variant="contained"
        onClick={handleGenerateNuzlockeHunt}
      >
        Generate
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
/*
export const getStaticProps: GetStaticProps = async () => {
  const client = await clientPromise;
  const db = client.db("pokedex");

  const nuzlockeJsonPoorRes = await db
    .collection("svlocations")
    .find({})
    .toArray();

  const pokedexRes = await db
    .collection("pokedex")
    .find({ paldeaDex: { $gte: 1 } })
    .sort({ paldeaDex: 1, formOrder: 1 })
    .toArray();

  const nuzlockeJsonPoor: SVLocation[] = JSON.parse(
    JSON.stringify(nuzlockeJsonPoorRes)
  );
  const pokedex: Pokemon[] = JSON.parse(JSON.stringify(pokedexRes));

  const nuzlockeJson = nuzlockeJsonPoor.map((loc) => {
    return {
      id: loc.id,
      name: loc.name,
      general: loc.general.map((pkmnId) => {
        return pokedex.find((pkmn) => {
          return pkmn.id === pkmnId;
        });
      }),
      scarlet: loc.scarlet.map((pkmnId) => {
        return pokedex.find((pkmn) => {
          return pkmn.id === pkmnId;
        });
      }),
      violet: loc.violet.map((pkmnId) => {
        return pokedex.find((pkmn) => {
          return pkmn.id === pkmnId;
        });
      }),
    };
  });

  return {
    props: {
      nuzlockeJson,
    },
  };
};
*/
