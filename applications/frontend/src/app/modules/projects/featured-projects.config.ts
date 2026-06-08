import type { IProject, IProjectsCategory } from '@modules/projects/projects.models';

export interface IFeaturedProject extends IProject {
  tag: string;
  problem: string;
  role: string;
  outcome: string;
}

/** Projekt mit featured_rank (Highlight auf Startseite / Projects). */
export function isFeaturedProject(project: IProject): boolean {
  const rank = project.featured_rank;
  return rank != null && rank > 0;
}

/**
 * Highlight-Projekte aus API-Feldern (featured_rank 1–3), sortiert nach Rang.
 */
export function resolveFeaturedProjects(categories: IProjectsCategory[]): IFeaturedProject[] {
  const allProjects = categories.flatMap((category) => category.data);

  return allProjects
    .filter(isFeaturedProject)
    .sort((a, b) => (a.featured_rank ?? 0) - (b.featured_rank ?? 0))
    .map((project) => ({
      ...project,
      tag: project.featured_tag ?? '',
      problem: project.featured_problem ?? '',
      role: project.featured_role ?? '',
      outcome: project.featured_outcome ?? '',
    }));
}
