import { createContext, ReactNode, useContext, useState } from "react";
import { Pokemon } from "../utils/Interfaces";
import nuzlockeJsonPoor from "../json/nuzlocke.json";
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

  const nuzlockeJson = nuzlockeJsonPoor.map((loc) => {
    return {
      id: loc.id,
      name: loc.name,
      general: loc.general.map((pkmnId) => {
        return pokedex.find((pkmn) => {
          return pkmn.id === pkmnId;
        });
      }),
      scarlet: loc.scarlet.map((pkmnId) => {
        return pokedex.find((pkmn) => {
          return pkmn.id === pkmnId;
        });
      }),
      violet: loc.violet.map((pkmnId) => {
        return pokedex.find((pkmn) => {
          return pkmn.id === pkmnId;
        });
      }),
    };
  });

  function handleGenerateNuzlockeHunt() {
    const huntGenerator = nuzlockeJson
      .sort((a, b) => {
        return a.id - b.id;
      })
      .map((loc) => {
        let pokemon;

        if (gameExclusive.includes("tradable")) {
          pokemon = randomPokemon(
            filterAvailablePokemon([
              ...loc.general,
              ...loc.violet,
              ...loc.scarlet,
            ])
          );
        } else if (gameExclusive.includes("scarlet")) {
          pokemon = randomPokemon(
            filterAvailablePokemon([...loc.general, ...loc.scarlet])
          );
        } else if (gameExclusive.includes("violet")) {
          pokemon = randomPokemon(
            filterAvailablePokemon([...loc.general, ...loc.violet])
          );
        } else {
          pokemon = undefined;
        }

        return {
          id: loc.id,
          name: loc.name,
          pokemon,
        };
      });

    setHunt(huntGenerator);
  }

  function randomPokemon(options: Pokemon[]) {
    const quantity = options.length;

    const randomIndex = Math.floor(Math.random() * quantity);

    return options[randomIndex];
  }

  function filterAvailablePokemon(pokemon: Pokemon[] | any) {
    let availablePokemon = pokemon;

    if (customOptions.includes("basic")) {
      availablePokemon = filterFirstStage(availablePokemon);
    }

    if (!customOptions.includes("repeat")) {
    }

    if (customOptions.includes("newGen")) {
      availablePokemon = filterNewGen(availablePokemon);
    }

    return availablePokemon;
  }

  function filterNewGen(pokemon: Pokemon[]) {
    return pokemon.filter((pkmn) => {
      const crossGenPokemon = [
        "194_01",
        "128_01",
        "128_02",
        "128_03",
        "056_00",
        "057_00",
        "203_00",
        "206_00",
        "624_00",
        "625_00",
      ];

      return pkmn.nationalDex > 905 || crossGenPokemon.includes(pkmn.id);
    });
  }

  function filterFirstStage(pokemon: Pokemon[]) {
    return pokemon.filter((pkmn) => {
      return pkmn.stage < 0 || (pkmn.stage === 0 && !pkmn.hasBaby);
    });
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
