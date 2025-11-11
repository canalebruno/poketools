"use client";

import { useController } from "@/hooks/useController";
import Head from "next/head";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Box from "../../../../components/Box";
import BoxGridLayout from "../../../../components/BoxGridLayout";
import BoxLoading from "../../../../components/BoxLoading";
import ButtonsGroup from "../../../../components/ButtonsGroup";
import ToggleButton from "../../../../components/ButtonsGroup/ToggleButton";
import FilterControl from "../../../../components/FilterControl";
import HuntGameSelect from "../../../../components/HuntGameSelect";
import HuntControl from "../../../../components/ShinyTrackerControl";
import { usePokedex } from "../../../../hooks/usePokedex";
import styles from "../../../styles/Home.module.scss";

export default function CustomBoxTracker() {
  const { listId } = useParams();

  const {
    setPageBox,
    customBoxes,
    pageBox,
    showChecked,
    showUnchecked,
    handleToggleCheck,
    showAllCheckedAndUnchecked,
    fullPokedex,
  } = usePokedex();

  const { loggedUser } = useController();

  const { getByFullPokedex } = useController();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (customBoxes) {
      setIsLoading(false);
    }

    if (fullPokedex.length < 1) {
      getByFullPokedex();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getPageBox = loggedUser?.boxes?.find((box) => box.id === listId);

    if (getPageBox !== undefined) {
      setIsLoading(false);

      setPageBox(getPageBox);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customBoxes, listId]);

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
                <>
                  <Box
                    imageSource="home"
                    isCheckable
                    pokemonListShown={pageBox.pokemon}
                  />
                </>
              )}
              {isLoading && <BoxLoading />}
            </BoxGridLayout>
          }
        </>
      )}
    </div>
  );
}
