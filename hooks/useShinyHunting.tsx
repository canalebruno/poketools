import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePokedex } from "./usePokedex";
import { Pokemon } from "../utils/types";

interface ShinyHuntingProviderProps {
  children: ReactNode;
}

interface List {
  id: string;
  name: string;
  pokemon: Pokemon[];
}

interface ShinyHuntingContextData {
  shinyDex: Pokemon[];
  setShinyDex: (p: Pokemon[]) => void;
  allLists: List[];
  setAllLists: (l: List[]) => void;
  handleAddPokemon: (id: string) => void;
  activeList: List;
  setActiveList: (l: List) => void;
  handleRemovePokemon: (id: string) => void;
  handleDeleteList: () => void;
  countIdList: number;
  setCountIdList: (n: number) => void;
}

const ShinyHuntingContext = createContext<ShinyHuntingContextData>(
  {} as ShinyHuntingContextData
);

export function ShinyHuntingProvider({ children }: ShinyHuntingProviderProps) {
  const { pokedex } = usePokedex();
  const [shinyDex, setShinyDex] = useState<Pokemon[]>([] as Pokemon[]);
  const [activeList, setActiveList] = useState<List>({} as List);
  const [allLists, setAllLists] = useState<List[]>([] as List[]);
  const [countIdList, setCountIdList] = useState(1);

  function handleUpdateActiveList(updatedList: List) {
    const newAllLists = [
      ...allLists.filter((list) => updatedList.id !== list.id),
      updatedList,
    ];

    setActiveList(updatedList);
    setAllLists(newAllLists);

    const localShinyHuntingLists = {
      countId: countIdList,
      list: newAllLists,
    };

    localStorage.setItem(
      "localShinyHuntingLists",
      JSON.stringify(localShinyHuntingLists)
    );
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

  function handleRemovePokemon(id: string) {}

  function handleDeleteList() {
    const updatedLists = allLists.filter((list) => list.id !== activeList.id);

    const defaultList = allLists.find((list) => list.id === "default");

    if (!defaultList) {
      return;
    }

    const localShinyHuntingLists = {
      countId: countIdList,
      list: updatedLists,
    };

    setActiveList(defaultList);
    setAllLists(updatedLists);
    localStorage.setItem(
      "localShinyHuntingLists",
      JSON.stringify(localShinyHuntingLists)
    );
  }

  return (
    <ShinyHuntingContext.Provider
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
        countIdList,
        setCountIdList,
      }}
    >
      {children}
    </ShinyHuntingContext.Provider>
  );
}

export function useShinyHunting(): ShinyHuntingContextData {
  const context = useContext(ShinyHuntingContext);

  return context;
}
