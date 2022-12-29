import { Pokemon } from "./Interfaces";

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
  dex: "Paldean" | "National" = "National",
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
    if (dex === "Paldean") {
      prefixNumber = "#" + handleNumber(pokemon.paldeaDex!, 3) + " - ";
    } else {
      prefixNumber = "#" + handleNumber(pokemon.nationalDex, 3) + " - ";
    }
  }

  return `${prefixNumber}${prefixName}${pokemon.name}`;
}
