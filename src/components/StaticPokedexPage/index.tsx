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
    | "paldean-bb"
    | "lumiose";
  pokedex: Pokemon[];
  imageSource?: "svicons" | "home";
}

export default function StaticPokedexPage({
  pokedex = [] as Pokemon[],
  sortingDefault,
  imageSource = "svicons",
}: StaticPokedexPageProps) {
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
