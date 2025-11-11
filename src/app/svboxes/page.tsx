"use client";

import { useController } from "@/hooks/useController";
import { useEffect, useState } from "react";
import Box from "../../components/Box";
import BoxGridLayout from "../../components/BoxGridLayout";
import BoxLoading from "../../components/BoxLoading";
import FilterControl from "../../components/FilterControl";
import SearchBox from "../../components/Inputs/SearchBox";
import styles from "../styles/Home.module.scss";

export default function SVBoxes() {
  const { getByPokedex } = useController();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getByPokedex("paldea", () => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div className={styles.container}>
      <h1>Scarlet and Violet Boxes</h1>
      <FilterControl sortingDefault="paldean" />
      <SearchBox />
      <BoxGridLayout>
        {loading ? <BoxLoading /> : <Box imageSource="svicons" />}
      </BoxGridLayout>
    </div>
  );
}
