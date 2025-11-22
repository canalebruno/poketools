import Box from "../Box";
import BoxGridLayout from "../BoxGridLayout";
import BoxLoading from "../BoxLoading";
import FilterControl from "../FilterControl";
import SearchBox from "../Inputs/SearchBox";
import { Pokemon } from "@/utils/types";

interface StaticPokedexPageProps {
  sortingDefault:
    | "paldean"
    | "national"
    | "hisuian"
    | "galarian"
    | "galarian-ioa"
    | "galarian-ct"
    | "paldean-tm"
    | "paldean-bb";
  pokedex: Pokemon[];
}

export default function StaticPokedexPage({
  pokedex = [] as Pokemon[],
  sortingDefault,
}: StaticPokedexPageProps) {
  return (
    <>
      <FilterControl sortingDefault={sortingDefault} />
      <SearchBox />
      <BoxGridLayout>
        {pokedex.length > 0 ? (
          <Box pokemonListShown={pokedex} imageSource="svicons" />
        ) : (
          <BoxLoading />
        )}
      </BoxGridLayout>
    </>
  );
}
