import { createContext, ReactNode, useContext, useState } from "react";
import { Pokemon } from "../utils/Interfaces";
import nuzlockeJson from "../json/nuzlocke.json";
import pokedex from "../json/nationalDex.json";

interface NuzlockeProviderProps {
  children: ReactNode;
}

interface NuzlockeContextData {
  gameExclusive: string[];
  setGameExclusive: (value: string[]) => void;
  customOptions: string[];
  setCustomOptions: (value: string[]) => void;
  typeSelected: string;
  setTypeSelected: (value: string) => void;
  handleGenerateNuzlockeHunt: () => void;
  hunt: Hunt[];
}

interface Hunt {
  id: number;
  name: string;
  pokemon: Pokemon | undefined;
}

const NuzlockeContext = createContext<NuzlockeContextData>(
  {} as NuzlockeContextData
);

export function NuzlockeProvider({ children }: NuzlockeProviderProps) {
  const [gameExclusive, setGameExclusive] = useState(["tradable"]);
  const [customOptions, setCustomOptions] = useState(["repeat"]);
  const [typeSelected, setTypeSelected] = useState("all");
  const [hunt, setHunt] = useState([] as Hunt[]);

  function handleGenerateNuzlockeHunt() {
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
    <NuzlockeContext.Provider
      value={{
        gameExclusive,
        setGameExclusive,
        customOptions,
        setCustomOptions,
        typeSelected,
        setTypeSelected,
        handleGenerateNuzlockeHunt,
        hunt,
      }}
    >
      {children}
    </NuzlockeContext.Provider>
  );
}

export function useNuzlocke(): NuzlockeContextData {
  const context = useContext(NuzlockeContext);

  return context;
}
