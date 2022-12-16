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
  firstLoadPokedex: (loadingPokedex: Pokemon[]) => void;
  resetControls: () => void;
  updatePokedex: (pokedexToUpdate: Pokemon[]) => void;
  handleBreakByGen: () => void;
  breakByGen: boolean;
}

interface Pokemon {
  id: string;
  nationalDex: number;
  name: string;
  generalForm: string;
  uniqueForm: string;
  paldeaDex: null | number;
  formOrder: string;
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
  const [breakByGen, setBreakByGen] = useState(false);
  const [orderList, setOrderList] = useState<"p" | "n">("p");

  const router = useRouter();

  function firstLoadPokedex(loadingPokedex: Pokemon[]) {
    let sortedPokedes = [] as Pokemon[];

    if (router.pathname === "/") {
      sortedPokedes = loadingPokedex.sort((a, b) => {
        if (a.paldeaDex !== b.paldeaDex) {
          return a.paldeaDex! - b.paldeaDex!;
        } else {
          return a.id > b.id ? 1 : -1;
        }
      });
    } else {
      sortedPokedes = loadingPokedex.sort((a, b) => {
        return a.id > b.id ? 1 : -1;
      });
    }
    setPokedex(sortedPokedes);
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
          return pkmn.homeAvailable;
        });
      default:
        return pokelist;
    }
  }

  function resetControls() {
    switch (router.pathname) {
      case "/":
        handleSorting("p");
        break;
      default:
        handleSorting("n");
    }

    setViewGenderDifference(true);
    setViewOnlyOneForm(false);
  }

  function updatePokedex(pokedexToUpdate: Pokemon[]) {
    if (orderList !== "p" && orderList !== "n") {
      return;
    }

    let pokedexToUpdateOrederd = [] as Pokemon[];

    if (orderList === "p") {
      pokedexToUpdateOrederd = pokedexToUpdate.sort((a, b) => {
        if (a.paldeaDex !== b.paldeaDex) {
          return a.paldeaDex! - b.paldeaDex!;
        } else {
          return a.id > b.id ? 1 : -1;
        }
      });
    } else {
      pokedexToUpdateOrederd = pokedexToUpdate.sort((a, b) => {
        return a.nationalDex - b.nationalDex;
      });
    }

    setPokedex(pokedexToUpdateOrederd);
  }

  function handleViewGenderDifference() {
    const newSetting = !viewGenderDifference;

    setViewGenderDifference(newSetting);

    if (newSetting) {
      setViewOnlyOneForm(false);
      updatePokedex(pagePokedex());
    } else {
      updatePokedex(filterByGender());
    }
  }

  function handleViewOnlyOneForm() {
    const newSetting = !viewOnlyOneForm;

    setViewOnlyOneForm(newSetting);

    if (!newSetting) {
      if (viewGenderDifference) {
        handleViewGenderDifference();
      } else {
        updatePokedex(
          pagePokedex().filter((pkmn) => {
            return !pkmn.genderDifference;
          })
        );
      }
    } else {
      setViewGenderDifference(false);
      updatePokedex(filterByOnlyOneForm());
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
          return (
            pkmn.formOrder === "0" ||
            pkmn.formOrder === "00" ||
            pkmn.id === "128_01" ||
            pkmn.id === "194_01"
          );
        default:
          return pkmn.formOrder === "0" || pkmn.formOrder === "00";
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

  function handleBreakByGen() {
    const newSetting = !breakByGen;

    setBreakByGen(newSetting);
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
        firstLoadPokedex,
        resetControls,
        updatePokedex,
        breakByGen,
        handleBreakByGen,
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
