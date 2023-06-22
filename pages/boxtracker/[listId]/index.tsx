import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../../styles/Home.module.scss";
import Box from "../../../components/Box";
import HuntControl from "../../../components/ShinyTrackerControl";
import { usePokedex } from "../../../hooks/usePokedex";
import clientPromise from "../../../utils/mongodb";
import { GetStaticPaths, GetStaticProps } from "next";
import { Pokemon } from "../../../utils/types";

interface ShinyTrackerProps {
  shinydex: Pokemon[];
}

interface List {
  id: string;
  name: string;
  pokemon: Pokemon[];
}

export default function CustomBoxTracker({ shinydex }: ShinyTrackerProps) {
  const router = useRouter();
  const { listId } = router.query;
  const pageSlug = router.asPath.replace("/boxtracker/", "");
  const { setPageBox, customBoxes, pageBox, setCustomBoxes } = usePokedex();

  useEffect(() => {
    const localBoxes = localStorage.getItem("localBoxes");

    if (localBoxes) {
      setCustomBoxes(JSON.parse(localBoxes));
    }
  }, []);

  useEffect(() => {
    const getPageBox = customBoxes.find((box) => box.id === pageSlug);

    if (getPageBox) {
      setPageBox(getPageBox);
    } else {
    }
  }, [pageBox, customBoxes]);

  return (
    <div className={styles.container}>
      <HuntControl />
      {pageBox !== undefined && (
        <>
          <p>Nome da llist: {pageBox.name}</p>
          {pageBox.pokemon !== undefined && pageBox.pokemon.length > 0 && (
            <Box imageSource="home" shiny pokemonListShown={pageBox.pokemon} />
          )}
        </>
      )}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const arr: string[] = ["slug1", "slug2"];
  const paths = arr.map((listId) => {
    return {
      params: { listId },
    };
  });
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async () => {
  const client = await clientPromise;
  const db = client.db("pokedex");

  const notInclude = [
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
  ];

  const shinydex = await db
    .collection("pokedex")
    .find({
      homeShinyPic: { $ne: null },
      id: {
        $nin: notInclude,
      },
    })
    .sort({ nationalDex: 1, id: 1 })
    .toArray();

  return {
    props: { shinydex: JSON.parse(JSON.stringify(shinydex)) },
  };
};
