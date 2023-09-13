import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Games, List, Pokemon, PokemonCustomBox } from "../utils/types";

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
  handleSorting: (value: SortingLists) => void;
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

  function resetControls() {
    switch (router.pathname) {
      case "/svboxes":
        handleSorting("paldean");
        break;
      default:
        handleSorting("national");
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

  function updatePokedex(pokedexToUpdate: Pokemon[]) {
    if (orderList !== "paldean" && orderList !== "national") {
      return;
    }

    let pokedexToUpdateOrederd = [] as Pokemon[];

    if (orderList === "paldean") {
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

  function handleSorting(value: SortingLists) {
    if (!pokedexShown) {
      return;
    }

    setOrderList(value);

    if (value === "national") {
      pokedexShown.sort((a, b) => {
        return a.id > b.id ? 1 : -1;
      });
      return;
    }

    let notInDex = [] as Pokemon[];

    let inDex = [] as Pokemon[];

    switch (value) {
      case "paldean":
        notInDex = pokedexShown.filter((pkmn) => {
          return !pkmn.paldeaDex;
        });

        inDex = pokedexShown
          .filter((pkmn) => {
            return pkmn.paldeaDex;
          })
          .sort((a, b) => {
            if (a.paldeaDex === b.paldeaDex) {
              return a.id > b.id ? 1 : -1;
            } else if (!a.paldeaDex || !b.paldeaDex) {
              return 0;
            } else {
              return a.paldeaDex - b.paldeaDex;
            }
          });
        break;
      case "hisuian":
        notInDex = pokedexShown.filter((pkmn) => {
          return !pkmn.hisuiDex;
        });

        inDex = pokedexShown
          .filter((pkmn) => {
            return pkmn.hisuiDex;
          })
          .sort((a, b) => {
            if (a.hisuiDex === b.hisuiDex) {
              return a.id > b.id ? 1 : -1;
            } else if (!a.hisuiDex || !b.hisuiDex) {
              return 0;
            } else {
              return a.hisuiDex - b.hisuiDex;
            }
          });
        break;
      case "galarian":
        notInDex = pokedexShown.filter((pkmn) => {
          return !pkmn.galarDex;
        });

        inDex = pokedexShown
          .filter((pkmn) => {
            return pkmn.galarDex;
          })
          .sort((a, b) => {
            if (a.galarDex === b.galarDex) {
              return a.id > b.id ? 1 : -1;
            } else if (!a.galarDex || !b.galarDex) {
              return 0;
            } else {
              return a.galarDex - b.galarDex;
            }
          });
        break;
      case "galarian-ioa":
        notInDex = pokedexShown.filter((pkmn) => {
          return !pkmn.galarIoaDex;
        });

        inDex = pokedexShown
          .filter((pkmn) => {
            return pkmn.galarIoaDex;
          })
          .sort((a, b) => {
            if (a.galarIoaDex === b.galarIoaDex) {
              return a.id > b.id ? 1 : -1;
            } else if (!a.galarIoaDex || !b.galarIoaDex) {
              return 0;
            } else {
              return a.galarIoaDex - b.galarIoaDex;
            }
          });

        break;
      case "galarian-ct":
        notInDex = pokedexShown.filter((pkmn) => {
          return !pkmn.galarCtDex;
        });

        inDex = pokedexShown
          .filter((pkmn) => {
            return pkmn.galarCtDex;
          })
          .sort((a, b) => {
            if (a.galarCtDex === b.galarCtDex) {
              return a.id > b.id ? 1 : -1;
            } else if (!a.galarCtDex || !b.galarCtDex) {
              return 0;
            } else {
              return a.galarCtDex - b.galarCtDex;
            }
          });
        break;
    }

    setPokedexShown([
      ...inDex,
      ...notInDex.sort((a, b) => {
        return a.id > b.id ? 1 : -1;
      }),
    ]);
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

  function passThroughFilters() {
    let finalList = fullListPokedex;

    if (viewOnlyOneForm) {
      finalList = [...filterByOnlyOneForm()];
    } else if (!viewGenderDifference) {
      finalList = [...filterByGender()];
    }

    setPokedexShown(finalList);
  }

  function sortList(list: PokemonCustomBox[], order: SortingLists) {
    if (order === "national") {
      return list.sort((a, b) => {
        return a.id > b.id ? 1 : -1;
      });
    }

    let notInDex;

    let inDex;

    switch (order) {
      case "paldean":
        notInDex = list.filter((pkmn) => {
          return !pkmn.paldeaDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.paldeaDex;
          })
          .sort((a, b) => {
            if (a.paldeaDex === b.paldeaDex) {
              return a.id > b.id ? 1 : -1;
            } else if (!a.paldeaDex || !b.paldeaDex) {
              return 0;
            } else {
              return a.paldeaDex - b.paldeaDex;
            }
          });
        break;
      case "paldean-tm":
        notInDex = list.filter((pkmn) => {
          return !pkmn.paldeaTMDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.paldeaTMDex;
          })
          .sort((a, b) => {
            if (a.paldeaTMDex === b.paldeaTMDex) {
              return a.id > b.id ? 1 : -1;
            } else if (!a.paldeaTMDex || !b.paldeaTMDex) {
              return 0;
            } else {
              return a.paldeaTMDex - b.paldeaTMDex;
            }
          });
        break;
      case "hisuian":
        notInDex = list.filter((pkmn) => {
          return !pkmn.hisuiDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.hisuiDex;
          })
          .sort((a, b) => {
            if (a.hisuiDex === b.hisuiDex) {
              return a.id > b.id ? 1 : -1;
            } else if (!a.hisuiDex || !b.hisuiDex) {
              return 0;
            } else {
              return a.hisuiDex - b.hisuiDex;
            }
          });
        break;
      case "galarian":
        notInDex = list.filter((pkmn) => {
          return !pkmn.galarDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.galarDex;
          })
          .sort((a, b) => {
            if (a.galarDex === b.galarDex) {
              return a.id > b.id ? 1 : -1;
            } else if (!a.galarDex || !b.galarDex) {
              return 0;
            } else {
              return a.galarDex - b.galarDex;
            }
          });
        break;
      case "galarian-ioa":
        notInDex = list.filter((pkmn) => {
          return !pkmn.galarIoaDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.galarIoaDex;
          })
          .sort((a, b) => {
            if (a.galarIoaDex === b.galarIoaDex) {
              return a.id > b.id ? 1 : -1;
            } else if (!a.galarIoaDex || !b.galarIoaDex) {
              return 0;
            } else {
              return a.galarIoaDex - b.galarIoaDex;
            }
          });

        break;
      case "galarian-ct":
        notInDex = list.filter((pkmn) => {
          return !pkmn.galarCtDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.galarCtDex;
          })
          .sort((a, b) => {
            if (a.galarCtDex === b.galarCtDex) {
              return a.id > b.id ? 1 : -1;
            } else if (!a.galarCtDex || !b.galarCtDex) {
              return 0;
            } else {
              return a.galarCtDex - b.galarCtDex;
            }
          });
        break;
    }

    return [
      ...inDex,
      ...notInDex.sort((a, b) => {
        return a.id > b.id ? 1 : -1;
      }),
    ];
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
  const [customBoxes, setCustomBoxes] = useState<List[]>([] as List[]);
  const [fullShinyDex, setFullShinyDex] = useState<Pokemon[]>([] as Pokemon[]);
  const [showChecked, setShowChecked] = useState(false);
  const [showUnchecked, setShowUnchecked] = useState(false);
  const [showAllCheckedAndUnchecked, setShowAllCheckedAndUnchecked] =
    useState(true);
  const [huntGameSelection, setHuntGameSelection] = useState("");

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
    setPokedexShown(pageBox.pokemon);
  }, [pageBox]);

  // useEffect(() => {
  //   if (pageBox.pokemon && pageBox.pokemon.length > 0) {
  //     passThroughFilters();
  //   }
  // }, [showChecked]);

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
      pokemon: sortList(updatedList.pokemon, orderList),
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
        pokemon: sortList(updatedList.pokemon, orderList),
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
        pokedexShown,
        viewGenderDifference,
        viewOnlyOneForm,
        orderList,
        handleViewGenderDifference,
        handleViewOnlyOneForm,
        filterByGender,
        filterByOnlyOneForm,
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
