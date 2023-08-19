import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../../../styles/Home.module.scss";
import Box from "../../../components/Box";
import HuntControl from "../../../components/ShinyTrackerControl";
import { usePokedex } from "../../../hooks/usePokedex";
import { Pokemon } from "../../../utils/types";
import FilterControl from "../../../components/FilterControl";
import Head from "next/head";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getPageBox = customBoxes.find((box) => box.id === pageSlug);

    if (getPageBox) {
      setPageBox(getPageBox);
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageBox, customBoxes]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokémon Tools | My Box: {pageBox && pageBox.name}</title>
        <meta
          property="og:title"
          content={`Pokémon Tools | My Box: ${pageBox && pageBox.name}`}
          key="title"
        />
      </Head>
      <HuntControl />
      <FilterControl sortingDefault="national" />
      {pageBox !== undefined && (
        <>
          <h2>{pageBox.name}</h2>
          {pageBox.pokemon !== undefined && pageBox.pokemon.length > 0 && (
            <Box imageSource="home" shiny pokemonListShown={pageBox.pokemon} />
          )}
        </>
      )}
    </div>
  );
}
