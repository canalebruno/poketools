import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Games,
  List,
  ListOnStorage,
  Pokemon,
  PokemonCustomBox,
  PokemonCustomBoxShort,
} from "../utils/types";

interface PokedexProviderProps {
  children: ReactNode;
}

type SortingLists =
  | "paldean"
  | "national"
  | "hisuian"
  | "galarian"
  | "galarian-ioa"
  | "galarian-ct"
  | "paldean-tm";

interface PokedexContextData {
  pokedexShown: PokemonShown[];
  setPokedexShown: (pokedex: Pokemon[]) => void;
  fullListPokedex: Pokemon[];
  setFullListPokedex: (pokedex: Pokemon[]) => void;
  viewGenderDifference: boolean;
  viewOnlyOneForm: boolean;
  orderList:
    | "paldean"
    | "paldean-tm"
    | "national"
    | "hisuian"
    | "galarian"
    | "galarian-ioa"
    | "galarian-ct";
  handleViewGenderDifference: () => void;
  handleViewOnlyOneForm: () => void;
  filterByGender: () => Pokemon[];
  filterByOnlyOneForm: () => Pokemon[];
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
  customBoxes: ListOnStorage[];
  setCustomBoxes: (l: ListOnStorage[]) => void;
  handleAddPokemon: (id: string, shouldAddShiny: boolean) => void;
  pageBox: List;
  setPageBox: (l: List) => void;
  handleRemovePokemon: (customBoxId: string | undefined) => void;
  handleDeleteList: (slug: string) => void;
  fullShinyDex: Pokemon[];
  handleCheck: (id: string) => void;
  showChecked: boolean;
  showUnchecked: boolean;
  setShowChecked: (b: boolean) => void;
  setShowUnchecked: (b: boolean) => void;
  showAllCheckedAndUnchecked: boolean;
  passListThroughFilters: () => void;
  passThroughFilters: () => void;
  handleToggleCheck: (
    kind: "check" | "uncheck" | "all",
    value: boolean
  ) => void;
  handleSelectGame: (value: string) => void;
  huntGameSelection: string;
  setLocalStorage: (data: ListOnStorage[]) => void;
  expandPokemonList: (list: PokemonCustomBoxShort[]) => PokemonCustomBox[];
  compactPokemonList: (list: PokemonCustomBox[]) => PokemonCustomBoxShort[];
  getLocalStorage: () => ListOnStorage[] | undefined;
  fullPokedex: Pokemon[];
  resetPage: () => void;
  // SORTING
  handleSorting: (value: SortingLists) => void;
  sortByNationalDex: (a: Pokemon, b: Pokemon) => number;
  sortByPaldeaDex: (a: Pokemon, b: Pokemon) => number;
  sortByKitakamiDex: (a: Pokemon, b: Pokemon) => number;
  sortByHisuiDex: (a: Pokemon, b: Pokemon) => number;
  sortByGalarDex: (a: Pokemon, b: Pokemon) => number;
  sortByIsleOfArmorDex: (a: Pokemon, b: Pokemon) => number;
  sortByCrownTundraDex: (a: Pokemon, b: Pokemon) => number;
}

const PokedexContext = createContext<PokedexContextData>(
  {} as PokedexContextData
);

interface PokemonShown extends Pokemon {
  customBoxId?: string;
  isShiny?: boolean;
  isChecked?: boolean;
}

