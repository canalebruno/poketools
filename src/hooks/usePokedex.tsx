"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  GameSelection,
  List,
  ListOnStorage,
  Pokemon,
  PokemonCustomBox,
  PokemonCustomBoxShort,
  User,
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
  | "paldean-tm"
  | "paldean-bb";

interface PokedexContextData {
  // VARIABLES

  // // GLOBAL
  /**
   * It is the visually Pokemon list shown on boxes, after being filtered.
   */
  pokedexShown: PokemonShown[];
  /**
   * Sets the visually Pokemon list shown on boxes, after being filtered.
   */
  setPokedexShown: (pokedex: Pokemon[]) => void;
  /**
   * All entries from the database. Rendered on hook.
   */
  fullPokedex: Pokemon[];
  /**
   * For backing up a pages original Pokedex Shown (without filters).
   */
  backupPokedex: Pokemon[];
  /**
   * Used to prevent re-rendering filters. After rendered the first time it becomes false.
   */
  firstLoad: boolean;
  /**
   * Used to prevent re-rendering filters. After rendered the first time it should become false.
   */
  setFirstLoad: (b: boolean) => void;

  // // // FILTERS
  /**
   * If true it will show the female counterparts of Pokémon with gender differences.
   * If false it will show only the male Pokémon.
   */
  viewGenderDifference: boolean;
  /**
   * If true it will show only one form of the Pokémon, usually the formOrder "00" (but depending on base game).
   * It will always turn false the viewGenderDifference.
   * If false it will show all many forms.
   */
  viewOnlyOneForm: boolean;
  /**
   * It is the order it is sorted:
   * National, Galar, Isle of Armor, Crown Tundra, Hisui, Paldea or Kitakami Dex.
   */
  orderList:
    | "paldean"
    | "paldean-tm"
    | "paldean-bb"
    | "national"
    | "hisuian"
    | "galarian"
    | "galarian-ioa"
    | "galarian-ct";
  /**
   * If true it will separate the boxes by generations.
   * If false the generations will continue on the same box.
   */
  breakByGen: boolean;
  /**
   * Sets true or false to separate boxes by generations
   */
  setBreakByGen: (b: boolean) => void;
  /**
   * If true it will highlight the searched Pokémon.
   * Usually false.
   */
  highlightPokemon: string;
  /**
   * It will set highlight to the searched Pokémon.
   */
  setHighlightPokemon: (term: string) => void;

  // // BUILDER BOX
  /**
   * All Custom Boxes gotten from the local storage
   */
  customBoxes: List[];
  /**
   * The current box from custom boxes.
   */
  pageBox: List;
  /**
   * Set the current box from custom boxes.
   */
  setPageBox: (l: List) => void;
  /**
   * Filter by Pokémon included in the game chosen.
   */
  huntGameSelection: GameSelection;
  /**
   * If true will show only the checked Pokémon.
   */
  showChecked: boolean;
  /**
   * If true will show only the unchecked Pokémon.
   */
  showUnchecked: boolean;
  /**
   * If true will show both checked and unchecked Pokémon.
   */
  showAllCheckedAndUnchecked: boolean;

  // HANDLE FUNCTIONS
  /**
   * If viewGenderDiffernce is set to be true, it makes viewOnlyOneForm false.
   */
  handleViewGenderDifference: () => void;
  /**
   * If viewOnlyOneForm is set to be true, it makes viewGenderDifference false.
   */
  handleViewOnlyOneForm: () => void;
  /**
   * Sets a new sorting order in OrderList and sorts the PokedexShown array.
   * @param value Is the new sorting order to be set.
   */
  handleSorting: (value: SortingLists) => void;

