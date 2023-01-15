export interface Pokemon {
  id: string;
  nationalDex: number;
  name: string;
  stage: number;
  generalForm: string;
  uniqueForm: string;
  paldeaDex: null | number;
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
