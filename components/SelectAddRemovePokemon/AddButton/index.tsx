import { usePokedex } from "../../../hooks/usePokedex";
import { useState, useEffect } from "react";
import { Pokemon } from "../../../utils/types";
import { useRouter } from "next/router";
import { handleName } from "../../../utils/NameFormatting";
import styles from "../styles.module.scss";
import TextField from "@mui/material/TextField";

export default function AddPokemonButton() {
  const { handleAddPokemon, handleRemovePokemon, pokedexShown, fullShinyDex } =
    usePokedex();

  const [term, setTerm] = useState("");
  const [loadedList, setLoadedList] = useState<Pokemon[]>([] as Pokemon[]);
  const [filteredDex, setFilteredDex] = useState(pokedexShown);
  const [fullList, setFullList] = useState();
  const { route } = useRouter();

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
