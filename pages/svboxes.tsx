import styles from "../styles/Home.module.scss";
import { GetStaticProps } from "next";

import Box from "../components/Box";
import { usePokedex } from "../hooks/usePokedex";
import FilterControl from "../components/FilterControl";
import { useEffect } from "react";
import SearchBox from "../components/SearchBox";
import { Pokemon } from "../utils/types";
import clientPromise from "../utils/mongodb";

interface SVBoxesProps {
  paldeaDex: Pokemon[];
}

export default function SVBoxes({ paldeaDex }: SVBoxesProps) {
  const { pokedexShown, loadPokedex } = usePokedex();

  useEffect(() => {
    loadPokedex(paldeaDex);
  }, []);

  return (
    <div className={styles.container}>
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
