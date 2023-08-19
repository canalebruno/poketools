// Interface to define Pokemon on the frontend
export interface Pokemon {
  _id?: string;
  id: string;
  customBoxId?: string;
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
  galarIoaDex: number | null
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
  pokemon: Pokemon[];
}

// // Interface to defining our object of response functions
// export interface ResponseFuncs {
//   GET?: Function
//   POST?: Function
//   PUT?: Function
//   DELETE?: Function
// }