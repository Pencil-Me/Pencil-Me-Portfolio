export interface IProjectDate {
  start_date: string;
  end_date: string;
}
export interface IProjectDate_Org {
  start_date: Date;
  end_date: Date;
}
export interface IProjectTech {
  name: string;
}
export interface IProject {
  id: string;
  label: string;
  position: string;
  customer: string;
  location: string;
  content: string;
  org_dates: IProjectDate_Org[];
  dates: IProjectDate[];
  tech: IProjectTech[];
}
export interface IProjectsCategory {
  title: string;
  data: IProject[];
}
