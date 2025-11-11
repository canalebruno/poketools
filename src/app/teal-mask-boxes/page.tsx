"use client";

import styles from "../styles/Home.module.scss";
import Box from "../../components/Box";
import FilterControl from "../../components/FilterControl";
import { useEffect, useState } from "react";
import SearchBox from "../../components/Inputs/SearchBox";
import BoxLoading from "../../components/BoxLoading";
import BoxGridLayout from "../../components/BoxGridLayout";
import { useController } from "@/hooks/useController";

export default function SVBoxes() {
  const { getByPokedex } = useController();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getByPokedex("paldeaTM", () => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <h1>Teal Mask Boxes</h1>
      <FilterControl sortingDefault="paldean-tm" />
      <SearchBox />
      <BoxGridLayout>
        {loading ? <BoxLoading /> : <Box imageSource="svicons" />}
      </BoxGridLayout>
    </div>
  );
}
