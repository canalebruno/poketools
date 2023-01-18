import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useState } from "react";
import pokelist from "../json/nationalDex.json";
import { Pokemon } from "../utils/types";

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
  highlightPokemon: string;
  setHighlightPokemon: (term: string) => void;
  filterValues: string[];
  handleFilterValues: (
    event: React.MouseEvent<HTMLElement>,
    newValues: string[]
  ) => void;
  firstLoad: boolean;
  setFirstLoad: (b: boolean) => void;
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
  const [highlightPokemon, setHighlightPokemon] = useState("");
  const [filterValues, setFilterValues] = useState(["gender"]);
  const [firstLoad, setFirstLoad] = useState(true);

  const router = useRouter();

  function firstLoadPokedex(loadingPokedex: Pokemon[]) {
    setFirstLoad(true);
    let sortedPokedes = [] as Pokemon[];

    if (router.pathname === "/svboxes") {
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
      case "/svboxes":
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
      case "/svboxes":
        handleSorting("p");
        break;
      default:
        handleSorting("n");
    }

    setFilterValues(["gender"]);
    setViewGenderDifference(true);
    setViewOnlyOneForm(false);
    setBreakByGen(false);
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
    let finalValues = [] as string[];

    setViewGenderDifference(newSetting);

    if (newSetting) {
      finalValues = filterValues.filter((value) => {
        return value !== "oneForm";
      });

      if (!finalValues.includes("gender")) {
        finalValues = [...finalValues, "gender"];
      }

      setViewOnlyOneForm(false);
      updatePokedex(pagePokedex());
    } else {
      if (filterValues.includes("gender")) {
        finalValues = filterValues.filter((value) => {
          return value !== "gender";
        });
      }
      updatePokedex(filterByGender());
    }
    setFilterValues(finalValues);
  }

  function handleViewOnlyOneForm() {
    const newSetting = !viewOnlyOneForm;
    let finalValues = [] as string[];

    setViewOnlyOneForm(newSetting);

    if (!newSetting) {
      if (filterValues.includes("oneForm")) {
        finalValues = filterValues.filter((value) => {
          return value !== "oneForm";
        });
      }

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
      finalValues = filterValues.filter((value) => {
        return value !== "gender";
      });
      if (!finalValues.includes("oneForm")) {
        finalValues = [...finalValues, "oneForm"];
      }
      setViewGenderDifference(false);
      updatePokedex(filterByOnlyOneForm());
    }
    setFilterValues(finalValues);
  }

  function filterByGender() {
    return pokedex.filter((pkmn) => {
      return !pkmn.genderDifference;
    });
  }

  function filterByOnlyOneForm() {
    return filterByGender().filter((pkmn) => {
      switch (router.pathname) {
        case "/svboxes":
          return (
            (pkmn.formOrder === "00" ||
              pkmn.id === "128_01" ||
              pkmn.id === "194_01") &&
            pkmn.id !== "194_00"
          );
        default:
          return pkmn.formOrder === "00";
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

    if (newSetting && !filterValues.includes("gen")) {
      setFilterValues([...filterValues, "gen"]);
    } else if (!newSetting && filterValues.includes("gen")) {
      setFilterValues(
        filterValues.filter((value) => {
          return value !== "gen";
        })
      );
    }

    setBreakByGen(newSetting);
  }

  function handleFilterValues(
    event: React.MouseEvent<HTMLElement>,
    newValues: string[]
  ) {
    if (
      (newValues.includes("gender") && !filterValues.includes("gender")) ||
      (!newValues.includes("gender") && filterValues.includes("gender"))
    ) {
      handleViewGenderDifference();
    }

    if (
      (newValues.includes("oneForm") && !filterValues.includes("oneForm")) ||
      (!newValues.includes("oneForm") && filterValues.includes("oneForm"))
    ) {
      handleViewOnlyOneForm();
    }

    if (
      (newValues.includes("gen") && !filterValues.includes("gen")) ||
      (!newValues.includes("gen") && filterValues.includes("gen"))
    ) {
      handleBreakByGen();
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
        firstLoadPokedex,
        resetControls,
        updatePokedex,
        breakByGen,
        handleBreakByGen,
        highlightPokemon,
        setHighlightPokemon,
        filterValues,
        handleFilterValues,
        firstLoad,
        setFirstLoad,
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
