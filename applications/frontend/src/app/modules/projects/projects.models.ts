/**
 * Interface representing project date with start and end dates as strings.
 */
export interface IProjectDate {
  start_date: string;
  end_date: string;
}

/**
 * Interface representing project date with start and end dates as Date objects.
 */
export interface IProjectDate_Org {
  start_date: Date;
  end_date: Date;
}

/**
 * Interface representing project technology.
 */
export interface IProjectTech {
  name: string;
}

/**
 * Interface representing a project.
 */
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

/**
 * Interface representing a category of projects.
 */
export interface IProjectsCategory {
  title: string;
  data: IProject[];
}
