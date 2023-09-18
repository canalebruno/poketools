import { useRouter } from "next/router";
import { handleNumber } from "../../../utils/NameFormatting";
import { Pokemon, PokemonCustomBox } from "../../../utils/types";

interface TopNumberProps {
  pokemon: Pokemon | PokemonCustomBox;
}

export default function TopNumber({ pokemon }: TopNumberProps) {
  const router = useRouter();

  let decimals: 3 | 4;
  let number: number | null;

  switch (router.pathname) {
    case "/svboxes":
      number =
        pokemon.paldeaDex && pokemon.paldeaDex <= 400 ? pokemon.paldeaDex : 400;
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

  return number ? (
    <span>{`#${handleNumber(number, decimals)}`}</span>
  ) : (
    <span />
  );
}
