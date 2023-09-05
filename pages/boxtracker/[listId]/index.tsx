import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../../styles/Home.module.scss";
import Box from "../../../components/Box";
import HuntControl from "../../../components/ShinyTrackerControl";
import { usePokedex } from "../../../hooks/usePokedex";
import FilterControl from "../../../components/FilterControl";
import Head from "next/head";
import BoxGridLayout from "../../../components/BoxGridLayout";
import BoxLoading from "../../../components/BoxLoading";
import ButtonsGroup from "../../../components/ButtonsGroup";
import ToggleButton from "../../../components/ButtonsGroup/ToggleButton";
import HuntGameSelect from "../../../components/HuntGameSelect";

export default function CustomBoxTracker() {
  const router = useRouter();
  const pageSlug = router.asPath.replace("/boxtracker/", "");
  const {
    setPageBox,
    customBoxes,
    pageBox,
    setCustomBoxes,
    showChecked,
    showUnchecked,
    setShowChecked,
    setShowUnchecked,
    passListThroughFilters,
    viewGenderDifference,
    viewOnlyOneForm,
    handleToggleCheck,
    showAllCheckedAndUnchecked,
    huntGameSelection,
  } = usePokedex();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localBoxes = localStorage.getItem("localBoxes");

    if (localBoxes) {
      setCustomBoxes(JSON.parse(localBoxes));
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pageBox.pokemon && pageBox.pokemon.length > 0) {
      passListThroughFilters();
    }
  }, [
    showChecked,
    showUnchecked,
    viewGenderDifference,
    viewOnlyOneForm,
    showAllCheckedAndUnchecked,
    huntGameSelection,
  ]);

  useEffect(() => {
    const getPageBox = customBoxes.find((box) => box.id === pageSlug);

    if (getPageBox) {
      setPageBox(getPageBox);
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
      <ButtonsGroup>
        <ToggleButton
          onClick={() => {
            handleToggleCheck("uncheck", !showUnchecked);
          }}
          label="Show Only Unchecked"
          controller={showUnchecked}
        />
        <ToggleButton
          onClick={() => {
            handleToggleCheck("check", !showChecked);
          }}
          label="Show Only Checked"
          controller={showChecked}
        />
        <ToggleButton
          onClick={() => {
            handleToggleCheck("all", !showAllCheckedAndUnchecked);
          }}
          label="Show All"
          controller={showAllCheckedAndUnchecked}
        />
      </ButtonsGroup>
      <HuntGameSelect />
      {pageBox !== undefined && (
        <>
          <h2>{pageBox.name}</h2>
          {
            <BoxGridLayout>
              {pageBox.pokemon !== undefined && pageBox.pokemon.length > 0 && (
                <Box
                  imageSource="home"
                  isCheckable
                  pokemonListShown={pageBox.pokemon}
                />
              )}
              {isLoading && <BoxLoading />}
            </BoxGridLayout>
          }
        </>
      )}
    </div>
  );
}