  // // BUILDER BOX
  /**
   * Deletes the active list.
   */
  handleDeleteList: () => void;
  /**
   * Adds a new pokémon to the active custom box.
   * @param id The pokémon id to be added.
   * @param shouldAddShiny If it is going to be shiny or not.
   */
  handleAddPokemon: (id: string, shouldAddShiny: boolean) => void;
  /**
   * Removes a Pokémon from the active list.
   * @param customBoxId The customBoxId of the Pokémon to be removed.
   */
  handleRemovePokemon: (customBoxId: string) => void;
  /**
   * Removes all checked or all unchecked Pokémon.
   * @param removeChecked If true removes all checked Pokémon. If false removes all unchecked.
   */
  handleBulkRemovePokemon: (removeChecked: boolean) => void;
  /**
   * Checks or unchecks a Pokémon.
   * @param id The Pokémon id that will be checked or unchecked.
   */
  handleCheck: (idPokemon: string, idUser: string) => void;
  /**
   * A single function to change the checking buttons selection.
   * It can't be all three off.
   * Check true = uncheck and all false.
   * Uncheck true = check and all false.
   * All true = check and uncheck false.
   * Check and uncheck false = all true.
   * @param kind "check", "uncheck" or "all".
   * @param value If it's turning on or off.
   */
  handleToggleCheck: (
    kind: "check" | "uncheck" | "all",
    value: boolean
  ) => void;
  /**
   * Will filter by the selected game.
   */
  handleSelectGame: (selection: GameSelection) => void;
  /**
   * Needs description.
   */
  setFullPokedex: (p: Pokemon[]) => void;

  // PAGE FUNCTIONS
  /**
   * Sets the current page pokedex to be used as backup.
   */
  loadPokedex: (loadingPokedex: Pokemon[]) => void; // GIVE DESCRIPTION
  /**
   * When loading a new page it resets the filter variables to the page's default.
   */
  resetControls: () => void;

  // LOCAL STORAGE
  /**
   * Retrieve custom lists from local storage
   */
  getLocalStorage: () => void | List[];
  /**
   * After getting list from storage it adds the pokemon properties
   * @param list This is the compacted list to be expanded
   */
  expandPokemonList: (list: PokemonCustomBoxShort[]) => PokemonCustomBox[];
  /**
   * Before saving list on storage it compacts to just the custom list essential
   * @param list This is the expanded list to be compacted
   */
  compactPokemonList: (list: PokemonCustomBox[]) => PokemonCustomBoxShort[];
  setCustomBoxes: (list: List[]) => void;
  setCloudStorage: (user: User) => void;
  cloudStorage: User;
  currentTrackerList: string;
  setCurrentTrackerList: (newValue: string) => void;
  passThroughFilters: (latestPageBox?: List) => void;
}

const PokedexContext = createContext<PokedexContextData>(
  {} as PokedexContextData
);

export interface PokemonShown extends Pokemon {
  customBoxId?: string;
  isShiny?: boolean;
  isChecked?: boolean;
}

