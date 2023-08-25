import { usePokedex } from "../../../hooks/usePokedex";
import { useState, useEffect } from "react";
import { Pokemon } from "../../../utils/types";
import { useRouter } from "next/router";
import { handleName } from "../../../utils/NameFormatting";
import styles from "../styles.module.scss";
import Image from "next/image";
import InputContainer from "../../Inputs/InputContainer";

export default function AddPokemonButton() {
  const { handleAddPokemon, pokedexShown } = usePokedex();

  const [term, setTerm] = useState("");
  const [loadedList, setLoadedList] = useState<Pokemon[]>([] as Pokemon[]);
  const [filteredDex, setFilteredDex] = useState(pokedexShown);
  const [isShiny, setIsShiny] = useState(false);

  const fetchUserData = () => {
    fetch("/api/shinydex")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setLoadedList(data);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (term === "") {
      setFilteredDex(loadedList);
    } else {
      const newFilter = loadedList.filter((pokemon) => {
        return handleName(pokemon, true, "National", true)
          .toLowerCase()
          .includes(term.toLowerCase());
      });

      setFilteredDex(newFilter);
    }
  }, [term, loadedList]);

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
      <div className={styles.listContainer}>
        {filteredDex &&
          filteredDex.map((pokemon) => {
            return (
              <button
                key={pokemon.id}
                className={styles.listCard}
                onClick={() => {
                  handleAddPokemon(pokemon.id, isShiny);
                }}
                id={pokemon.id}
              >
                <Image
                  unoptimized
                  width={100}
                  height={100}
                  src={`/home/${
                    isShiny ? pokemon.homeShinyPic : pokemon.homePic
                  }`}
                  alt={handleName(pokemon, false, "National", true)}
                />
                <span>{handleName(pokemon, true, "National", true)}</span>
              </button>
            );
          })}
      </div>
    </div>
  );
}
