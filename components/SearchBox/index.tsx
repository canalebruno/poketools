import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Pokemon } from "../../utils/Interfaces";
import { handleName } from "../../utils/NameFormatting";

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
  const { windowWidth } = useWindowSize();

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
    } else {
      setHighlightPokemon("");
    }
  }

  useEffect(() => {
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
            label: handleName(
              pkmn,
              router.pathname !== "/" ||
                (router.pathname === "/" && pkmn.paldeaDex! < 500),
              router.pathname === "/" ? "Paldean" : "National",
              false
            ),
            id: pkmn.id,
          };
        })
    );
  }, [pokedex]);

  const searchWidth = windowWidth > 720 ? 300 : "100%";

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
      sx={{ width: searchWidth }}
      renderInput={(params) => <TextField {...params} label="Pokémon" />}
    />
  );
}
