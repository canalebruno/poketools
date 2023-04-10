import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePokedex } from "./usePokedex";
import { Pokemon } from "../utils/types";

interface ShinyTrackerProviderProps {
  children: ReactNode;
}

interface List {
  id: string;
  name: string;
  pokemon: Pokemon[];
}

interface ShinyTrackerContextData {
  shinyDex: Pokemon[];
  setShinyDex: (p: Pokemon[]) => void;
  allLists: List[];
  setAllLists: (l: List[]) => void;
  handleAddPokemon: (id: string) => void;
  activeList: List;
  setActiveList: (l: List) => void;
  handleRemovePokemon: (id: string) => void;
  handleDeleteList: () => void;
}

const ShinyTrackerContext = createContext<ShinyTrackerContextData>(
  {} as ShinyTrackerContextData
);

export function ShinyTrackerProvider({ children }: ShinyTrackerProviderProps) {
  const { pokedex } = usePokedex();
  const [shinyDex, setShinyDex] = useState<Pokemon[]>([] as Pokemon[]);
  const [activeList, setActiveList] = useState<List>({} as List);
  const [allLists, setAllLists] = useState<List[]>([] as List[]);

  const defaultList = {
    name: "Show All Shinies",
    id: "default",
    pokemon: shinyDex,
  };

  function handleUpdateActiveList(updatedList: List) {
    const newAllLists = [
      ...allLists.filter((list) => updatedList.id !== list.id),
      updatedList,
    ];

    setActiveList(updatedList);
    setAllLists(newAllLists);

    localStorage.setItem("localShinyTrackerLists", JSON.stringify(newAllLists));
  }

  function handleAddPokemon(id: string) {
    const pokemonToAdd = pokedex.find((pokemon) => {
      return pokemon.id === id;
    });

    if (!pokemonToAdd) {
      return;
    }

    const updatedActiveList = {
      ...activeList,
      pokemon: [...activeList.pokemon, pokemonToAdd].sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        } else {
          return 0;
        }
      }),
    };

    handleUpdateActiveList(updatedActiveList);
  }

  function handleRemovePokemon(id: string) {
    const indexToRemove = activeList.pokemon.findIndex((pokemon) => {
      return pokemon.id === id;
    });

    if (!indexToRemove && indexToRemove !== 0) {
      return;
    }

    let list = activeList.pokemon;

    list.splice(indexToRemove, 1);

    const updatedActiveList = {
      ...activeList,
      pokemon: list,
    };

    handleUpdateActiveList(updatedActiveList);
  }

  function handleDeleteList() {
    const updatedLists = allLists.filter((list) => list.id !== activeList.id);

    const defaultList = allLists.find((list) => list.id === "default");

    if (!defaultList) {
      return;
    }

    setActiveList(defaultList);
    setAllLists(updatedLists);
    localStorage.setItem(
      "localShinyTrackerLists",
      JSON.stringify(updatedLists)
    );
  }

  return (
    <ShinyTrackerContext.Provider
      value={{
        shinyDex,
        setShinyDex,
        allLists,
        setAllLists,
        handleAddPokemon,
        activeList,
        setActiveList,
        handleRemovePokemon,
        handleDeleteList,
      }}
    >
      {children}
    </ShinyTrackerContext.Provider>
  );
}

export function useShinyTracker(): ShinyTrackerContextData {
  const context = useContext(ShinyTrackerContext);

  return context;
}
