"use client";

import styles from "../styles/Home.module.scss";
import { GetStaticProps } from "next";
import Box from "../../components/Box";
import { usePokedex } from "../../hooks/usePokedex";
import FilterControl from "../../components/FilterControl";
import { useEffect, useState } from "react";
import SearchBox from "../../components/Inputs/SearchBox";
import { Pokemon } from "../../utils/types";
// import clientPromise from "../utils/mongodb";
import Head from "next/head";
import BoxLoading from "../../components/BoxLoading";
import BoxGridLayout from "../../components/BoxGridLayout";
import { useController } from "@/hooks/useController";

// interface SVBoxesProps {
//   paldeaDex: Pokemon[];
// }

export default function SVBoxes() {
  const { getByPokedex } = useController();
  const { pokedexShown } = usePokedex();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const success = getByPokedex("paldea");

    // fetch("/api/paldeadex")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     loadPokedex(data);
    //     setLoading(false);
    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pokedexShown.length > 0) {
      setLoading(false);
    }
  }, [pokedexShown]);

  return (
    <div className={styles.container}>
      {/* <Head>
        <title>Pokémon Tools | Scarlet and Violet Boxes</title>
        <meta
          property="og:title"
          content="Pokémon Tools | Scarlet and Violet Boxes"
          key="title"
        />
      </Head> */}
      <h1>Scarlet and Violet Boxes</h1>
      <FilterControl sortingDefault="paldean" />
      <SearchBox />
      <BoxGridLayout>
        {pokedexShown.length > 0 && (
          <Box
            imageSource="svicons"
            // pokemonListShown={paldeaDex}
          />
        )}
        {loading && <BoxLoading />}
      </BoxGridLayout>
    </div>
  );
}

// export const getStaticProps: GetStaticProps = async () => {
//   const client = await clientPromise;
//   const db = client.db("pokedex");

//   const paldeaDex = await db
//     .collection("pokedex")
//     .find({ dex: { paldeaDex: { $gte: 1 } } })
//     .sort({ "dex.paldeaDex": 1, id: 1 })
//     .limit(240)
//     .toArray();

//   return {
//     props: { paldeaDex: JSON.parse(JSON.stringify(paldeaDex)) },
//   };
// };
