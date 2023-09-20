import { usePokedex } from "../../../hooks/usePokedex";
import { useState, useEffect } from "react";
import { Pokemon } from "../../../utils/types";
import { useRouter } from "next/router";
import { handleName } from "../../../utils/NameFormatting";
import styles from "../styles.module.scss";
import Image from "next/image";
import InputContainer from "../../Inputs/InputContainer";
import List from "../../Modal/BoxBuilder/List";

export default function AddPokemonButton() {
  const { handleAddPokemon, pokedexShown, fullPokedex, sortByNationalDex } =
    usePokedex();

  const [term, setTerm] = useState("");
  // const [loadedList, setLoadedList] = useState<Pokemon[]>([] as Pokemon[]);
  const [filteredDex, setFilteredDex] = useState(pokedexShown);
  const [isShiny, setIsShiny] = useState(false);

  // const fetchUserData = () => {
  //   fetch("/api/shinydex")
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setLoadedList(data);
  //     });
  // };

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  useEffect(() => {
    if (term === "") {
      setFilteredDex(fullPokedex);
    } else {
      const newFilter = fullPokedex.filter((pokemon) => {
        return handleName(pokemon, true, "National", true)
          .toLowerCase()
          .includes(term.toLowerCase());
      });

      setFilteredDex(newFilter);
    }
  }, [term, fullPokedex]);

  return (
    <div className={styles.container}>
      <InputContainer fullWidth label="Pokémon" valueOn={term}>
        <input
          type="text"
          placeholder="Pokémon"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
          }}
        />
      </InputContainer>
      <InputContainer label="Add Shiny" valueOn={"s"}>
        <input
          type="checkbox"
          checked={isShiny}
          onChange={() => setIsShiny(!isShiny)}
        />
      </InputContainer>
      <List isShiny={isShiny} listShown={filteredDex} />
    </div>
  );
}
