export interface ISimpTech {
  label: string;
  lastTouch: string;
  numberOfProjects: string;
}

export interface ITechCategories {
  title: string;
  data: ISimpTech[];
}
