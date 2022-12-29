import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import { Pokemon } from "../../utils/Interfaces";

interface Option {
  label: string;
  id: string;
}

export default function SearchBox() {
  const [term, setTerm] = useState("");
  const [value, setValue] = useState<Option | null>(null);
  const [options, setOptions] = useState([] as Option[]);

  const router = useRouter();

  const { setHighlightPokemon, pokedex } = usePokedex();

  function handleNumber(pokemonNumber: number, charQuantity: 3 | 4) {
    let stringNumber = String(pokemonNumber);

    if (stringNumber.length < charQuantity) {
      for (let i = stringNumber.length; i < charQuantity; i++) {
        stringNumber = "0" + stringNumber;
      }
    }

    return stringNumber;
  }

  function handleName(pokemon: Pokemon, number: boolean = false) {
    let prefixName = "";
    let prefixNumber = "";

    if (pokemon.generalForm !== "") {
      prefixName += pokemon.generalForm + " ";
    }

    if (pokemon.uniqueForm !== "") {
      prefixName += pokemon.uniqueForm + " ";
    }

    if (pokemon.genderDifference) {
      prefixName += "Female ";
    }

    if (number) {
      if (router.pathname === "/") {
        prefixNumber = "#" + handleNumber(pokemon.paldeaDex!, 3) + " - ";
      } else {
        prefixNumber = "#" + handleNumber(pokemon.nationalDex, 3) + " - ";
      }
    }

    return `${prefixNumber}${prefixName}${pokemon.name}`;
  }

  function handleSearch(
    event: React.FormEvent<HTMLButtonElement>,
    newValue: Option | null
  ) {
    event.preventDefault();
    setValue(newValue);
    if (newValue) {
      const element = document.getElementById(newValue.id);
      let offset = window.pageYOffset - 50;
      if (element) {
        offset += element.getBoundingClientRect().top;
      }
      window.scrollTo({ top: offset, behavior: "smooth" });
      setHighlightPokemon(newValue.id);
    }
  }

  useEffect(() => {
    console.log(pokedex);
    setOptions(
      pokedex
        .filter((pkmn) => {
          switch (router.pathname) {
            case "/":
              return (
                (pkmn.formOrder === "00" ||
                  pkmn.id === "128_01" ||
                  pkmn.id === "194_01") &&
                !pkmn.genderDifference
              );
            default:
              return pkmn.formOrder === "00" && !pkmn.genderDifference;
          }
        })
        .map((pkmn) => {
          return {
            label: handleName(pkmn, true),
            id: pkmn.id,
          };
        })
    );
  }, [pokedex]);

  return (
    <Autocomplete
      disablePortal
      value={value}
      onChange={(event: any, newValue: Option | null) => {
        handleSearch(event, newValue);
      }}
      inputValue={term}
      onInputChange={(event, newInputValue) => {
        setTerm(newInputValue);
      }}
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Pokémon" />}
    />
  );
}
