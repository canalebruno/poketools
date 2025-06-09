"use client";

import styles from "../styles/Home.module.scss";
import Box from "../../components/Box";
import { usePokedex } from "../../hooks/usePokedex";
import FilterControl from "../../components/FilterControl";
import { useEffect, useState } from "react";
import SearchBox from "../../components/Inputs/SearchBox";
import Head from "next/head";
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
    const success = getByPokedex("paldeaTM");
  }, []);

  useEffect(() => {
    if (pokedexShown.length > 0) {
      setLoading(false);
    }
  }, [pokedexShown]);

  // useEffect(() => {
  //   loadPokedex(staticDex);

  //   fetch("/api/tealmaskdex")
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
        <title>Pokémon Tools | Teal Mask Boxes</title>
        <meta
          property="og:title"
          content="Pokémon Tools | Teal Mask Boxes"
          key="title"
        />
      </Head> */}
      <h1>Teal Mask Boxes</h1>
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
//     .find({ dex: { paldeaTMDex: { $gte: 1 } } })
//     .sort({ "dex.paldeaTMDex": 1, id: 1 })
//     .limit(240)
//     .toArray();

//   return {
//     props: { staticDex: JSON.parse(JSON.stringify(staticDex)) },
//   };
// };
