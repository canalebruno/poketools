import Box from "../components/Box";
import styles from "../styles/Home.module.scss";
import { usePokedex } from "../hooks/usePokedex";
import FilterControl from "../components/FilterControl";
import { useEffect, useState } from "react";
import SearchBox from "../components/SearchBox";
import { GetStaticProps } from "next";
import { Pokemon } from "../utils/types";
import clientPromise from "../utils/mongodb";
import Head from "next/head";

interface HomeBoxesProps {
  homedex: Pokemon[];
}

export default function HomeBoxes({ homedex }: HomeBoxesProps) {
  const { pokedexShown, loadPokedex } = usePokedex();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPokedex(homedex);

    fetch("/api/homedex")
      .then((res) => res.json())
      .then((data) => {
        loadPokedex(data);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokémon Tools | Home Boxes</title>
        <meta
          property="og:title"
          content="Pokémon Tools | Home Boxes"
          key="title"
        />
      </Head>
      {pokedexShown ? (
        <>
          <FilterControl sortingDefault="national" />
          <SearchBox />
          <Box imageSource="home" pokemonListShown={homedex} />
          {loading && <p>Loading...</p>}
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

  const homedex = await db
    .collection("pokedex")
    .find({ homeAvailable: true })
    .sort({ nationalDex: 1, id: 1 })
    .limit(120)
    .toArray();

  return {
    props: { homedex: JSON.parse(JSON.stringify(homedex)) },
  };
};
