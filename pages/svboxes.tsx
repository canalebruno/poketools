import styles from "../styles/Home.module.scss";
import { GetStaticProps } from "next";

import Box from "../components/Box";
import { usePokedex } from "../hooks/usePokedex";
import FilterControl from "../components/FilterControl";
import { useEffect } from "react";
import SearchBox from "../components/SearchBox";
import { Pokemon } from "../utils/types";
import clientPromise from "../utils/mongodb";
import Head from "next/head";

interface SVBoxesProps {
  paldeaDex: Pokemon[];
}

export default function SVBoxes({ paldeaDex }: SVBoxesProps) {
  const { pokedexShown, loadPokedex } = usePokedex();

  useEffect(() => {
    loadPokedex(paldeaDex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokémon Tools | Scarlet and Violet Boxes</title>
        <meta
          property="og:title"
          content="Pokémon Tools | Scarlet and Violet Boxes"
          key="title"
        />
      </Head>
      <h1>Scarlet and Violet Boxes</h1>
      {pokedexShown ? (
        <>
          <FilterControl sortingDefault="p" />
          <SearchBox />
          {paldeaDex && (
            <Box imageSource="svicons" pokemonListShown={paldeaDex} />
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = await clientPromise;
  const db = client.db("pokedex");

  const paldeaDex = await db
    .collection("pokedex")
    .find({ paldeaDex: { $gte: 1 } })
    .sort({ paldeaDex: 1, id: 1 })
    .toArray();

  return {
    props: { paldeaDex: JSON.parse(JSON.stringify(paldeaDex)) },
  };
};
