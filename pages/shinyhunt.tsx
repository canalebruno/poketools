import Box from "../components/Box";
import styles from "../styles/Home.module.scss";
import { usePokedex } from "../hooks/usePokedex";
import FilterControl from "../components/FilterControl";
import { useEffect } from "react";
import SearchBox from "../components/SearchBox";
import { GetStaticProps } from "next";
import { Pokemon } from "../utils/types";

interface HomeBoxesProps {
  shinydex: Pokemon[];
}

export default function HomeBoxes({ shinydex }: HomeBoxesProps) {
  const { firstLoadPokedex, sortByPaldeanDex } = usePokedex();

  useEffect(() => {
    firstLoadPokedex(shinydex);
    sortByPaldeanDex();
  }, []);

  return (
    <div className={styles.container}>
      <FilterControl sortingDefault="n" />
      <SearchBox />
      <Box imageSource="home" shiny />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let response = await fetch(`${process.env.API_URL}shinydex`);
  let shinydex = await response.json();

  return {
    props: { shinydex },
  };
};
