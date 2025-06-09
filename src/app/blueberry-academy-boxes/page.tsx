"use client";

import styles from "../styles/Home.module.scss";
// import { GetStaticProps } from "next";
import Box from "../../components/Box";
import { usePokedex } from "../../hooks/usePokedex";
import FilterControl from "../../components/FilterControl";
import { useEffect, useState } from "react";
import SearchBox from "../../components/Inputs/SearchBox";
// import { Pokemon } from "../../utils/types";
// import Head from "next/head";
import BoxLoading from "../../components/BoxLoading";
import BoxGridLayout from "../../components/BoxGridLayout";
import { useController } from "@/hooks/useController";

// interface SVBoxesProps {
//   staticDex: Pokemon[];
// }

export default function SVBoxes() {
  const { getByPokedex } = useController();
  const { pokedexShown } = usePokedex();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const success = getByPokedex("paldeaBB");
  }, []);

  useEffect(() => {
    if (pokedexShown.length > 0) {
      setLoading(false);
    }
  }, [pokedexShown]);

  // useEffect(() => {
  //   loadPokedex(staticDex);

  //   fetch("/api/indigodisk")
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
        <title>Pokémon Tools | Blueberry Academy Boxes</title>
        <meta
          property="og:title"
          content="Pokémon Tools | Blueberry Academy Boxes"
          key="title"
        />
      </Head> */}
      <h1>Blueberry Academy Boxes</h1>
      <FilterControl sortingDefault="paldean-tm" />
      <SearchBox />
      <BoxGridLayout>
        {pokedexShown && <Box imageSource="svicons" />}
        {loading && <BoxLoading />}
      </BoxGridLayout>
    </div>
  );
}

// export const getStaticProps: GetStaticProps = async () => {
//   const client = await clientPromise;
//   const db = client.db("pokedex");

//   const staticDex = await db
//     .collection("pokedex")
//     .find({ dex: { paldeaBBDex: { $gte: 1 }}, availability: {homeDepositable: true}  })
//     .sort({ "dex.paldeaBBDex": 1, id: 1 })
//     .limit(240)
//     .toArray();

//   return {
//     props: { staticDex: JSON.parse(JSON.stringify(staticDex)) },
//   };
// };
