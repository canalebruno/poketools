import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import { handleName } from "../../utils/NameFormatting";
import styles from "./styles.module.scss";
import { useShinyTracker } from "../../hooks/useShinyTracker";
import { Pokemon } from "../../utils/types";

interface SelectAddRemovePokemonProps {
  kind: "add" | "remove";
}

export default function SelectAddRemovePokemon({
  kind,
}: SelectAddRemovePokemonProps) {
  const { pokedex } = usePokedex();
  const { handleAddPokemon, handleRemovePokemon, activeList } =
    useShinyTracker();

  const [term, setTerm] = useState("");
  const [filteredDex, setFilteredDex] = useState(pokedex);

  let pokemonList = [] as Pokemon[];

  if (kind === "remove") {
    pokemonList = activeList.pokemon;
  } else {
    pokemonList = pokedex;
  }

  useEffect(() => {
    if (term === "") {
      setFilteredDex(pokemonList);
    } else {
      const newFilter = pokemonList.filter((pokemon) => {
        return handleName(pokemon, true, "National", true)
          .toLowerCase()
          .includes(term);
      });

      setFilteredDex(newFilter);
    }
  }, [term]);

  return (
    <div className={styles.container}>
      <TextField
        fullWidth
        id="searchBox"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
        }}
        label="Pokémon"
        variant="outlined"
      />
      <div className={styles.listContainer}>
        {filteredDex &&
          filteredDex.map((pokemon) => {
            return (
              <button
                key={pokemon.id}
                className={styles.listCard}
                onClick={() => {
                  if (kind === "remove") {
                    handleRemovePokemon(pokemon.id);
                  } else {
                    handleAddPokemon(pokemon.id);
                  }
                }}
                id={pokemon.id}
              >
                <img
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
