import Box from "../components/Box";
import styles from "../styles/Home.module.scss";
import { usePokedex } from "../hooks/usePokedex";
import FilterControl from "../components/FilterControl";
import { useEffect } from "react";
import SearchBox from "../components/SearchBox";
import { GetStaticProps } from "next";
import { Pokemon } from "../utils/types";

interface HomeBoxesProps {
  homedex: Pokemon[];
}

export default function HomeBoxes({ homedex }: HomeBoxesProps) {
  const { firstLoadPokedex, sortByPaldeanDex } = usePokedex();

  useEffect(() => {
    firstLoadPokedex(homedex);
    sortByPaldeanDex();
  }, []);

  return (
    <div className={styles.container}>
      <FilterControl sortingDefault="n" />
      <SearchBox />
      <Box imageSource="home" />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let response = await fetch(`${process.env.API_URL}homedex`);
  let homedex = await response.json();

  return {
    props: { homedex },
  };
};
