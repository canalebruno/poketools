import Box from "../components/Box";
import styles from "../styles/Home.module.scss";
import { usePokedex } from "../hooks/usePokedex";
import FilterControl from "../components/FilterControl";
import { useEffect } from "react";
import SearchBox from "../components/SearchBox";
import { GetStaticProps } from "next";
import { Pokemon } from "../utils/types";
import clientPromise from "../utils/mongodb";

interface HomeBoxesProps {
  homedex: Pokemon[];
}

export default function HomeBoxes({ homedex }: HomeBoxesProps) {
  const { sortByNationalDex } = usePokedex();

  useEffect(() => {
    sortByNationalDex();
  }, []);

  return (
    <div className={styles.container}>
      <FilterControl sortingDefault="n" />
      <SearchBox />
      <Box imageSource="home" pokemonListShown={homedex} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = await clientPromise;
  const db = client.db("pokedex");

  const homedex = await db
    .collection("pokedex")
    .find({ homeAvailable: true })
    .sort({ nationalDex: 1, id: 1 })
    .toArray();

  return {
    props: { homedex: JSON.parse(JSON.stringify(homedex)) },
  };
};
