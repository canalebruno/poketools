import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Pokemon } from "../utils/types";

interface PokedexProviderProps {
  children: ReactNode;
}

interface List {
  id: string;
  name: string;
  pokemon: Pokemon[];
}

interface PokedexContextData {
  pokedexShown: Pokemon[];
  setPokedexShown: (pokedex: Pokemon[]) => void;
  fullListPokedex: Pokemon[];
  setFullListPokedex: (pokedex: Pokemon[]) => void;
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
  loadPokedex: (loadingPokedex: Pokemon[]) => void;
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
  // shiny tracker
  shinyDex: Pokemon[];
  setShinyDex: (p: Pokemon[]) => void;
  customBoxes: List[];
  setCustomBoxes: (l: List[]) => void;
  handleAddPokemon: (id: string) => void;
  pageBox: List;
  setPageBox: (l: List) => void;
  handleRemovePokemon: (id: string) => void;
  handleDeleteList: (slug: string) => void;
  fullShinyDex: Pokemon[];
}

const PokedexContext = createContext<PokedexContextData>(
  {} as PokedexContextData
);

export function PokedexProvider({ children }: PokedexProviderProps) {
  const [pokedexShown, setPokedexShown] = useState<Pokemon[]>([] as Pokemon[]);
  const [fullListPokedex, setFullListPokedex] = useState<Pokemon[]>(
    [] as Pokemon[]
  );
  const [viewGenderDifference, setViewGenderDifference] = useState(true);
  const [viewOnlyOneForm, setViewOnlyOneForm] = useState(false);
  const [breakByGen, setBreakByGen] = useState(false);
  const [orderList, setOrderList] = useState<"p" | "n">("p");
  const [highlightPokemon, setHighlightPokemon] = useState("");
  const [filterValues, setFilterValues] = useState(["gender"]);
  const [firstLoad, setFirstLoad] = useState(true);

  const router = useRouter();

  function loadPokedex(loadingPokedex: Pokemon[]) {
    setFirstLoad(true);
    setFullListPokedex(loadingPokedex);
    setPokedexShown(loadingPokedex);
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

    setPokedexShown(pokedexToUpdateOrederd);
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
      updatePokedex(fullListPokedex);
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
          fullListPokedex.filter((pkmn) => {
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
    return pokedexShown.filter((pkmn) => {
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
              pkmn.id === "194_01" ||
              pkmn.id === "666_19") &&
            pkmn.id !== "194_00" &&
            pkmn.id !== "666_00"
          );
        default:
          return pkmn.formOrder === "00";
      }
    });
  }

  function sortByNationalDex() {
    return pokedexShown.sort((a, b) => {
      return a.nationalDex - b.nationalDex;
    });
  }

  function sortByPaldeanDex() {
    return pokedexShown.sort((a, b) => {
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
      setPokedexShown(sortByPaldeanDex());
    } else {
      setPokedexShown(sortByNationalDex());
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

  // SHINY TRACKER

  const [shinyDex, setShinyDex] = useState<Pokemon[]>([] as Pokemon[]);
  const [pageBox, setPageBox] = useState<List>({} as List);
  const [customBoxes, setCustomBoxes] = useState<List[]>([] as List[]);
  const [fullShinyDex, setFullShinyDex] = useState<Pokemon[]>([] as Pokemon[]);

  useEffect(() => {
    fetch("/api/shinydex")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setFullShinyDex(data);
      });
  }, []);

  function handleUpdateActiveList(updatedList: List) {
    const newCustomBoxes = [
      ...customBoxes.filter((list) => updatedList.id !== list.id),
      updatedList,
    ];

    setCustomBoxes(newCustomBoxes);
    setPokedexShown(updatedList.pokemon);
    setPageBox(updatedList);

    localStorage.setItem("localBoxes", JSON.stringify(newCustomBoxes));
  }
  // ESTOU AQUI
  function handleAddPokemon(id: string) {
    const pokemonToAdd = fullShinyDex.find((pokemon) => {
      return pokemon.id === id;
    });

    if (!pokemonToAdd) {
      return;
    }

    const updatedBox = {
      ...pageBox,
      pokemon: [...pageBox.pokemon, pokemonToAdd].sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        } else {
          return 0;
        }
      }),
    };

    handleUpdateActiveList(updatedBox);
  }

  function handleRemovePokemon(id: string) {
    const indexToRemove = pageBox.pokemon.findIndex((pokemon) => {
      return pokemon.id === id;
    });

    if (!indexToRemove && indexToRemove !== 0) {
      return;
    }

    let list = pageBox.pokemon;

    list.splice(indexToRemove, 1);

    const updatedActiveList = {
      ...pageBox,
      pokemon: list,
    };

    handleUpdateActiveList(updatedActiveList);
  }

  function handleDeleteList(slug: string) {
    const updatedLists = customBoxes.filter((list) => list.id !== slug);

    setCustomBoxes(updatedLists);
    localStorage.setItem("localBoxes", JSON.stringify(updatedLists));
  }

  return (
    <PokedexContext.Provider
      value={{
        pokedexShown,
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
        loadPokedex,
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
        setPokedexShown,
        fullListPokedex,
        setFullListPokedex,
        shinyDex,
        setShinyDex,
        customBoxes,
        setCustomBoxes,
        handleAddPokemon,
        pageBox,
        setPageBox,
        handleRemovePokemon,
        handleDeleteList,
        fullShinyDex,
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
