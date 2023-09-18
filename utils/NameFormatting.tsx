import { useRouter } from "next/router";
import { Pokemon } from "./types";

export function handleNumber(pokemonNumber: number, charQuantity: 3 | 4) {
  let stringNumber = String(pokemonNumber);

  if (stringNumber.length < charQuantity) {
    for (let i = stringNumber.length; i < charQuantity; i++) {
      stringNumber = "0" + stringNumber;
    }
  }

  return stringNumber;
}

export function handleName(
  pokemon: Pokemon,
  number: boolean = false,
  dex: string,
  form: boolean = true
) {
  let prefixName = "";
  let prefixNumber = "";

  if (form) {
    if (pokemon.generalForm !== "") {
      prefixName += pokemon.generalForm + " ";
    }

    if (pokemon.uniqueForm !== "") {
      prefixName += pokemon.uniqueForm + " ";
    }

    if (pokemon.genderDifference) {
      prefixName += "Female ";
    }
  }

  if (number) {
    switch (dex) {
      case "/svboxes":
        prefixNumber = "#" + handleNumber(pokemon.paldeaDex!, 3) + " - ";
        break;
      case "/teal-mask-boxes":
        prefixNumber = "#" + handleNumber(pokemon.paldeaTMDex!, 3) + " - ";
        break;
      default:
        prefixNumber = "#" + handleNumber(pokemon.nationalDex, 4) + " - ";
    }
  }

  return `${prefixNumber}${prefixName}${pokemon.name}`;
}
