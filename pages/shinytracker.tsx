import styles from "../styles/Home.module.scss";
import { usePokedex } from "../hooks/usePokedex";
import { useEffect } from "react";
import { GetStaticProps } from "next";
import { Pokemon } from "../utils/types";
import FullGrid from "../components/FullGrid";
import HuntControl from "../components/ShinyTrackerControl";
import { useShinyTracker } from "../hooks/useShinyTracker";
import ImportExportButtons from "../components/ImportExportButtons";
import clientPromise from "../utils/mongodb";

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
  const client = await clientPromise;
  const db = client.db("pokedex");

  const shinydex = await db
    .collection("pokedex")
    .find({
      homeShinyPic: { $ne: null },
      id: {
        $nin: [
          "670_05",
          "774_00",
          "774_02",
          "774_03",
          "774_04",
          "774_05",
          "774_06",
          "774_07",
          "869_07",
          "869_08",
          "869_09",
          "869_10",
          "869_11",
          "869_12",
          "869_13",
          "869_14",
          "869_15",
          "869_16",
          "869_17",
          "869_18",
          "869_19",
          "869_20",
          "869_21",
          "869_22",
          "869_23",
          "869_24",
          "869_25",
          "869_26",
          "869_27",
          "869_28",
          "869_29",
          "869_30",
          "869_31",
          "869_32",
          "869_33",
          "869_34",
          "869_35",
          "869_36",
          "869_37",
          "869_38",
          "869_39",
          "869_40",
          "869_41",
          "869_42",
          "869_43",
          "869_44",
          "869_45",
          "869_46",
          "869_47",
          "869_48",
          "869_49",
          "869_50",
          "869_51",
          "869_52",
          "869_53",
          "869_54",
          "869_55",
          "869_56",
          "869_57",
          "869_58",
          "869_59",
          "869_60",
          "869_61",
          "869_62",
          "1009_00",
          "1010_00",
        ],
      },
    })
    .sort({ nationalDex: 1, id: 1 })
    .toArray();

  return {
    props: { shinydex: JSON.parse(JSON.stringify(shinydex)) },
  };
};