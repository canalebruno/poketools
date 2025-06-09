"use client";

import styles from "../styles/Home.module.scss";
import Box from "../../components/Box";
import FilterControl from "../../components/FilterControl";
import SearchBox from "../../components/Inputs/SearchBox";
import { usePokedex } from "../../hooks/usePokedex";
import { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { Pokemon } from "../../utils/types";
import Head from "next/head";
import BoxGridLayout from "../../components/BoxGridLayout";
import BoxLoading from "../../components/BoxLoading";
import { useController } from "@/hooks/useController";

interface HomeBoxesProps {
  homedex: Pokemon[];
}

export default function HomeBoxes({ homedex }: HomeBoxesProps) {
  const { getByPokedex } = useController();
  const { pokedexShown } = usePokedex();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const success = getByPokedex("homedex");
  }, []);

  useEffect(() => {
    if (pokedexShown.length > 0) {
      setLoading(false);
    }
  }, [pokedexShown]);

  //
  // const { loadPokedex } = usePokedex();
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   loadPokedex(homedex);

  //   fetch("/api/homedex")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       loadPokedex(data);
  //       setLoading(false);
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className={styles.container}>
      {/* <Head>
        <title>Pokémon Tools | Home Boxes</title>
        <meta
          property="og:title"
          content="Pokémon Tools | Home Boxes"
          key="title"
        />
      </Head> */}
      <FilterControl sortingDefault="national" />
      <SearchBox />
      <BoxGridLayout>
        <Box imageSource="home" />
        {loading && <BoxLoading />}
      </BoxGridLayout>
    </div>
  );
}

// export const getStaticProps: GetStaticProps = async () => {
//   const client = await clientPromise;
//   const db = client.db("pokedex");

//   const homedex = await db
//     .collection("pokedex")
//     .find({ "availability.homeDepositable": true })
//     .sort({ "dex.nationalDex": 1, id: 1 })
//     .limit(240)
//     .toArray();

//   return {
//     props: { homedex: JSON.parse(JSON.stringify(homedex)) },
//   };
// };
