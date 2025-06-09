// Interface to define Pokemon on the frontend
export interface Pokemon {
  _id?: string;
  id: string;
  formOrder: string;
  name: string;
  generalForm: string;
  uniqueForm: string;
  data: {
    type1: string;
    type2: string;
    stage: number;
    genderDifference: boolean;
    hasBaby: boolean;
    family: number[];
  }
  availability: {
    homeDepositable: boolean;
    shinyReleased: boolean;
  }
  dex: {
    generation: number;
    nationalDex: number;
    galarDex: number | null,
    galarIoaDex: number | null,
    galarCtDex: number | null,
    hisuiDex: null | number;
    paldeaDex: null | number;
    paldeaTMDex: number | null;
    paldeaBBDex: number | null;
    svHomeAvailable: boolean;
    swshHomeAvailable: boolean;
  }
  images: {
    icon: string;
    homeRender: string;
    homeShinyRender: string;
  }
}

export interface PokemonCustomBox extends Pokemon {
  customBoxId: string;
  isShiny: boolean;
  isChecked: boolean
}

export interface PokemonCustomBoxShort {
  customBoxId: string;
  isShiny: boolean;
  isChecked: boolean
  id: string
}

// Interface to define Pokemon on the frontend
export interface SVLocation {
  _id?: string;
  id: number;
  name: string;
  general: string[];
  scarlet: string[];
  violet: string[];
}

// Interface to define Pokemon on the frontend
export interface List {
  id: string;
  name: string;
  pokemon: PokemonCustomBox[];
}

export interface ListOnStorage {
  id: string;
  name: string;
  pokemon: PokemonCustomBoxShort[];
}

export type Games = "s" | "v" | "pla" | "sw" | "sh" | "ioa" | "ct" 

export type GameSelection = null | {
  baseGame: string;
  exclusives: null | string[]
}

export type Gamedex = "paldea" | "paldeaBB" | "paldeaTM" | "homedex"

export interface User {
  _id: string,
  username:string,
  email:string,
  boxes: List[]
}
