import styles from "../styles/Home.module.scss";
import { usePokedex } from "../hooks/usePokedex";
import FilterControl from "../components/FilterControl";
import { useEffect } from "react";
import SearchBox from "../components/SearchBox";
import { GetStaticProps } from "next";
import { Pokemon } from "../utils/types";
import FullGrid from "../components/FullGrid";
import HuntControl from "../components/HuntControl";
import { useShinyHunting } from "../hooks/useShinyHunting";

interface HomeBoxesProps {
  shinydex: Pokemon[];
}

export default function HomeBoxes({ shinydex }: HomeBoxesProps) {
  const { firstLoadPokedex, sortByNationalDex } = usePokedex();
  const { setActiveList, setAllLists, countIdList, setCountIdList } =
    useShinyHunting();

  useEffect(() => {
    firstLoadPokedex(shinydex);
    setActiveList({
      name: "Show All Shinies",
      id: "default",
      pokemon: shinydex,
    });
    sortByNationalDex();

    const localShinyHuntingLists = localStorage.getItem(
      "localShinyHuntingLists"
    );

    if (localShinyHuntingLists) {
      const { countId, list } = JSON.parse(localShinyHuntingLists);
      setCountIdList(countId);
      setAllLists(list);
    } else {
      setAllLists([
        {
          name: "Show All Shinies",
          id: "default",
          pokemon: shinydex,
        },
      ]);
    }
  }, []);

  return (
    <div className={styles.container}>
      <FilterControl sortingDefault="n" />
      <HuntControl />
      <SearchBox />
      <FullGrid imageSource="home" shiny />
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
