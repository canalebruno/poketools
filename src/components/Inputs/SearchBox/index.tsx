"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePokedex } from "../../../hooks/usePokedex";
import { handleName } from "../../../utils/NameFormatting";
import InputContainer from "../InputContainer";

interface Option {
  label: string;
  id: string;
}

export default function SearchBox() {
  const [term, setTerm] = useState("");
  const [options, setOptions] = useState([] as Option[]);

  const pathname = usePathname();

  const { setHighlightPokemon, pokedexShown } = usePokedex();

  function handleSearch(value: string) {
    setTerm(value);

    const findPokemon = options.find((pkmn) => {
      return pkmn.label === value;
    });

    if (findPokemon) {
      const element = document.getElementById(findPokemon.id);
      let offset = window.scrollY - 50;
      if (element) {
        offset += element.getBoundingClientRect().top;
      }
      window.scrollTo({ top: offset, behavior: "smooth" });
      setHighlightPokemon(findPokemon.id);
    } else {
      setHighlightPokemon("");
    }
  }

  useEffect(() => {
    if (pokedexShown) {
      setOptions(
        pokedexShown
          .filter((pkmn) => {
            switch (pathname) {
              case "/svboxes":
                return (
                  (pkmn.formOrder === "00" ||
                    pkmn.id === "128_01" ||
                    pkmn.id === "194_01") &&
                  !pkmn.data.genderDifference
                );
              default:
                return pkmn.formOrder === "00" && !pkmn.data.genderDifference;
            }
          })
          .map((pkmn) => {
            return {
              label: handleName(
                pkmn,
                pathname !== "/svboxes" ||
                  (pathname === "/svboxes" && pkmn.dex.paldeaDex! < 500),
                pathname === "/svboxes" ? "Paldean" : "National",
                false
              ),
              id: pkmn.id,
            };
          })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokedexShown]);

  return (
    <InputContainer label="Pokémon" valueOn={term}>
      <input
        type="text"
        list="pokemon"
        placeholder="Pokémon"
        value={term}
        onChange={(event) => {
          handleSearch(event.target.value);
        }}
      />
      <datalist id="pokemon">
        {options.map((option) => {
          return <option key={option.id} value={option.label} />;
        })}
      </datalist>
    </InputContainer>
  );
}
