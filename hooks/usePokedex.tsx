import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useState } from "react";
import pokelist from "../json/nationalDex.json";

interface PokedexProviderProps {
  children: ReactNode;
}

interface PokedexContextData {
  pagePokedex: () => Pokemon[];
  pokedex: Pokemon[];
  viewGenderDifference: boolean;
  viewOnlyOneForm: boolean;
  orderList: "p" | "n";
  handleViewGenderDifference: () => void;
  handleViewOnlyOneForm: () => void;
  filterByGender: () => Pokemon[];
  filterByOnlyOneForm: () => Pokemon[];
  sortByNationalDex: () => Pokemon[];
  sortByPaldeanDex: () => Pokemon[];
  handleSorting: (value: string) => void;
  resetPokedex: () => void;
  setNewPokedex: (newPokedex: Pokemon[]) => void;
}

interface Pokemon {
  id: string;
  nationalDex: number;
  name: string;
  generalForm: string;
  uniqueForm: string;
  paldeaDex: null | number;
  uniqueCode: string;
  generation: number;
  type1: string;
  type2: string;
  genderDifference: boolean;
  homeAvailable: boolean;
  shinyAvailable: boolean;
  icon: string;
  homePic: string;
  homeShinyPic: string;
}

const PokedexContext = createContext<PokedexContextData>(
  {} as PokedexContextData
);

export function PokedexProvider({ children }: PokedexProviderProps) {
  const [pokedex, setPokedex] = useState<Pokemon[]>(pokelist);
  const [viewGenderDifference, setViewGenderDifference] = useState(true);
  const [viewOnlyOneForm, setViewOnlyOneForm] = useState(false);
  const [orderList, setOrderList] = useState<"p" | "n">("p");

  const router = useRouter();

  function setNewPokedex(newPokedex: Pokemon[]) {
    setPokedex(newPokedex);
  }

  function resetPokedex() {
    setPokedex(pokelist);
  }

  function pagePokedex() {
    switch (router.pathname) {
      case "/":
        return pokelist.filter((pkmn) => {
          return pkmn.paldeaDex !== null;
        });
      case "/homeboxes":
        return pokelist.filter((pkmn) => {
          return pkmn.generation === 1 && pkmn.homeAvailable;
        });
      default:
        return pokelist;
    }
  }

  function handleViewGenderDifference() {
    const newSetting = !viewGenderDifference;

    setViewGenderDifference(newSetting);

    if (newSetting) {
      setViewOnlyOneForm(false);
      setPokedex(pagePokedex());
    } else {
      setPokedex(filterByGender());
    }
  }

  function handleViewOnlyOneForm() {
    const newSetting = !viewOnlyOneForm;

    setViewOnlyOneForm(newSetting);

    if (!newSetting) {
      if (viewGenderDifference) {
        handleViewGenderDifference();
      } else {
        setPokedex(
          pagePokedex().filter((pkmn) => {
            return !pkmn.genderDifference;
          })
        );
      }
    } else {
      setViewGenderDifference(false);
      setPokedex(filterByOnlyOneForm());
    }
  }

  function filterByGender() {
    return pokedex.filter((pkmn) => {
      return !pkmn.genderDifference;
    });
  }

  function filterByOnlyOneForm() {
    return filterByGender().filter((pkmn) => {
      switch (router.pathname) {
        case "/":
          return !pkmn.uniqueCode || pkmn.id === "128-p" || pkmn.id === "194-p";
        default:
          return !pkmn.uniqueCode && !pkmn.generalForm;
      }
    });
  }

  function sortByNationalDex() {
    return pokedex.sort((a, b) => {
      return a.nationalDex - b.nationalDex;
    });
  }

  function sortByPaldeanDex() {
    return pokedex.sort((a, b) => {
      if (a.paldeaDex !== b.paldeaDex) {
        return a.paldeaDex! - b.paldeaDex!;
      } else {
        return a.id > b.id ? 1 : -1;
      }
    });
  }

  function handleSorting(value: string) {
    const newOrder = value;

    if (newOrder !== "p" && newOrder !== "n") {
      return;
    }

    setOrderList(newOrder);

    if (newOrder === "p") {
      setPokedex(sortByPaldeanDex());
    } else {
      setPokedex(sortByNationalDex());
    }
  }

  return (
    <PokedexContext.Provider
      value={{
        pagePokedex,
        pokedex,
        resetPokedex,
        viewGenderDifference,
        viewOnlyOneForm,
        orderList,
        handleViewGenderDifference,
        handleViewOnlyOneForm,
        filterByGender,
        filterByOnlyOneForm,
        sortByNationalDex,
        sortByPaldeanDex,
        handleSorting,
        setNewPokedex,
      }}
    >
      {children}
    </PokedexContext.Provider>
  );
}

export function usePokedex(): PokedexContextData {
  const context = useContext(PokedexContext);

  return context;
}
