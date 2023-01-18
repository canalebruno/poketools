import { createContext, ReactNode, useContext, useState } from "react";
import { Pokemon } from "../utils/types";
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

  let notRepeatablePokemon = [] as number[];

  const pokemonTypes = [
    "bug",
    "dark",
    "dragon",
    "electric",
    "fairy",
    "fighting",
    "fire",
    "flying",
    "ghost",
    "grass",
    "ground",
    "ice",
    "normal",
    "poison",
    "psychic",
    "rock",
    "steel",
    "water",
  ];

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
    notRepeatablePokemon = [] as number[];

    let filteredType = typeSelected;

    if (typeSelected === "random") {
      filteredType = generateRandomType();
    }

    const huntGenerator = nuzlockeJson
      .sort((a, b) => {
        return a.id - b.id;
      })
      .map((loc) => {
        let pokemon;

        if (gameExclusive.includes("tradable")) {
          pokemon = randomPokemon(
            filterAvailablePokemon(
              [...loc.general, ...loc.violet, ...loc.scarlet],
              filteredType
            )
          );
        } else if (gameExclusive.includes("scarlet")) {
          pokemon = randomPokemon(
            filterAvailablePokemon(
              [...loc.general, ...loc.scarlet],
              filteredType
            )
          );
        } else if (gameExclusive.includes("violet")) {
          pokemon = randomPokemon(
            filterAvailablePokemon(
              [...loc.general, ...loc.violet],
              filteredType
            )
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

    if (options[randomIndex] === undefined) {
      return undefined;
    }

    if (!customOptions.includes("repeat")) {
      notRepeatablePokemon = [
        ...notRepeatablePokemon,
        ...options[randomIndex].family,
      ];
    }

    return options[randomIndex];
  }

  function filterAvailablePokemon(pokemon: Pokemon[] | any, type: string) {
    let availablePokemon = pokemon;

    if (typeSelected !== "all") {
      availablePokemon = filterByType(availablePokemon, type);
    }

    if (!customOptions.includes("repeat")) {
      availablePokemon = filterDontRepeat(availablePokemon);
    }

    if (customOptions.includes("basic")) {
      availablePokemon = filterFirstStage(availablePokemon);
    }

    if (customOptions.includes("newGen")) {
      availablePokemon = filterNewGen(availablePokemon);
    }

    return availablePokemon;
  }

  function filterNewGen(pokemon: Pokemon[] | undefined) {
    if (pokemon === undefined) {
      return undefined;
    }

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

  function filterFirstStage(pokemon: Pokemon[] | undefined) {
    if (pokemon === undefined) {
      return undefined;
    }

    return pokemon.filter((pkmn) => {
      return pkmn.stage < 0 || (pkmn.stage === 0 && !pkmn.hasBaby);
    });
  }

  function filterDontRepeat(pokemon: Pokemon[] | undefined) {
    if (pokemon === undefined) {
      return undefined;
    }

    let locationPokemon = pokemon;

    return locationPokemon.filter((pkmn) => {
      return !notRepeatablePokemon.includes(pkmn.nationalDex);
    });
  }

  function filterByType(pokemon: Pokemon[] | undefined, type: string) {
    if (pokemon === undefined) {
      return undefined;
    }

    let pokemonByType;

    if (type === "dark") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "133_00" ||
          pkmn.id === "246_00" ||
          pkmn.id === "331_00" ||
          pkmn.id === "906_00" ||
          pkmn.id === "907_00" ||
          pkmn.id === "919_00" ||
          pkmn.id === "247_00"
        );
      });
    } else if (type === "dragon") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "333_00" ||
          pkmn.id === "690_00"
        );
      });
    } else if (type === "electric") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "133_00"
        );
      });
    } else if (type === "fairy") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "133_00" ||
          pkmn.id === "856_00" ||
          pkmn.id === "857_00"
        );
      });
    } else if (type === "fighting") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "280_00" ||
          pkmn.id === "281_00" ||
          pkmn.id === "912_00" ||
          pkmn.id === "913_00" ||
          pkmn.id === "921_00" ||
          pkmn.id === "285_00"
        );
      });
    } else if (type === "fire") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "951_00" ||
          pkmn.id === "837_00" ||
          pkmn.id === "661_00" ||
          pkmn.id === "133_00"
        );
      });
    } else if (type === "flying") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "147_00" ||
          pkmn.id === "148_00" ||
          pkmn.id === "283_00" ||
          pkmn.id === "371_00" ||
          pkmn.id === "372_00" ||
          pkmn.id === "664_00" ||
          pkmn.id === "665_00" ||
          pkmn.id === "129_00"
        );
      });
    } else if (type === "ghost") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "056_00" ||
          pkmn.id === "361_00" ||
          pkmn.id === "935_00" ||
          pkmn.id === "057_00"
        );
      });
    } else if (type === "grass") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "133_00"
        );
      });
    } else if (type === "ground") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "422_00"
        );
      });
    } else if (type === "ice") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "133_00" ||
          pkmn.id === "090_00"
        );
      });
    } else if (type === "psychic") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "953_00" ||
          pkmn.id === "935_00" ||
          pkmn.id === "133_00"
        );
      });
    } else if (type === "rock") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "833_00"
        );
      });
    } else if (type === "steel") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "204_00" ||
          pkmn.id === "447_00" ||
          pkmn.id === "821_00" ||
          pkmn.id === "822_00" ||
          pkmn.id === "999_00" ||
          pkmn.id === "123_00"
        );
      });
    } else if (type === "water") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type ||
          pkmn.type2.toLowerCase() === type ||
          pkmn.id === "133_00"
        );
      });
    } else {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.type1.toLowerCase() === type || pkmn.type2.toLowerCase() === type
        );
      });
    }

    return pokemonByType;
  }

  function generateRandomType() {
    const randomIndex = Math.floor(Math.random() * pokemonTypes.length);

    return pokemonTypes[randomIndex];
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
