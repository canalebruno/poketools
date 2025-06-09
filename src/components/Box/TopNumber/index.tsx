import { usePathname } from "next/navigation";
import { handleNumber } from "../../../utils/NameFormatting";
import { Pokemon, PokemonCustomBox } from "../../../utils/types";

interface TopNumberProps {
  pokemon?: Pokemon | PokemonCustomBox | null;
}

export default function TopNumber({ pokemon = null }: TopNumberProps) {
  const pathname = usePathname();

  let decimals: 3 | 4 = 4;
  let number: number | null = null;

  if (pokemon) {
    switch (pathname) {
      case "/svboxes":
        number =
          pokemon.dex.paldeaDex && pokemon.dex.paldeaDex <= 400
            ? pokemon.dex.paldeaDex
            : 400;
        decimals = 3;
        break;
      case "/teal-mask-boxes":
        number = pokemon.dex.paldeaTMDex;
        decimals = 3;
        break;
      default:
        if (pathname.includes("/tracker")) {
          number = null;
        } else {
          number = pokemon.dex.nationalDex;
          decimals = 4;
        }
    }
  }

  return pokemon && number ? (
    <span>{`#${handleNumber(number, decimals)}`}</span>
  ) : (
    <span />
  );
}
