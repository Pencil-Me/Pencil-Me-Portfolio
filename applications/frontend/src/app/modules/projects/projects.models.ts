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
  type?: string;
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
  content_short?: string;
  content_long?: string;
  category?: string;
  org_dates: IProjectDate_Org[];
  dates: IProjectDate[];
  tech: IProjectTech[];
  featured_rank?: number | null;
  featured_tag?: string | null;
  featured_problem?: string | null;
  featured_role?: string | null;
  featured_outcome?: string | null;
}

/**
 * Interface representing a category of projects.
 */
export interface IProjectsCategory {
  title: string;
  data: IProject[];
}
