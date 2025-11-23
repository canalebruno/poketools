// "use client";

import { useParams } from "next/navigation";
import Box from "../Box";
import BoxGridLayout from "../BoxGridLayout";
import BoxLoading from "../BoxLoading";
import ButtonsGroup from "../ButtonsGroup";
import ToggleButton from "../ButtonsGroup/ToggleButton";
import FilterControl from "../FilterControl";
import SearchBox from "../Inputs/SearchBox";
import { List, Pokemon } from "@/utils/types";
import { usePokedex } from "@/hooks/usePokedex";
import { useController } from "@/hooks/useController";
import { useEffect, useState } from "react";
import HuntGameSelect from "../HuntGameSelect";
import ShinyTrackerControl from "../ShinyTrackerControl";

interface DynamicPokedexPageProps {
  //   sortingDefault:
  //     | "paldean"
  //     | "national"
  //     | "hisuian"
  //     | "galarian"
  //     | "galarian-ioa"
  //     | "galarian-ct"
  //     | "paldean-tm"
  //     | "paldean-bb";
  pokedex: List;
  //   listId: string;
}

export default function DynamicPokedexPage({
  pokedex = {} as List,
}: //   listId,
DynamicPokedexPageProps) {
  //   const { listId } = useParams();
  //   const { loggedUser, getByFullPokedex, getStorageDex } = useController();

  //   const res = await fetch(
  //     `http://localhost:3000/api/tracker/${loggedUser.email}/${listId}`
  //   );
  //   console.log(
  //     `http://localhost:3000/api/tracker/${loggedUser.email}/${listId}`
  //   );
  //   const pokedex = await console.log(res.json());

  //   const {
  //     setPageBox,
  //     customBoxes,
  //     pageBox,
  //     showChecked,
  //     showUnchecked,
  //     handleToggleCheck,
  //     showAllCheckedAndUnchecked,
  //     fullPokedex,
  //   } = usePokedex();

  //   const { expandPokemonList } = usePokedex();
  //   const [isLoading, setIsLoading] = useState(true);

  //   useEffect(() => {
  //     if (customBoxes) {
  //       setIsLoading(false);
  //     }

  //     if (fullPokedex.length < 1) {
  //       getByFullPokedex();
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  //   useEffect(() => {
  //     const getPageBox = loggedUser?.boxes?.find((box) => box.id === listId);

  //     if (getPageBox !== undefined) {
  //       setIsLoading(false);

  //       setPageBox({
  //         ...getPageBox,
  //         pokemon: expandPokemonList(getPageBox.pokemon),
  //       });
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [customBoxes, listId]);

  return (
    <>
      <ShinyTrackerControl />
      <FilterControl sortingDefault="national" />
      {/* <ButtonsGroup>
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
      </ButtonsGroup> */}
      {/* <HuntGameSelect /> */}
      {pokedex !== undefined && (
        <>
          <h2>{pokedex.name}</h2>
          {
            <BoxGridLayout>
              {pokedex.pokemon !== undefined && pokedex.pokemon.length > 0 && (
                <>
                  <Box
                    imageSource="home"
                    isCheckable
                    pokemonListShown={pokedex.pokemon}
                  />
                </>
              )}
              {/* {isLoading && <BoxLoading />} */}
            </BoxGridLayout>
          }
        </>
      )}
    </>
  );
}
