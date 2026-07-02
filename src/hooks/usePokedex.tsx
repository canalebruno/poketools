"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  GameSelection,
  List,
  ListOnStorage,
  Pokemon,
  PokemonCustomBox,
  PokemonCustomBoxShort,
  SortingList,
  User,
} from "../utils/types";

interface PokedexProviderProps {
  children: ReactNode;
}

interface PokedexContextData {
  pokedexShown: PokemonShown[];
  setPokedexShown: (pokedex: Pokemon[]) => void;
  fullPokedex: Pokemon[];
  backupPokedex: Pokemon[];
  firstLoad: boolean;
  setFirstLoad: (b: boolean) => void;
  viewGenderDifference: boolean;
  viewOnlyOneForm: boolean;
  orderList: SortingList;
  breakByGen: boolean;
  setBreakByGen: (b: boolean) => void;
  highlightPokemon: string;
  setHighlightPokemon: (term: string) => void;
  customBoxes: List[];
  pageBox: List;
  setPageBox: (l: List) => void;
  huntGameSelection: GameSelection;
  showChecked: boolean;
  showUnchecked: boolean;
  showAllCheckedAndUnchecked: boolean;
  handleViewGenderDifference: () => void;
  handleViewOnlyOneForm: () => void;
  handleSorting: (value: SortingList) => void;
  handleDeleteList: () => void;
  handleAddPokemon: (id: string, shouldAddShiny: boolean) => void;
  handleRemovePokemon: (customBoxId: string) => void;
  handleBulkRemovePokemon: (removeChecked: boolean) => void;
  handleCheck: (idPokemon: string, idUser: string) => void;
  handleToggleCheck: (
    kind: "check" | "uncheck" | "all",
    value: boolean,
  ) => void;
  handleSelectGame: (selection: GameSelection) => void;
  setFullPokedex: (p: Pokemon[]) => void;
  loadPokedex: (loadingPokedex: Pokemon[], targetSort: SortingList) => void;
  resetControls: () => void;
  getLocalStorage: () => void | List[];
  expandPokemonList: (list: PokemonCustomBoxShort[]) => PokemonCustomBox[];
  compactPokemonList: (list: PokemonCustomBox[]) => PokemonCustomBoxShort[];
  setCustomBoxes: (list: List[]) => void;
  setCloudStorage: (user: User) => void;
  cloudStorage: User;
  currentTrackerList: string;
  setCurrentTrackerList: (newValue: string) => void;
  passThroughFilters: (latestPageBox?: List) => void;
  setBackupPokedex: (pokedex: Pokemon[]) => void;
}

const PokedexContext = createContext<PokedexContextData>(
  {} as PokedexContextData,
);

export interface PokemonShown extends Pokemon {
  customBoxId?: string;
  isShiny?: boolean;
  isChecked?: boolean;
}

