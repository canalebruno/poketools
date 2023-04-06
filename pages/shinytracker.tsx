import styles from "../styles/Home.module.scss";
import { usePokedex } from "../hooks/usePokedex";
import { useEffect } from "react";
import { GetStaticProps } from "next";
import { Pokemon } from "../utils/types";
import FullGrid from "../components/FullGrid";
import HuntControl from "../components/ShinyTrackerControl";
import { useShinyTracker } from "../hooks/useShinyTracker";
import ImportExportButtons from "../components/ImportExportButtons";

interface ShinyTrackerProps {
  shinydex: Pokemon[];
}

export default function ShinyTracker({ shinydex }: ShinyTrackerProps) {
  const { firstLoadPokedex, sortByNationalDex } = usePokedex();
  const { setActiveList, setAllLists, setCountIdList } = useShinyTracker();

  useEffect(() => {
    firstLoadPokedex(shinydex);
    setActiveList({
      name: "Show All Shinies",
      id: "default",
      pokemon: shinydex,
    });
    sortByNationalDex();

    const localShinyTrackerLists = localStorage.getItem(
      "localShinyTrackerLists"
    );

    if (localShinyTrackerLists) {
      const { countId, list } = JSON.parse(localShinyTrackerLists);
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
      <HuntControl />
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