export function PokedexProvider({ children }: PokedexProviderProps) {
  const [pokedexShown, setPokedexShown] = useState<PokemonShown[]>(
    [] as PokemonShown[]
  );
  const [backupPokedex, setBackupPokedex] = useState<Pokemon[]>(
    [] as Pokemon[]
  );
  const [cloudStorage, setCloudStorage] = useState<User>({} as User);
  const [viewGenderDifference, setViewGenderDifference] = useState(true);
  const [viewOnlyOneForm, setViewOnlyOneForm] = useState(false);
  const [breakByGen, setBreakByGen] = useState(false);
  const [orderList, setOrderList] = useState<
    | "paldean"
    | "paldean-tm"
    | "paldean-bb"
    | "national"
    | "hisuian"
    | "galarian"
    | "galarian-ioa"
    | "galarian-ct"
  >("national");
  const [highlightPokemon, setHighlightPokemon] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    loadPokedex([] as PokemonShown[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function loadPokedex(loadingPokedex: PokemonShown[]) {
    setFirstLoad(true);
    setBackupPokedex(loadingPokedex);
    setPokedexShown(loadingPokedex);
    passThroughFilters();
  }

  function resetControls() {
    switch (pathname) {
      case "/svboxes":
        setOrderList("paldean");
        break;
      case "/teal-mask-boxes":
        setOrderList("paldean-tm");
        break;
      case "/blueberry-academy-boxes":
        setOrderList("paldean-bb");
        break;
      default:
        setOrderList("national");
    }

    setViewGenderDifference(true);
    setViewOnlyOneForm(false);
    setBreakByGen(false);
    setShowUnchecked(false);
    setShowChecked(false);
    setShowAllCheckedAndUnchecked(true);
    setHuntGameSelection(null);
  }

  function handleViewOnlyOneForm() {
    const newSetting = !viewOnlyOneForm;

    setViewOnlyOneForm(newSetting);

    if (newSetting) {
      setViewGenderDifference(false);
    }
  }

  function handleViewGenderDifference() {
    const newSetting = !viewGenderDifference;

    setViewGenderDifference(newSetting);

    if (newSetting) {
      setViewOnlyOneForm(false);
    }
  }

  // function filterByGender() {
  //   return pokedexShown.filter((pkmn) => {
  //     return !pkmn.data.genderDifference;
  //   });
  // }

  function NEWfilterByGender(pokemon: Pokemon) {
    return !pokemon.data.genderDifference;
  }

  // function filterListByGender(list: PokemonCustomBox[]) {
  //   return list.filter((pkmn) => {
  //     return !pkmn.data.genderDifference;
  //   });
  // }

  // function filterByOnlyOneForm() {
  //   return filterByGender().filter((pkmn) => {
  //     switch (pathname) {
  //       case "/teal-mask-boxes":
  //         return (
  //           (pkmn.formOrder === "00" ||
  //             pkmn.id === "0741_03" ||
  //             pkmn.id === "0550_02" ||
  //             pkmn.id === "0901_01") &&
  //           pkmn.id !== "0741_00" &&
  //           pkmn.id !== "0901_00" &&
  //           pkmn.id !== "0550_00"
  //         );
  //       case "/svboxes":
  //         return (
  //           (pkmn.formOrder === "00" ||
  //             pkmn.id === "0128_01" ||
  //             pkmn.id === "0194_01" ||
  //             pkmn.id === "0666_19") &&
  //           pkmn.id !== "0194_00" &&
  //           pkmn.id !== "0666_00"
  //         );
  //       default:
  //         return pkmn.formOrder === "00";
  //     }
  //   });
  // }

  function NEWfilterByOnlyOneForm(pokemon: Pokemon) {
    if (!NEWfilterByGender(pokemon)) {
      return false;
    }

    switch (pathname) {
      case "/teal-mask-boxes":
        return (
          (pokemon.formOrder === "00" ||
            pokemon.id === "0741_03" ||
            pokemon.id === "0550_02" ||
            pokemon.id === "0901_01") &&
          pokemon.id !== "0741_00" &&
          pokemon.id !== "0901_00" &&
          pokemon.id !== "0550_00"
        );
      case "/svboxes":
        return (
          (pokemon.formOrder === "00" ||
            pokemon.id === "0128_01" ||
            pokemon.id === "0194_01" ||
            pokemon.id === "0666_19") &&
          pokemon.id !== "0194_00" &&
          pokemon.id !== "0666_00"
        );
      default:
        return pokemon.formOrder === "00" || pokemon.id === "0774_01";
    }
  }

  // function filterListByOnlyOneForm(list: PokemonCustomBox[]) {
  //   return filterListByGender(list).filter((pkmn) => {
  //     return pkmn.formOrder === "00";
  //   });
  // }

  function passThroughFilters(latestPageBox?: List) {
    let finalList;

    if (pathname.includes("tracker/")) {
      if (latestPageBox) {
        finalList = latestPageBox.pokemon;
      } else if (pageBox.pokemon) {
        finalList = pageBox.pokemon;
      } else {
        return;
      }
    } else {
      finalList = backupPokedex;
    }

    if (viewOnlyOneForm) {
      finalList = finalList.filter((pkmn) => NEWfilterByOnlyOneForm(pkmn));
    } else if (!viewGenderDifference) {
      finalList = finalList.filter((pkmn) => NEWfilterByGender(pkmn));
    }

    if (pathname.includes("tracker/")) {
      finalList = [...filterListByGame(finalList as PokemonCustomBox[])];
      finalList = [...filterListByChecked(finalList as PokemonCustomBox[])];
    }

    finalList = sortList(finalList, orderList);

    setPokedexShown(finalList);
  }

  // SORTING
  /**
   * Sorting with the National Dex property.
   * @param a This is the first Pokémon to be tested
   * @param b This is the second Pokémon to be tested
   */
  function sortByNationalDex(a: Pokemon, b: Pokemon) {
    return a.id > b.id ? 1 : -1;
  }

  /**
   * Sorting with the Paldea Dex property.
   * @param a This is the first Pokémon to be tested
   * @param b This is the second Pokémon to be tested
   */
  function sortByPaldeaDex(a: Pokemon, b: Pokemon) {
    if (a.dex.paldeaDex === b.dex.paldeaDex) {
      return sortByNationalDex(a, b);
    } else if (!a.dex.paldeaDex || !b.dex.paldeaDex) {
      return 0;
    } else {
      return a.dex.paldeaDex - b.dex.paldeaDex;
    }
  }

  /**
   * Sorting with the Kitakami Dex property from the Teal Mask DLC.
   * @param a This is the first Pokémon to be tested
   * @param b This is the second Pokémon to be tested
   */
  function sortByKitakamiDex(a: Pokemon, b: Pokemon) {
    if (a.dex.paldeaTMDex === b.dex.paldeaTMDex) {
      return sortByNationalDex(a, b);
    } else if (!a.dex.paldeaTMDex || !b.dex.paldeaTMDex) {
      return 0;
    } else {
      return a.dex.paldeaTMDex - b.dex.paldeaTMDex;
    }
  }

  /**
   * Sorting with the Kitakami Dex property from the Teal Mask DLC.
   * @param a This is the first Pokémon to be tested
   * @param b This is the second Pokémon to be tested
   */
  function sortByBBAcademyDex(a: Pokemon, b: Pokemon) {
    if (a.dex.paldeaBBDex === b.dex.paldeaBBDex) {
      return sortByNationalDex(a, b);
    } else if (!a.dex.paldeaBBDex || !b.dex.paldeaBBDex) {
      return 0;
    } else {
      return a.dex.paldeaBBDex - b.dex.paldeaBBDex;
    }
  }

  /**
   * Sorting with the Galar Dex property.
   * @param a This is the first Pokémon to be tested
   * @param b This is the second Pokémon to be tested
   */
  function sortByGalarDex(a: Pokemon, b: Pokemon) {
    if (a.dex.galarDex === b.dex.galarDex) {
      return sortByNationalDex(a, b);
    } else if (!a.dex.galarDex || !b.dex.galarDex) {
      return 0;
    } else {
      return a.dex.galarDex - b.dex.galarDex;
    }
  }

  /**
   * Sorting with the Isle of Armor Dex property from the Isle of Armor DLC.
   * @param a This is the first Pokémon to be tested
   * @param b This is the second Pokémon to be tested
   */
  function sortByIsleOfArmorDex(a: Pokemon, b: Pokemon) {
    if (a.dex.galarIoaDex === b.dex.galarIoaDex) {
      return sortByNationalDex(a, b);
    } else if (!a.dex.galarIoaDex || !b.dex.galarIoaDex) {
      return 0;
    } else {
      return a.dex.galarIoaDex - b.dex.galarIoaDex;
    }
  }

  /**
   * Sorting with the Crown Tundra Dex property from the Crown Tundra DLC.
   * @param a This is the first Pokémon to be tested
   * @param b This is the second Pokémon to be tested
   */
  function sortByCrownTundraDex(a: Pokemon, b: Pokemon) {
    if (a.dex.galarCtDex === b.dex.galarCtDex) {
      return sortByNationalDex(a, b);
    } else if (!a.dex.galarCtDex || !b.dex.galarCtDex) {
      return 0;
    } else {
      return a.dex.galarCtDex - b.dex.galarCtDex;
    }
  }

  /**
   * Sorting with the Hisui Dex property.
   * @param a This is the first Pokémon to be tested
   * @param b This is the second Pokémon to be tested
   */
  function sortByHisuiDex(a: Pokemon, b: Pokemon) {
    if (a.dex.hisuiDex === b.dex.hisuiDex) {
      return sortByNationalDex(a, b);
    } else if (!a.dex.hisuiDex || !b.dex.hisuiDex) {
      return 0;
    } else {
      return a.dex.hisuiDex - b.dex.hisuiDex;
    }
  }

  /**
   * Sorting by the CustomBoxId property to keep in adding order.
   * @param a This is the first Pokémon to be tested
   * @param b This is the second Pokémon to be tested
   */
  function sortByCustomBoxId(a: PokemonShown, b: PokemonShown) {
    if (a.id === b.id && a.customBoxId && b.customBoxId) {
      return a.customBoxId > b.customBoxId ? 1 : -1;
    } else {
      return 0;
    }
  }

  function handleSorting(value: SortingLists) {
    if (!pokedexShown) {
      return;
    }

    setOrderList(value);

    const sortedList = sortList(pokedexShown, value);

    setPokedexShown(sortedList);
  }

  function sortList(
    list: PokemonCustomBox[] | Pokemon[],
    order: SortingLists
  ): PokemonCustomBox[] | Pokemon[] {
    if (order === "national") {
      return list
        .sort((a, b) => sortByNationalDex(a, b))
        .sort((a, b) => sortByCustomBoxId(a, b));
    }

    let notInDex = [] as PokemonCustomBox[] | Pokemon[];

    let inDex = [] as PokemonCustomBox[] | Pokemon[];

    switch (order) {
      case "paldean":
        notInDex = list.filter((pkmn) => {
          return !pkmn.dex.paldeaDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.dex.paldeaDex;
          })
          .sort((a, b) => sortByPaldeaDex(a, b));
        break;
      case "paldean-tm":
        notInDex = list.filter((pkmn) => {
          return !pkmn.dex.paldeaTMDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.dex.paldeaTMDex;
          })
          .sort((a, b) => sortByKitakamiDex(a, b));
        break;
      case "paldean-bb":
        notInDex = list.filter((pkmn) => {
          return !pkmn.dex.paldeaBBDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.dex.paldeaBBDex;
          })
          .sort((a, b) => sortByBBAcademyDex(a, b));
        break;
      case "hisuian":
        notInDex = list.filter((pkmn) => {
          return !pkmn.dex.hisuiDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.dex.hisuiDex;
          })
          .sort((a, b) => sortByHisuiDex(a, b));
        break;
      case "galarian":
        notInDex = list.filter((pkmn) => {
          return !pkmn.dex.galarDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.dex.galarDex;
          })
          .sort((a, b) => sortByGalarDex(a, b));
        break;
      case "galarian-ioa":
        notInDex = list.filter((pkmn) => {
          return !pkmn.dex.galarIoaDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.dex.galarIoaDex;
          })
          .sort((a, b) => sortByIsleOfArmorDex(a, b));

        break;
      case "galarian-ct":
        notInDex = list.filter((pkmn) => {
          return !pkmn.dex.galarCtDex;
        });

        inDex = list
          .filter((pkmn) => {
            return pkmn.dex.galarCtDex;
          })
          .sort((a, b) => sortByCrownTundraDex(a, b));

        break;
    }

    const sortedList = [
      ...inDex,
      ...notInDex.sort((a, b) => sortByNationalDex(a, b)),
    ];
    return sortedList.sort((a, b) => sortByCustomBoxId(a, b));
  }

  // SHINY TRACKER

  // Se livrar do pagebox
  const [pageBox, setPageBox] = useState<List>({} as List);
  const [currentTrackerList, setCurrentTrackerList] = useState("");
  const [customBoxes, setCustomBoxes] = useState<List[]>([] as List[]);
  const [showChecked, setShowChecked] = useState(false);
  const [showUnchecked, setShowUnchecked] = useState(false);
  const [showAllCheckedAndUnchecked, setShowAllCheckedAndUnchecked] =
    useState(true);
  const [huntGameSelection, setHuntGameSelection] =
    useState<GameSelection>(null);
  const [fullPokedex, setFullPokedex] = useState([] as Pokemon[]);

  useEffect(() => {
    if (
      !pathname.includes("tracker/") ||
      (pageBox.pokemon && pageBox.pokemon.length > 0)
    ) {
      passThroughFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    viewGenderDifference,
    viewOnlyOneForm,
    showChecked,
    showUnchecked,
    showAllCheckedAndUnchecked,
    huntGameSelection,
    cloudStorage,
  ]);

  function expandPokemonList(list: PokemonCustomBoxShort[]) {
    return list.map((pkmn) => {
      const extraInfo = fullPokedex.find((item) => {
        return item.id === pkmn.id;
      });

      return {
        ...pkmn,
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

    // if (fullPokedex.length < 1) {
    //   return;
    // }

    if (data) {
      const jsonData: ListOnStorage[] = JSON.parse(data);

      const expandedData = jsonData.map((box) => {
        return {
          ...box,
          pokemon: expandPokemonList(box.pokemon),
        };
      });

      return expandedData;
    }
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

  function handleSelectGame(selection: GameSelection) {
    setHuntGameSelection(selection);
  }

  function filterListByGame(list: PokemonCustomBox[]) {
    let initialList;
    switch (huntGameSelection?.baseGame) {
      case "swsh":
        initialList = list.filter((pkmn) => {
          return (
            pkmn.dex.galarDex ||
            (huntGameSelection?.exclusives?.includes("swsh-ioa") &&
              pkmn.dex.galarIoaDex) ||
            (huntGameSelection?.exclusives?.includes("swsh-ct") &&
              pkmn.dex.galarCtDex) ||
            pkmn.dex.swshHomeAvailable
          );
        });

        if (!huntGameSelection?.exclusives?.includes("swsh-sw")) {
          // So it is Shield
          return initialList.filter((pkmn) => {
            return (
              pkmn.id !== "0068_01" &&
              pkmn.id !== "0083_01" &&
              pkmn.id !== "0550_00" &&
              pkmn.id !== "0554_01" &&
              pkmn.id !== "0555_02" &&
              pkmn.id !== "0555_03" &&
              pkmn.id !== "0839_01" &&
              pkmn.id !== "0876_00" &&
              pkmn.dex.nationalDex !== 127 &&
              pkmn.dex.nationalDex !== 250 &&
              pkmn.dex.nationalDex !== 303 &&
              pkmn.dex.nationalDex !== 338 &&
              pkmn.dex.nationalDex !== 381 &&
              pkmn.dex.nationalDex !== 383 &&
              pkmn.dex.nationalDex !== 483 &&
              pkmn.dex.nationalDex !== 641 &&
              pkmn.dex.nationalDex !== 643 &&
              pkmn.dex.nationalDex !== 716 &&
              pkmn.dex.nationalDex !== 766 &&
              pkmn.dex.nationalDex !== 776 &&
              pkmn.dex.nationalDex !== 791 &&
              pkmn.dex.nationalDex !== 841 &&
              pkmn.dex.nationalDex !== 865 &&
              pkmn.dex.nationalDex !== 874 &&
              pkmn.dex.nationalDex !== 888 &&
              !pkmn.data.family.includes(138) &&
              !pkmn.data.family.includes(273) &&
              !pkmn.data.family.includes(371) &&
              !pkmn.data.family.includes(559) &&
              !pkmn.data.family.includes(574) &&
              !pkmn.data.family.includes(627) &&
              !pkmn.data.family.includes(633) &&
              !pkmn.data.family.includes(684) &&
              !pkmn.data.family.includes(692) &&
              !pkmn.data.family.includes(782)
            );
          });
        } else if (!huntGameSelection?.exclusives?.includes("swsh-sh")) {
          // So it is Sword
          return initialList.filter((pkmn) => {
            return (
              pkmn.id !== "0077_01" &&
              pkmn.id !== "0078_01" &&
              pkmn.id !== "0094_02" &&
              pkmn.id !== "0131_01" &&
              pkmn.id !== "0222_01" &&
              pkmn.id !== "0550_01" &&
              pkmn.id !== "0876_00_F" &&
              pkmn.dex.nationalDex !== 214 &&
              pkmn.dex.nationalDex !== 249 &&
              pkmn.dex.nationalDex !== 302 &&
              pkmn.dex.nationalDex !== 337 &&
              pkmn.dex.nationalDex !== 380 &&
              pkmn.dex.nationalDex !== 382 &&
              pkmn.dex.nationalDex !== 484 &&
              pkmn.dex.nationalDex !== 642 &&
              pkmn.dex.nationalDex !== 644 &&
              pkmn.dex.nationalDex !== 717 &&
              pkmn.dex.nationalDex !== 765 &&
              pkmn.dex.nationalDex !== 780 &&
              pkmn.dex.nationalDex !== 792 &&
              pkmn.dex.nationalDex !== 842 &&
              pkmn.dex.nationalDex !== 864 &&
              pkmn.dex.nationalDex !== 875 &&
              pkmn.dex.nationalDex !== 889 &&
              !pkmn.data.family.includes(140) &&
              !pkmn.data.family.includes(246) &&
              !pkmn.data.family.includes(270) &&
              !pkmn.data.family.includes(443) &&
              !pkmn.data.family.includes(453) &&
              !pkmn.data.family.includes(577) &&
              !pkmn.data.family.includes(629) &&
              !pkmn.data.family.includes(682) &&
              !pkmn.data.family.includes(690) &&
              !pkmn.data.family.includes(704)
            );
          });
        } else {
          return initialList;
        }
      case "sv":
        initialList = list.filter((pkmn) => {
          return (
            pkmn.dex.paldeaDex ||
            (huntGameSelection?.exclusives?.includes("sv-tm") &&
              pkmn.dex.paldeaTMDex) ||
            (huntGameSelection?.exclusives?.includes("sv-id") &&
              pkmn.dex.paldeaBBDex) ||
            pkmn.dex.svHomeAvailable
          );
        });

        if (!huntGameSelection?.exclusives?.includes("sv-s")) {
          // So it is Violet
          return initialList.filter((pkmn) => {
            return (
              pkmn.id !== "0037_01" &&
              pkmn.id !== "0038_01" &&
              pkmn.id !== "0128_02" &&
              pkmn.dex.nationalDex !== 936 &&
              pkmn.dex.nationalDex !== 984 &&
              pkmn.dex.nationalDex !== 985 &&
              pkmn.dex.nationalDex !== 986 &&
              pkmn.dex.nationalDex !== 987 &&
              pkmn.dex.nationalDex !== 988 &&
              pkmn.dex.nationalDex !== 989 &&
              pkmn.dex.nationalDex !== 1005 &&
              pkmn.dex.nationalDex !== 1007 &&
              pkmn.dex.nationalDex !== 1009 &&
              pkmn.dex.nationalDex !== 1020 &&
              pkmn.dex.nationalDex !== 1021 &&
              !pkmn.data.family.includes(207) &&
              !pkmn.data.family.includes(246) &&
              !pkmn.data.family.includes(408) &&
              !pkmn.data.family.includes(425) &&
              !pkmn.data.family.includes(434) &&
              !pkmn.data.family.includes(633) &&
              !pkmn.data.family.includes(690) &&
              !pkmn.data.family.includes(765) &&
              !pkmn.data.family.includes(845) &&
              !pkmn.data.family.includes(874)
            );
          });
        } else if (!huntGameSelection?.exclusives?.includes("sv-v")) {
          // So it is Scarlet
          return initialList.filter((pkmn) => {
            return (
              pkmn.id !== "0027_01" &&
              pkmn.id !== "0028_01" &&
              pkmn.id !== "0128_03" &&
              pkmn.dex.nationalDex !== 937 &&
              pkmn.dex.nationalDex !== 990 &&
              pkmn.dex.nationalDex !== 991 &&
              pkmn.dex.nationalDex !== 992 &&
              pkmn.dex.nationalDex !== 993 &&
              pkmn.dex.nationalDex !== 994 &&
              pkmn.dex.nationalDex !== 995 &&
              pkmn.dex.nationalDex !== 1006 &&
              pkmn.dex.nationalDex !== 1008 &&
              pkmn.dex.nationalDex !== 1010 &&
              pkmn.dex.nationalDex !== 1022 &&
              pkmn.dex.nationalDex !== 1023 &&
              !pkmn.data.family.includes(190) &&
              !pkmn.data.family.includes(200) &&
              !pkmn.data.family.includes(316) &&
              !pkmn.data.family.includes(371) &&
              !pkmn.data.family.includes(410) &&
              !pkmn.data.family.includes(692) &&
              !pkmn.data.family.includes(766) &&
              !pkmn.data.family.includes(877) &&
              !pkmn.data.family.includes(885) &&
              !pkmn.data.family.includes(875)
            );
          });
        } else {
          return initialList;
        }
      case "pla":
        return list.filter((pkmn) => {
          return pkmn.dex.hisuiDex;
        });
      default:
        return list;
    }
  }

  // ORGANIZAR OS OUTROS FILTROS

  async function handleAddPokemon(id: string, shouldAddShiny: boolean) {
    const findPokemonToAdd = fullPokedex.find((pokemon) => {
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

    await fetch(`/api/users/${cloudStorage.email}/${pageBox.name}`, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pokemonToAdd),
    })
      .then((response) => response.json())
      .then((data) => {
        // aqui
        updatePageBox(data.updatedUser);
      });
  }

  function updatePageBox(updatedUser: User) {
    setCloudStorage(updatedUser);

    const findCurrentBox = updatedUser.boxes.find(
      (b) => b.name === pageBox.name
    );

    setPageBox(findCurrentBox!);
    passThroughFilters(findCurrentBox);
  }

  async function handleRemovePokemon(customBoxId: string) {
    await fetch(
      `/api/users/${cloudStorage.email}/${pageBox.name}/${customBoxId}`,
      {
        cache: "no-store",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        updatePageBox(data.updatedUser);
      });
  }

  async function handleBulkRemovePokemon(removeChecked: boolean) {
    let newList = pageBox.pokemon;

    if (removeChecked) {
      newList = newList.filter((pkmn) => {
        return !pkmn.isChecked;
      });
    } else {
      newList = newList.filter((pkmn) => {
        return pkmn.isChecked;
      });
    }

    await fetch(`/api/users/${cloudStorage.email}/${pageBox.name}`, {
      cache: "no-store",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updatedBox: newList,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        updatePageBox(data.updatedUser);
      });
  }

  async function handleDeleteList() {
    await fetch(`/api/users/${cloudStorage.email}/${pageBox.name}`, {
      cache: "no-store",
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setCloudStorage(data.updatedUser);
      });
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

  async function handleCheck(idPokemon: string, idUser: string) {
    const findPokemonIndex = pageBox.pokemon.findIndex((pkmn) => {
      return pkmn.customBoxId === idPokemon;
    });

    if (findPokemonIndex < 0) {
      return;
    }

    const currentCheck = pageBox.pokemon[findPokemonIndex].isChecked;

    pageBox.pokemon[findPokemonIndex].isChecked = !currentCheck;

    await fetch(`/api/users/${idUser}/${pageBox.name}/${idPokemon}`, {
      cache: "no-store",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newCheck: !currentCheck,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        updatePageBox(data.updatedUser);
      });
  }

  return (
    <PokedexContext.Provider
      value={{
        setCloudStorage,
        setCustomBoxes,
        handleViewGenderDifference,
        pokedexShown,
        viewGenderDifference,
        viewOnlyOneForm,
        orderList,
        handleViewOnlyOneForm,
        loadPokedex,
        resetControls,
        breakByGen,
        setBreakByGen,
        highlightPokemon,
        setHighlightPokemon,
        firstLoad,
        setFirstLoad,
        setPokedexShown,
        backupPokedex,
        customBoxes,
        handleAddPokemon,
        pageBox,
        setPageBox,
        handleRemovePokemon,
        handleBulkRemovePokemon,
        handleDeleteList,
        handleCheck,
        showChecked,
        showUnchecked,
        handleToggleCheck,
        showAllCheckedAndUnchecked,
        handleSelectGame,
        huntGameSelection,
        expandPokemonList,
        compactPokemonList,
        getLocalStorage,
        fullPokedex,
        handleSorting,
        setFullPokedex,
        currentTrackerList,
        setCurrentTrackerList,
        cloudStorage,
        passThroughFilters,
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