export function PokedexProvider({ children }: PokedexProviderProps) {
  const [pokedexShown, setPokedexShown] = useState<PokemonShown[]>([]);
  const [backupPokedex, setBackupPokedex] = useState<PokemonShown[]>([]);
  const [cloudStorage, setCloudStorage] = useState<User>({} as User);
  const [viewGenderDifference, setViewGenderDifference] = useState(true);
  const [viewOnlyOneForm, setViewOnlyOneForm] = useState(false);
  const [breakByGen, setBreakByGen] = useState(false);
  const [orderList, setOrderList] = useState<SortingList>("national");
  const [highlightPokemon, setHighlightPokemon] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);

  // FIXED: Declared previously missing states causing runtime errors
  const [showChecked, setShowChecked] = useState(false);
  const [showUnchecked, setShowUnchecked] = useState(false);
  const [showAllCheckedAndUnchecked, setShowAllCheckedAndUnchecked] =
    useState(true);
  const [huntGameSelection, setHuntGameSelection] =
    useState<GameSelection>(null);

  const [pageBox, setPageBox] = useState<List>({} as List);
  const [currentTrackerList, setCurrentTrackerList] = useState("");
  const [customBoxes, setCustomBoxes] = useState<List[]>([]);
  const [fullPokedex, setFullPokedex] = useState<Pokemon[]>([]);

  const pathname = usePathname();

  useEffect(() => {
    loadPokedex([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function loadPokedex(
    loadingPokedex: PokemonShown[],
    targetSort: SortingList = "national",
  ) {
    setFirstLoad(true);
    setOrderList(targetSort);
    const freshlySorted = sortList(loadingPokedex, targetSort);
    setBackupPokedex(freshlySorted);
    setPokedexShown(freshlySorted);
  }

  function resetControls() {
    if (pathname === "/svboxes") setOrderList("paldean");
    else if (pathname === "/teal-mask-boxes") setOrderList("paldean-tm");
    else if (pathname === "/blueberry-academy-boxes")
      setOrderList("paldean-bb");
    else setOrderList("national");

    setViewGenderDifference(true);
    setViewOnlyOneForm(false);
    setBreakByGen(false);
    setShowUnchecked(false);
    setShowChecked(false);
    setShowAllCheckedAndUnchecked(true);
    setHuntGameSelection(null);
  }

  function handleViewOnlyOneForm() {
    setViewOnlyOneForm((prev) => !prev);
  }

  function handleViewGenderDifference() {
    setViewGenderDifference((prev) => !prev);
  }

  function NEWfilterByGender(pokemon: Pokemon) {
    return !pokemon.data.genderDifference;
  }

  // OPTIMIZATION: Extract path boolean conditions out of the hot rendering loop
  const isKitakami = /kitakami/.test(pathname);
  const isPaldea = /paldea/.test(pathname);

  function NEWfilterByOnlyOneForm(pokemon: Pokemon) {
    if (isKitakami) {
      return (
        (pokemon.formOrder === "00" ||
          pokemon.id === "0741_03" ||
          pokemon.id === "0550_02" ||
          pokemon.id === "0901_01") &&
        pokemon.id !== "0741_00" &&
        pokemon.id !== "0901_00" &&
        pokemon.id !== "0550_00"
      );
    }
    if (isPaldea) {
      return (
        (pokemon.formOrder === "00" ||
          pokemon.id === "0128_01" ||
          pokemon.id === "0194_01" ||
          pokemon.id === "0666_19") &&
        pokemon.id !== "0194_00" &&
        pokemon.id !== "0666_00"
      );
    }
    return pokemon.formOrder === "00" || pokemon.id === "0774_01";
  }

  function passThroughFilters(latestPageBox?: List) {
    let finalList: any[];

    if (pathname.includes("tracker/")) {
      if (latestPageBox) finalList = latestPageBox.pokemon;
      else if (pageBox.pokemon) finalList = pageBox.pokemon;
      else return;
    } else {
      finalList = backupPokedex;
    }

    if (viewOnlyOneForm) {
      finalList = finalList.filter(NEWfilterByOnlyOneForm);
    }

    if (!viewGenderDifference) {
      finalList = finalList.filter(NEWfilterByGender);
    }

    if (pathname.includes("tracker/")) {
      finalList = filterListByGame(finalList as PokemonCustomBox[]);
      finalList = filterListByChecked(finalList as PokemonCustomBox[]);
    }

    setPokedexShown(sortList(finalList, orderList));
  }

  // SORTING FUNCTIONS (Pure comparison helpers)
  function sortByNationalDex(a: Pokemon, b: Pokemon) {
    return a.id > b.id ? 1 : -1;
  }

  function sortByCustomBoxId(a: PokemonShown, b: PokemonShown) {
    if (a.id === b.id && a.customBoxId && b.customBoxId) {
      return a.customBoxId > b.customBoxId ? 1 : -1;
    }
    return 0;
  }

  // FIXED: Eliminated raw array mutation by applying slice/spreading before calling sort
  function sortList(list: any[], order: SortingList): any[] {
    const mutableList = [...list];

    if (order === "national") {
      return mutableList.sort(sortByNationalDex).sort(sortByCustomBoxId);
    }

    // Helper map configuration to resolve dynamic regional keys cleanly
    const dexKeyMap: Record<string, string> = {
      paldean: "paldeaDex",
      "paldean-tm": "paldeaTMDex",
      "paldean-bb": "paldeaBBDex",
      hisuian: "hisuiDex",
      galarian: "galarDex",
      "galarian-ioa": "galarIoaDex",
      "galarian-ct": "galarCtDex",
      lumiose: "zaLumioseDex",
      "lumiose-hyperspace": "lumioseHyperspaceDex",
    };

    const targetKey = dexKeyMap[order];
    if (!targetKey) return mutableList;

    const inDex = mutableList
      .filter((p) => p.dex[targetKey])
      .sort((a, b) => {
        if (a.dex[targetKey] === b.dex[targetKey])
          return sortByNationalDex(a, b);
        return a.dex[targetKey] - b.dex[targetKey];
      });

    const notInDex = mutableList
      .filter((p) => !p.dex[targetKey])
      .sort(sortByNationalDex);

    return [...inDex, ...notInDex].sort(sortByCustomBoxId);
  }

  function handleSorting(value: SortingList) {
    if (!pokedexShown) return;
    setOrderList(value);
    setPokedexShown(sortList(pokedexShown, value));
  }

  useEffect(() => {
    if (
      !pathname.includes("tracker/") ||
      (pageBox.pokemon && pageBox.pokemon.length > 0)
    ) {
      passThroughFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pathname,
    backupPokedex,
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
      const extraInfo = fullPokedex.find((item) => item.id === pkmn.id);
      return { ...pkmn, ...extraInfo! };
    });
  }

  function compactPokemonList(list: PokemonCustomBox[]) {
    return list.map((pkmn) => ({
      customBoxId: pkmn.customBoxId,
      isShiny: pkmn.isShiny,
      isChecked: pkmn.isChecked,
      id: pkmn.id,
    }));
  }

  function getLocalStorage() {
    const data = localStorage.getItem("localBoxes");
    if (data) {
      const jsonData: ListOnStorage[] = JSON.parse(data);
      return jsonData.map((box) => ({
        ...box,
        pokemon: expandPokemonList(box.pokemon),
      }));
    }
  }

  function filterListByChecked(list: PokemonCustomBox[]) {
    if (showChecked && !showUnchecked) return list.filter((p) => p.isChecked);
    if (!showChecked && showUnchecked) return list.filter((p) => !p.isChecked);
    return list;
  }

  function handleSelectGame(selection: GameSelection) {
    setHuntGameSelection(selection);
  }

  function filterListByGame(list: PokemonCustomBox[]) {
    if (!huntGameSelection) return list;
    let initialList: PokemonCustomBox[];

    switch (huntGameSelection.baseGame) {
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
        }
        return initialList;
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
        }
        return initialList;
      case "pla":
        return list.filter((pkmn) => pkmn.dex.hisuiDex);
      default:
        return list;
    }
  }

  async function handleAddPokemon(id: string, shouldAddShiny: boolean) {
    const findPokemonToAdd = fullPokedex.find((p) => p.id === id);
    if (!findPokemonToAdd) return;

    const pokemonToAdd = {
      ...findPokemonToAdd,
      customBoxId: `${findPokemonToAdd.id}-${Date.now()}`,
      isChecked: false,
      isShiny: shouldAddShiny,
    };

    try {
      const res = await fetch(
        `/api/users/${cloudStorage.email}/${pageBox.name}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pokemonToAdd),
        },
      );
      const data = await res.json();
      updatePageBox(data.updatedUser);
    } catch (err) {
      console.error(err);
    }
  }

  function updatePageBox(updatedUser: User) {
    setCloudStorage(updatedUser);
    const findCurrentBox = updatedUser.boxes.find(
      (b) => b.name === pageBox.name,
    );
    if (findCurrentBox) {
      findCurrentBox.pokemon = expandPokemonList(findCurrentBox.pokemon);
      setPageBox(findCurrentBox as List);
      passThroughFilters(findCurrentBox as List);
    }
  }

  async function handleRemovePokemon(customBoxId: string) {
    try {
      const res = await fetch(
        `/api/users/${cloudStorage.email}/${pageBox.name}/${customBoxId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await res.json();
      updatePageBox(data.updatedUser);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleBulkRemovePokemon(removeChecked: boolean) {
    const newList = pageBox.pokemon.filter((pkmn) =>
      removeChecked ? !pkmn.isChecked : pkmn.isChecked,
    );

    try {
      const res = await fetch(
        `/api/users/${cloudStorage.email}/${pageBox.name}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updatedBox: newList }),
        },
      );
      const data = await res.json();
      updatePageBox(data.updatedUser);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteList() {
    try {
      const res = await fetch(
        `/api/users/${cloudStorage.email}/${pageBox.name}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      setCloudStorage(data.updatedUser);
    } catch (err) {
      console.error(err);
    }
  }

  function handleToggleCheck(
    kind: "check" | "uncheck" | "all",
    value: boolean,
  ) {
    if (kind === "check") {
      if (value) {
        setShowAllCheckedAndUnchecked(false);
        setShowChecked(true);
        setShowUnchecked(false);
      } else if (!showUnchecked) {
        setShowAllCheckedAndUnchecked(true);
      }
      setShowChecked(value);
    } else if (kind === "uncheck") {
      if (value) {
        setShowAllCheckedAndUnchecked(false);
        setShowChecked(false);
        setShowUnchecked(true);
      } else if (!showChecked) {
        setShowAllCheckedAndUnchecked(true);
      }
      setShowUnchecked(value);
    } else if (kind === "all" && value) {
      setShowAllCheckedAndUnchecked(true);
      setShowChecked(false);
      setShowUnchecked(false);
    }
  }

  async function handleCheck(idPokemon: string, idUser: string) {
    const findPokemonIndex = pageBox.pokemon.findIndex(
      (pkmn) => pkmn.customBoxId === idPokemon,
    );
    if (findPokemonIndex < 0) return;

    const nextCheckValue = !pageBox.pokemon[findPokemonIndex].isChecked;
    const backUpPokemonList = [...pageBox.pokemon];

    const updatedPokemonList = [...pageBox.pokemon];
    updatedPokemonList[findPokemonIndex] = {
      ...updatedPokemonList[findPokemonIndex],
      isChecked: nextCheckValue,
    };

    setPageBox({ ...pageBox, pokemon: updatedPokemonList });

    try {
      await fetch(`/api/users/${idUser}/${pageBox.name}/${idPokemon}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newCheck: nextCheckValue }),
      });
    } catch (error) {
      console.error("Failed to sync checkmark to database", error);
      setPageBox({ ...pageBox, pokemon: backUpPokemonList });
    }
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
        setBackupPokedex,
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
  return useContext(PokedexContext);
}
