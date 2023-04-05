import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import { handleName } from "../../utils/NameFormatting";
import styles from "./styles.module.scss";
import { useShinyHunting } from "../../hooks/useShinyHunting";

export default function SelectAddPokemon() {
  const { pokedex } = usePokedex();
  const { handleAddPokemon } = useShinyHunting();

  const [term, setTerm] = useState("");
  const [filteredDex, setFilteredDex] = useState(pokedex);

  useEffect(() => {
    if (term === "") {
      setFilteredDex(pokedex);
    } else {
      const newFilter = pokedex.filter((pokemon) => {
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
                  handleAddPokemon(pokemon.id);
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
