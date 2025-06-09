"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { Pokemon, SVLocation } from "../utils/types";
import { GetServerSideProps } from "next";

interface NuzlockeProviderProps {
  children: ReactNode;
}

interface SVLocationUpdated {
  id: number;
  name: string;
  general: (Pokemon | undefined)[];
  scarlet: (Pokemon | undefined)[];
  violet: (Pokemon | undefined)[];
}

interface NuzlockeContextData {
  gameExclusive: string;
  setGameExclusive: (value: string) => void;
  customOptions: string[];
  setCustomOptions: (value: string[]) => void;
  typeSelected: string;
  setTypeSelected: (value: string) => void;
  handleGenerateNuzlockeHunt: () => void;
  hunt: Hunt[];
  nuzlockeJson: SVLocationUpdated[];
  setNuzlockeJson: (json: SVLocationUpdated[]) => void;
  pokemonTypes: string[];
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
  const [gameExclusive, setGameExclusive] = useState("tradable");
  const [customOptions, setCustomOptions] = useState(["repeat"]);
  const [typeSelected, setTypeSelected] = useState("all");
  const [hunt, setHunt] = useState([] as Hunt[]);
  const [nuzlockeJson, setNuzlockeJson] = useState([] as SVLocationUpdated[]);

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

        if (gameExclusive === "tradable") {
          pokemon = randomPokemon(
            filterAvailablePokemon(
              [...loc.general, ...loc.violet, ...loc.scarlet],
              filteredType
            )
          );
        } else if (gameExclusive === "scarlet") {
          pokemon = randomPokemon(
            filterAvailablePokemon(
              [...loc.general, ...loc.scarlet],
              filteredType
            )
          );
        } else if (gameExclusive === "violet") {
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
        ...options[randomIndex].data.family,
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

      return pkmn.dex.nationalDex > 905 || crossGenPokemon.includes(pkmn.id);
    });
  }

  function filterFirstStage(pokemon: Pokemon[] | undefined) {
    if (pokemon === undefined) {
      return undefined;
    }

    return pokemon.filter((pkmn) => {
      return (
        pkmn.data.stage < 0 || (pkmn.data.stage === 0 && !pkmn.data.hasBaby)
      );
    });
  }

  function filterDontRepeat(pokemon: Pokemon[] | undefined) {
    if (pokemon === undefined) {
      return undefined;
    }

    let locationPokemon = pokemon;

    return locationPokemon.filter((pkmn) => {
      return !notRepeatablePokemon.includes(pkmn.dex.nationalDex);
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
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0133_00" ||
          pkmn.id === "0246_00" ||
          pkmn.id === "0331_00" ||
          pkmn.id === "0906_00" ||
          pkmn.id === "0907_00" ||
          pkmn.id === "0919_00" ||
          pkmn.id === "0247_00"
        );
      });
    } else if (type === "dragon") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0333_00" ||
          pkmn.id === "0690_00"
        );
      });
    } else if (type === "electric") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0133_00"
        );
      });
    } else if (type === "fairy") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0133_00" ||
          pkmn.id === "0856_00" ||
          pkmn.id === "0857_00"
        );
      });
    } else if (type === "fighting") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0280_00" ||
          pkmn.id === "0281_00" ||
          pkmn.id === "0912_00" ||
          pkmn.id === "0913_00" ||
          pkmn.id === "0921_00" ||
          pkmn.id === "0285_00"
        );
      });
    } else if (type === "fire") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0951_00" ||
          pkmn.id === "0837_00" ||
          pkmn.id === "0661_00" ||
          pkmn.id === "0133_00"
        );
      });
    } else if (type === "flying") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0147_00" ||
          pkmn.id === "0148_00" ||
          pkmn.id === "0283_00" ||
          pkmn.id === "0371_00" ||
          pkmn.id === "0372_00" ||
          pkmn.id === "0664_00" ||
          pkmn.id === "0665_00" ||
          pkmn.id === "0129_00"
        );
      });
    } else if (type === "ghost") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0056_00" ||
          pkmn.id === "0361_00" ||
          pkmn.id === "0935_00" ||
          pkmn.id === "0057_00"
        );
      });
    } else if (type === "grass") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0133_00"
        );
      });
    } else if (type === "ground") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0422_00"
        );
      });
    } else if (type === "ice") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0133_00" ||
          pkmn.id === "0090_00"
        );
      });
    } else if (type === "psychic") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0953_00" ||
          pkmn.id === "0935_00" ||
          pkmn.id === "0133_00"
        );
      });
    } else if (type === "rock") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0833_00"
        );
      });
    } else if (type === "steel") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0204_00" ||
          pkmn.id === "0447_00" ||
          pkmn.id === "0821_00" ||
          pkmn.id === "0822_00" ||
          pkmn.id === "0999_00" ||
          pkmn.id === "0123_00"
        );
      });
    } else if (type === "water") {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type ||
          pkmn.id === "0133_00"
        );
      });
    } else {
      pokemonByType = pokemon.filter((pkmn) => {
        return (
          pkmn.data.type1.toLowerCase() === type ||
          pkmn.data.type2.toLowerCase() === type
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
        nuzlockeJson,
        setNuzlockeJson,
        pokemonTypes,
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

export const getServerSideProps: GetServerSideProps = async () => {
  let nuzlockeResponse = await fetch(`${process.env.API_URL}nuzlocke`);
  let nuzlockeJsonPoor: SVLocation[] = await nuzlockeResponse.json();

  let paldeaDexResponse = await fetch(`${process.env.API_URL}paldeadex`);
  let pokedex: Pokemon[] = await paldeaDexResponse.json();

  const nuzlockeJson = await nuzlockeJsonPoor.map((loc) => {
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

  return {
    props: {
      nuzlockeJson,
    },
  };
};
