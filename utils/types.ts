// Interface to define Pokemon on the frontend
export interface Pokemon {
  _id?: string;
  id: string;
  nationalDex: number;
  name: string;
  stage: number;
  generalForm: string;
  uniqueForm: string;
  paldeaDex: null | number;
  hisuiDex: null | number;
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
  hasBaby: boolean;
  family: number[];
  galarCtDex: number | null,
  galarDex: number | null,
  galarIoaDex: number | null,
  paldeaTMDex: number | null
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