import styles from "../styles/Nuzlocke.module.scss";
import nuzlockeJson from "../json/nuzlocke.json";
import pokedex from "../json/nationalDex.json";
import { useState } from "react";
import { Pokemon } from "../utils/Interfaces";
import LocationCard from "../components/LocationCard";
import NuzlockeFilterControl from "../components/NuzlockeFilterControl";
import Button from "@mui/material/Button";

interface Hunt {
  id: number;
  name: string;
  pokemon: Pokemon | undefined;
}

export default function HomeBoxes() {
  const [hunt, setHunt] = useState([] as Hunt[]);

  function handleGenerateNuzlockHunt() {
    const huntGenerator = nuzlockeJson
      .sort((a, b) => {
        return a.id - b.id;
      })
      .map((loc) => {
        return {
          id: loc.id,
          name: loc.name,
          pokemon: randomPokemon([
            ...loc.general,
            ...loc.violet,
            ...loc.scarlet,
          ]),
        };
      });

    setHunt(huntGenerator);
  }

  function randomPokemon(options: string[]) {
    const quantity = options.length;

    const randomIndex = Math.floor(Math.random() * quantity);

    const randomPokemon = options[randomIndex];

    const pokemon = pokedex.find((pkmn) => {
      return pkmn.id === randomPokemon;
    });

    return pokemon;
  }

  return (
    <div className={styles.container}>
      <NuzlockeFilterControl />
      <Button
        sx={{ marginTop: "2rem", fontSize: "1.25rem" }}
        variant="contained"
        onClick={handleGenerateNuzlockHunt}
      >
        Generate
      </Button>
      <div className={styles.cardsGrid}>
        {hunt &&
          hunt.map((item) => {
            return (
              <LocationCard
                name={item.name}
                pokemon={item.pokemon && item.pokemon}
              />
            );
          })}
      </div>
    </div>
  );
}
