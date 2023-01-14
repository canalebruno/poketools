export interface Pokemon {
  id: string;
  nationalDex: number;
  name: string;
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
  stage: number;
  hasBaby: boolean;
}