export function PokedexProvider({ children }: PokedexProviderProps) {
  const [pokedexShown, setPokedexShown] = useState<PokemonShown[]>(
    [] as PokemonShown[]
  );
  const [fullListPokedex, setFullListPokedex] = useState<Pokemon[]>(
    [] as Pokemon[]
  );
  const [viewGenderDifference, setViewGenderDifference] = useState(true);
  const [viewOnlyOneForm, setViewOnlyOneForm] = useState(false);
  const [breakByGen, setBreakByGen] = useState(false);
  const [orderList, setOrderList] = useState<
    | "paldean"
    | "paldean-tm"
    | "national"
    | "hisuian"
    | "galarian"
    | "galarian-ioa"
    | "galarian-ct"
  >("national");
  const [highlightPokemon, setHighlightPokemon] = useState("");
  const [filterValues, setFilterValues] = useState(["gender"]);
  const [firstLoad, setFirstLoad] = useState(true);

  const router = useRouter();

  function loadPokedex(loadingPokedex: Pokemon[]) {
    setFirstLoad(true);
    setFullListPokedex(loadingPokedex);
    setPokedexShown(loadingPokedex);
  }

  function resetPage() {
    setPokedexShown([] as PokemonShown[]);
  }

  function resetControls() {
    switch (router.pathname) {
      case "/svboxes":
        setOrderList("paldean");
        break;
      case "/teal-mask-boxes":
        setOrderList("paldean-tm");
        break;
      default:
        setOrderList("national");
    }

    setFilterValues(["gender"]);
    setViewGenderDifference(true);
    setViewOnlyOneForm(false);
    setBreakByGen(false);
    setShowUnchecked(false);
    setShowChecked(false);
    setShowAllCheckedAndUnchecked(true);
    setHuntGameSelection("");
  }

  // AQUI HERE
  function updatePokedex(pokedexToUpdate: Pokemon[]) {
    // if (orderList !== "paldean" && orderList !== "national") {
    //   return;
    // }

    let pokedexToUpdateOrederd = [] as Pokemon[];

    if (orderList === "paldean") {
      pokedexToUpdateOrederd = pokedexToUpdate.sort((a, b) =>
        sortByPaldeaDex(a, b)
      );
    } else {
      pokedexToUpdateOrederd = pokedexToUpdate.sort((a, b) =>
        sortByNationalDex(a, b)
      );
    }

    setPokedexShown(pokedexToUpdateOrederd);
  }
  /*
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
*/
  // function NEWhandleViewGenderDifference() {
  function handleViewGenderDifference() {
    const newSetting = !viewGenderDifference;

    setViewGenderDifference(newSetting);

    if (newSetting) {
      if (viewOnlyOneForm) {
        setViewOnlyOneForm(false);
      }

      // updatePokedex(fullListPokedex);
    } else {
      // updatePokedex(filterByGender());
    }
  }

  // function NEWhandleViewOnlyOneForm() {
  function handleViewOnlyOneForm() {
    const newSetting = !viewOnlyOneForm;

    setViewOnlyOneForm(newSetting);

    if (newSetting) {
      if (viewGenderDifference) {
        setViewGenderDifference(false);
      }
    }
  }
  /*
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
*/
  function filterByGender() {
    return pokedexShown.filter((pkmn) => {
      return !pkmn.genderDifference;
    });
  }

  function filterListByGender(list: PokemonCustomBox[]) {
    return list.filter((pkmn) => {
      return !pkmn.genderDifference;
    });
  }

  function filterByOnlyOneForm() {
    return filterByGender().filter((pkmn) => {
      switch (router.pathname) {
        case "/teal-mask-boxes":
          return (
            (pkmn.formOrder === "00" ||
              pkmn.id === "0741_03" ||
              pkmn.id === "0550_02" ||
              pkmn.id === "0901_01") &&
            pkmn.id !== "0741_00" &&
            pkmn.id !== "0901_00" &&
            pkmn.id !== "0550_00"
          );
        case "/svboxes":
          return (
            (pkmn.formOrder === "00" ||
              pkmn.id === "0128_01" ||
              pkmn.id === "0194_01" ||
              pkmn.id === "0666_19") &&
            pkmn.id !== "0194_00" &&
            pkmn.id !== "0666_00"
          );
        default:
          return pkmn.formOrder === "00";
      }
    });
  }

  function filterListByOnlyOneForm(list: PokemonCustomBox[]) {
    return filterListByGender(list).filter((pkmn) => {
      return pkmn.formOrder === "00";
    });
  }

  // volta aqui

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

  function passThroughFilters() {
    let finalList = fullListPokedex;

    if (viewOnlyOneForm) {
      finalList = [...filterByOnlyOneForm()];
    } else if (!viewGenderDifference) {
      finalList = [...filterByGender()];
    }

    setPokedexShown(finalList);
  }

  // SORTING
  function sortByNationalDex(a: Pokemon, b: Pokemon) {
    return a.id > b.id ? 1 : -1;
  }

  function sortByPaldeaDex(a: Pokemon, b: Pokemon) {
    if (a.paldeaDex === b.paldeaDex) {
      return sortByNationalDex(a, b);
    } else if (!a.paldeaDex || !b.paldeaDex) {
      return 0;
    } else {
      return a.paldeaDex - b.paldeaDex;
    }
  }

  function sortByKitakamiDex(a: Pokemon, b: Pokemon) {
    if (a.paldeaTMDex === b.paldeaTMDex) {
      return sortByNationalDex(a, b);
    } else if (!a.paldeaTMDex || !b.paldeaTMDex) {
      return 0;
    } else {
      return a.paldeaTMDex - b.paldeaTMDex;
    }
  }

  function sortByGalarDex(a: Pokemon, b: Pokemon) {
    if (a.galarDex === b.galarDex) {
      return sortByNationalDex(a, b);
    } else if (!a.galarDex || !b.galarDex) {
      return 0;
    } else {
      return a.galarDex - b.galarDex;
    }
  }

  function sortByIsleOfArmorDex(a: Pokemon, b: Pokemon) {
    if (a.galarIoaDex === b.galarIoaDex) {
      return sortByNationalDex(a, b);
    } else if (!a.galarIoaDex || !b.galarIoaDex) {
      return 0;
    } else {
      return a.galarIoaDex - b.galarIoaDex;
    }
  }

  function sortByCrownTundraDex(a: Pokemon, b: Pokemon) {
    if (a.galarCtDex === b.galarCtDex) {
      return sortByNationalDex(a, b);
    } else if (!a.galarCtDex || !b.galarCtDex) {
      return 0;
    } else {
      return a.galarCtDex - b.galarCtDex;
    }
  }

  function sortByHisuiDex(a: Pokemon, b: Pokemon) {
    if (a.hisuiDex === b.hisuiDex) {
      return sortByNationalDex(a, b);
    } else if (!a.hisuiDex || !b.hisuiDex) {
      return 0;
    } else {
      return a.hisuiDex - b.hisuiDex;
    }
  }

  // AQUI pq duas funcoes parecidas? handleSorting e sortList
  function handleSorting(value: SortingLists) {
    if (!pokedexShown) {
      return;
    }

    setOrderList(value);

    const sortedList = sortList(pokedexShown, value) as Pokemon[];

    setPokedexShown(sortedList);
  }

  function sortList(
    list: PokemonCustomBox[] | Pokemon[],
    order: SortingLists
  ): PokemonCustomBox[] | Pokemon[] {
    if (order === "national") {
      return list.sort((a, b) => sortByNationalDex(a, b));
    }

    let notInDex = [] as PokemonCustomBox[] | Pokemon[];

    let inDex = [] as PokemonCustomBox[] | Pokemon[];

    switch (order) {
      case "paldean":
        notInDex = list.filter((pkmn) => {
          return !pkmn.paldeaDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.paldeaDex;
          })
          .sort((a, b) => sortByPaldeaDex(a, b));
        break;
      case "paldean-tm":
        notInDex = list.filter((pkmn) => {
          return !pkmn.paldeaTMDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.paldeaTMDex;
          })
          .sort((a, b) => sortByKitakamiDex(a, b));
        break;
      case "hisuian":
        notInDex = list.filter((pkmn) => {
          return !pkmn.hisuiDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.hisuiDex;
          })
          .sort((a, b) => sortByHisuiDex(a, b));
        break;
      case "galarian":
        notInDex = list.filter((pkmn) => {
          return !pkmn.galarDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.galarDex;
          })
          .sort((a, b) => sortByGalarDex(a, b));
        break;
      case "galarian-ioa":
        notInDex = list.filter((pkmn) => {
          return !pkmn.galarIoaDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.galarIoaDex;
          })
          .sort((a, b) => sortByIsleOfArmorDex(a, b));

        break;
      case "galarian-ct":
        notInDex = list.filter((pkmn) => {
          return !pkmn.galarCtDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.galarCtDex;
          })
          .sort((a, b) => sortByCrownTundraDex(a, b));

        break;
    }

    if ("customBoxId" in inDex[0]) {
      const sortedList: PokemonCustomBox[] = [
        ...inDex,
        ...notInDex.sort((a, b) => sortByNationalDex(a, b)),
      ] as PokemonCustomBox[];
      return sortedList;
    } else {
      const sortedList: Pokemon[] = [
        ...inDex,
        ...notInDex.sort((a, b) => sortByNationalDex(a, b)),
      ] as Pokemon[];
      return sortedList;
    }
  }

  // AQUI
  function passListThroughFilters() {
    let finalList = pageBox.pokemon;

    if (viewOnlyOneForm) {
      finalList = [...filterListByOnlyOneForm(finalList)];
    } else if (!viewGenderDifference) {
      finalList = [...filterListByGender(finalList)];
    }

    if (router.pathname.includes("boxtracker")) {
      finalList = [...filterListByGame(finalList)];
    }

    if (router.pathname.includes("boxtracker")) {
      finalList = [...filterListByChecked(finalList)];
    }

    setPokedexShown(sortList(finalList, orderList));
  }

  // SHINY TRACKER

  // WORK ON HANDLE CHECK THAT KEEPS REORDERING; REMOVE POKEMON MODAL; REUPLOAD POKDEXE SHOWN WHEN CHANGING PAGE

  const [shinyDex, setShinyDex] = useState<Pokemon[]>([] as Pokemon[]);
  const [pageBox, setPageBox] = useState<List>({} as List);
  const [customBoxes, setCustomBoxes] = useState<ListOnStorage[]>(
    [] as ListOnStorage[]
  );
  const [fullShinyDex, setFullShinyDex] = useState<Pokemon[]>([] as Pokemon[]);
  const [showChecked, setShowChecked] = useState(false);
  const [showUnchecked, setShowUnchecked] = useState(false);
  const [showAllCheckedAndUnchecked, setShowAllCheckedAndUnchecked] =
    useState(true);
  const [huntGameSelection, setHuntGameSelection] = useState("");
  const [fullPokedex, setFullPokedex] = useState([] as Pokemon[]);

  useEffect(() => {
    fetch("/api/shinydex")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setFullShinyDex(data);
      });
  }, []);

  useEffect(() => {
    fetch("/api/pokedex")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setFullPokedex(
          data.sort((a: Pokemon, b: Pokemon) => sortByNationalDex(a, b))
        );
      });
  }, []);

  useEffect(() => {
    setPokedexShown(pageBox.pokemon);
  }, [pageBox]);

  function setLocalStorage(data: ListOnStorage[]) {
    setCustomBoxes(data);
    localStorage.setItem("localBoxes", JSON.stringify(data));
  }

  function expandPokemonList(list: PokemonCustomBoxShort[]) {
    return list.map((pkmn) => {
      const extraInfo = fullPokedex.find((item: any) => {
        return item.id === pkmn.id;
      });

      return {
        customBoxId: pkmn.customBoxId,
        isShiny: pkmn.isShiny,
        isChecked: pkmn.isChecked,
        ...extraInfo!,
      };
    });
  }

  function compactPokemonList(list: PokemonCustomBox[]) {
    return list.map((pkmn) => {
      return {
        customBoxId: pkmn.customBoxId,
        isShiny: pkmn.isShiny,
        isChecked: pkmn.isChecked,
        id: pkmn.id,
      };
    });
  }

  function getLocalStorage() {
    const data = localStorage.getItem("localBoxes");

    return data ? JSON.parse(data) : undefined;
  }

  function filterListByChecked(list: PokemonCustomBox[]) {
    if (showChecked && !showUnchecked) {
      return list.filter((pkmn) => {
        return pkmn.isChecked;
      });
    } else if (!showChecked && showUnchecked) {
      return list.filter((pkmn) => {
        return !pkmn.isChecked;
      });
    } else {
      return list;
    }
  }

  function handleSelectGame(selection: string) {
    setHuntGameSelection(selection);
  }

  function filterListByGame(list: PokemonCustomBox[]) {
    switch (huntGameSelection) {
      case "s":
        return list.filter((pkmn) => {
          return (
            pkmn.paldeaDex &&
            pkmn.id !== "0128_03" &&
            pkmn.nationalDex !== 766 &&
            pkmn.nationalDex !== 875 &&
            pkmn.nationalDex !== 990 &&
            pkmn.nationalDex !== 991 &&
            pkmn.nationalDex !== 992 &&
            pkmn.nationalDex !== 993 &&
            pkmn.nationalDex !== 994 &&
            pkmn.nationalDex !== 995 &&
            pkmn.nationalDex !== 1006 &&
            pkmn.nationalDex !== 1008 &&
            pkmn.nationalDex !== 1010 &&
            !pkmn.family.includes(200) &&
            !pkmn.family.includes(316) &&
            !pkmn.family.includes(371) &&
            !pkmn.family.includes(692) &&
            !pkmn.family.includes(885)
          );
        });
      case "v":
        return list.filter((pkmn) => {
          return (
            pkmn.paldeaDex &&
            pkmn.id !== "0128_02" &&
            pkmn.nationalDex !== 765 &&
            pkmn.nationalDex !== 874 &&
            pkmn.nationalDex !== 984 &&
            pkmn.nationalDex !== 985 &&
            pkmn.nationalDex !== 986 &&
            pkmn.nationalDex !== 987 &&
            pkmn.nationalDex !== 988 &&
            pkmn.nationalDex !== 989 &&
            pkmn.nationalDex !== 1005 &&
            pkmn.nationalDex !== 1007 &&
            pkmn.nationalDex !== 1009 &&
            !pkmn.family.includes(246) &&
            !pkmn.family.includes(425) &&
            !pkmn.family.includes(434) &&
            !pkmn.family.includes(633) &&
            !pkmn.family.includes(690)
          );
        });
      case "tm":
        return list.filter((pkmn) => {
          return pkmn.paldeaTMDex;
        });
      case "pla":
        return list.filter((pkmn) => {
          return pkmn.hisuiDex;
        });
      case "sw":
        return list.filter((pkmn) => {
          return pkmn.galarDex;
        });
      case "sh":
        return list.filter((pkmn) => {
          return pkmn.galarDex;
        });
      case "ioa":
        return list.filter((pkmn) => {
          return pkmn.galarIoaDex;
        });
      case "ct":
        return list.filter((pkmn) => {
          return pkmn.galarCtDex;
        });
      default:
        return list;
    }
  }

  // ORGANIZAR OS OUTROS FILTROS

  function OLDhandleUpdateActiveList(
    updatedList: List,
    preventPokedexShown?: boolean
  ) {
    const sortedList: List = {
      ...updatedList,
      pokemon: sortList(updatedList.pokemon, orderList) as PokemonCustomBox[],
    };

    const newCustomBoxes = [
      ...customBoxes.filter((list) => updatedList.id !== list.id),
      sortedList,
    ];

    setCustomBoxes(newCustomBoxes);
    setPageBox(sortedList);
    setPokedexShown(sortedList.pokemon);

    localStorage.setItem("localBoxes", JSON.stringify(newCustomBoxes));
  }

  function handleUpdateActiveList(
    updatedList: List,
    preventPokedexShown?: boolean
  ) {
    let sortedList;

    if (preventPokedexShown) {
      sortedList = {
        ...updatedList,
        pokemon: sortList(updatedList.pokemon, orderList) as PokemonCustomBox[],
      };
    } else {
      sortedList = updatedList;
    }

    const newCustomBoxes = [
      ...customBoxes.filter((list) => updatedList.id !== list.id),
      sortedList,
    ];

    setCustomBoxes(newCustomBoxes);
    setPageBox(sortedList);
    setPokedexShown(sortedList.pokemon);

    localStorage.setItem("localBoxes", JSON.stringify(newCustomBoxes));
  }

  function handleAddPokemon(id: string, shouldAddShiny: boolean) {
    const findPokemonToAdd = fullShinyDex.find((pokemon) => {
      return pokemon.id === id;
    });

    let pokemonToAdd: PokemonCustomBox;

    if (!findPokemonToAdd) {
      return;
    } else {
      pokemonToAdd = {
        ...findPokemonToAdd,
        customBoxId: `${findPokemonToAdd.id}-${Date.now()}`,
        isChecked: false,
        isShiny: shouldAddShiny,
      };
    }

    const updatedBox = {
      ...pageBox,
      pokemon:
        pageBox.pokemon && pageBox.pokemon.length > 0
          ? [...pageBox.pokemon, pokemonToAdd]
          : // .sort((a, b) => {
            //     if (a.nationalDex === b.nationalDex) {
            //       if (a.id < b.id) {
            //         return -1;
            //       } else if (a.id > b.id) {
            //         return 1;
            //       } else {
            //         return 0;
            //       }
            //     } else {
            //       return a.nationalDex - b.nationalDex;
            //     }
            //   })
            [pokemonToAdd],
    };

    handleUpdateActiveList(updatedBox);
  }

  function handleRemovePokemon(customBoxId: string | undefined) {
    const indexToRemove = pageBox.pokemon.findIndex((pokemon) => {
      return pokemon.customBoxId === customBoxId;
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

  function handleToggleCheck(
    kind: "check" | "uncheck" | "all",
    value: boolean
  ) {
    if (kind === "check") {
      if (value) {
        setShowAllCheckedAndUnchecked(false);
        setShowChecked(true);
        setShowUnchecked(false);
      } else if (!value && !showUnchecked) {
        setShowAllCheckedAndUnchecked(true);
      }
      setShowChecked(value);
    } else if (kind === "uncheck") {
      if (value) {
        setShowAllCheckedAndUnchecked(false);
        setShowChecked(false);
        setShowUnchecked(true);
      } else if (!value && !showChecked) {
        setShowAllCheckedAndUnchecked(true);
      }
      setShowUnchecked(value);
    } else if (kind === "all") {
      if (value) {
        setShowAllCheckedAndUnchecked(true);
        setShowChecked(false);
        setShowUnchecked(false);
      }
    } else {
      return;
    }
  }

  // function handleCheck(id: string) {
  //   const findPokemon = pageBox.pokemon.find((pkmn) => {
  //     return pkmn.customBoxId === id;
  //   });

  //   if (!findPokemon) {
  //     return;
  //   }

  //   const updatePokemon: PokemonCustomBox = {
  //     ...findPokemon,
  //     isChecked: !findPokemon.isChecked,
  //   };

  //   const updatedActiveList: List = {
  //     ...pageBox,
  //     pokemon: [
  //       ...pageBox.pokemon.filter((pkmn) => {
  //         return pkmn.customBoxId !== id;
  //       }),
  //       updatePokemon,
  //     ],
  //   };

  //   handleUpdateActiveList(updatedActiveList);
  // }
  function handleCheck(id: string) {
    const findPokemonIndex = pageBox.pokemon.findIndex((pkmn) => {
      return pkmn.customBoxId === id;
    });

    if (!findPokemonIndex) {
      return;
    }

    pageBox.pokemon[findPokemonIndex].isChecked =
      !pageBox.pokemon[findPokemonIndex].isChecked;

    // const updatedActiveList: List = {
    //   ...pageBox,
    //   pokemon: [
    //     ...pageBox.pokemon,
    //     pageBox.pokemon[findPokemonIndex].isChecked =
    //   !pageBox.pokemon[findPokemonIndex].isChecked;
    //   ],
    // };

    handleUpdateActiveList(pageBox, true);
  }

  return (
    <PokedexContext.Provider
      value={{
        resetPage,
        pokedexShown,
        viewGenderDifference,
        viewOnlyOneForm,
        orderList,
        handleViewGenderDifference,
        handleViewOnlyOneForm,
        filterByGender,
        filterByOnlyOneForm,
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
        handleCheck,
        showChecked,
        showUnchecked,
        setShowChecked,
        setShowUnchecked,
        passListThroughFilters,
        handleToggleCheck,
        showAllCheckedAndUnchecked,
        passThroughFilters,
        handleSelectGame,
        huntGameSelection,
        setLocalStorage,
        expandPokemonList,
        compactPokemonList,
        getLocalStorage,
        fullPokedex,
        // SORTING
        handleSorting,
        sortByNationalDex,
        sortByPaldeaDex,
        sortByKitakamiDex,
        sortByGalarDex,
        sortByIsleOfArmorDex,
        sortByCrownTundraDex,
        sortByHisuiDex,
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
