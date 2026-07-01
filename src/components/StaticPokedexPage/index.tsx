"use client";

import { usePokedex } from "@/hooks/usePokedex";
import Box from "../Box";
import BoxGridLayout from "../BoxGridLayout";
import BoxLoading from "../BoxLoading";
import FilterControl from "../FilterControl";
import SearchBox from "../Inputs/SearchBox";
import { Pokemon, SortingList } from "@/utils/types";
import { useEffect } from "react";

interface StaticPokedexPageProps {
  sortingDefault: SortingList;
  pokedex: Pokemon[];
  imageSource?: "svicons" | "home";
}

export default function StaticPokedexPage({
  pokedex = [] as Pokemon[],
  sortingDefault,
  imageSource = "svicons",
}: StaticPokedexPageProps) {
  const { loadPokedex } = usePokedex();

  useEffect(() => {
    if (pokedex) {
      // Pass the server-side array and the page configuration sortingDefault string down
      loadPokedex(pokedex, sortingDefault);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokedex, sortingDefault]);

  return (
    <>
      <FilterControl sortingDefault={sortingDefault} />
      <SearchBox />
      <BoxGridLayout>
        {pokedex.length > 0 ? (
          <Box pokemonListShown={pokedex} imageSource={imageSource} />
        ) : (
          <BoxLoading />
        )}
      </BoxGridLayout>
    </>
  );
}
