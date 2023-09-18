import { useRouter } from "next/router";
import { handleNumber } from "../../../utils/NameFormatting";
import { Pokemon, PokemonCustomBox } from "../../../utils/types";

interface TopNumberProps {
  pokemon?: Pokemon | PokemonCustomBox | null;
}

export default function TopNumber({ pokemon = null }: TopNumberProps) {
  const router = useRouter();

  let decimals: 3 | 4 = 4;
  let number: number | null = null;

  if (pokemon) {
    switch (router.pathname) {
      case "/svboxes":
        number =
          pokemon.paldeaDex && pokemon.paldeaDex <= 400
            ? pokemon.paldeaDex
            : 400;
        decimals = 3;
        break;
      case "/teal-mask-boxes":
        number = pokemon.paldeaTMDex;
        decimals = 3;
        break;
      default:
        number = pokemon.nationalDex;
        decimals = 4;
    }
  }

  return pokemon && number ? (
    <span>{`#${handleNumber(number, decimals)}`}</span>
  ) : (
    <span />
  );
}
