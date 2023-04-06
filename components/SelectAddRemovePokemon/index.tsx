import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import { handleName } from "../../utils/NameFormatting";
import styles from "./styles.module.scss";
import { useShinyHunting } from "../../hooks/useShinyHunting";

interface SelectAddRemovePokemonProps {
  remove?: boolean;
}

export default function SelectAddRemovePokemon({
  remove = false,
}: SelectAddRemovePokemonProps) {
  const { pokedex } = usePokedex();
  const { handleAddPokemon, handleRemovePokemon, activeList } =
    useShinyHunting();

  const [term, setTerm] = useState("");
  const [filteredDex, setFilteredDex] = useState(pokedex);

  const pokemonList = remove ? activeList.pokemon : pokedex;

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
    <div>
      <TextField
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
                className={styles.listCard}
                onClick={() => {
                  remove
                    ? handleRemovePokemon(pokemon.id)
                    : handleAddPokemon(pokemon.id);
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
