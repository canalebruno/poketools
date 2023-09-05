import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import { handleName } from "../../utils/NameFormatting";
import styles from "./styles.module.scss";
import { Pokemon } from "../../utils/types";
import { useRouter } from "next/router";
import Image from "next/image";
import InputContainer from "../Inputs/InputContainer";

interface SelectAddRemovePokemonProps {
  kind: "add" | "remove";
  pokemonList: Pokemon[];
}

export default function SelectAddRemovePokemon({
  kind,
  pokemonList,
}: SelectAddRemovePokemonProps) {
  const { handleAddPokemon, handleRemovePokemon, pokedexShown, fullShinyDex } =
    usePokedex();

  const [term, setTerm] = useState("");
  const [filteredDex, setFilteredDex] = useState(pokedexShown);
  const [addShiny, setAddShiny] = useState(false);
  const [fullList, setFullList] = useState();
  const { route } = useRouter();

  useEffect(() => {
    if (term === "") {
      setFilteredDex(pokemonList);
    } else {
      const newFilter = pokemonList.filter((pokemon) => {
        return handleName(pokemon, true, "National", true)
          .toLowerCase()
          .includes(term.toLowerCase());
      });

      setFilteredDex(newFilter);
    }
  }, [term, pokemonList]);

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
          checked={addShiny}
          onChange={() => setAddShiny(!addShiny)}
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
                  if (kind === "remove") {
                    handleRemovePokemon(pokemon.customBoxId);
                  } else {
                    handleAddPokemon(pokemon.id, addShiny);
                  }
                }}
                id={pokemon.id}
              >
                <Image
                  unoptimized
                  width={100}
                  height={100}
                  src={`/home/${pokemon.homeShinyPic}`}
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
