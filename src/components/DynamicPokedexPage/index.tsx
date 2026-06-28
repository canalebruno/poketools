"use client"; // IMPORTANT: Must be uncommented

import { useEffect, useRef } from "react"; // Add this
import { usePokedex } from "@/hooks/usePokedex"; // Uncomment this
import Box from "../Box";
import BoxGridLayout from "../BoxGridLayout";
import FilterControl from "../FilterControl";
import { List } from "@/utils/types";
import ShinyTrackerControl from "../ShinyTrackerControl";

interface DynamicPokedexPageProps {
  pokedex: List;
}

export default function DynamicPokedexPage({
  pokedex,
}: DynamicPokedexPageProps) {
  // 1. Get the setter from your hook
  const { setPageBox, pageBox } = usePokedex();

  // 2. Sync the incoming server data with your global hook state
  const isInitialized = useRef(false);

  useEffect(() => {
    if (pokedex && !isInitialized.current) {
      setPageBox(pokedex);
      isInitialized.current = true; // Locks it so it won't overwrite local changes
    }
  }, [pokedex, setPageBox]);

  return (
    <>
      <ShinyTrackerControl />
      <FilterControl sortingDefault="national" />

      {pokedex && (
        <>
          <h2>{pokedex.name}</h2>
          <BoxGridLayout>
            {pokedex.pokemon?.length > 0 && (
              <Box
                imageSource="home"
                isCheckable
                pokemonListShown={pageBox?.pokemon || pokedex.pokemon}
              />
            )}
          </BoxGridLayout>
        </>
      )}
    </>
  );
}
