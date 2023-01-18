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
}

// Interface to defining our object of response functions
export interface ResponseFuncs {
  GET?: Function
  POST?: Function
  PUT?: Function
  DELETE?: Function
}