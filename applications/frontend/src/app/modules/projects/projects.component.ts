import { Component, inject } from '@angular/core';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ProjectsService } from '@modules/projects/projects.service';
import { Observable } from 'rxjs';
import { IProjectsCategory, IProjectTech } from '@modules/projects/projects.models';
import { Router } from '@angular/router';

/**
 * Component to display projects.
 */
@Component({
    selector: 'app-projects',
    imports: [NgForOf, NgIf, JsonPipe, NgClass],
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  private projectsService = inject(ProjectsService);
  private router = inject(Router);

  techs$: Observable<IProjectTech[]> = this.projectsService.tech$;
  projectcategories$: Observable<IProjectsCategory[]> = this.projectsService.projects$;

  projectcategories: IProjectsCategory[] = [];
  filteredProjectCategories: IProjectsCategory[] = [];
  techs: IProjectTech[] = [];

  filterTech: string[] = [];

  /**
   * Constructor to initialize ProjectsComponent.
   */
  constructor() {
    this.projectcategories$.subscribe((e) => {
      this.projectcategories = e;
      this.filteredProjectCategories = e;
    });
    this.techs$.subscribe((e) => {
      this.techs = e;
    });
  }

  /**
   * Opens the project details page.
   * @param id The ID of the project to open.
   */
  openProject(id: string) {
    this.router.navigate(['/projects', id]);
  }

  /**
   * Resets the applied filters.
   */
  resetFilterProjects() {
    this.filterTech = [];
    this.filterProjectsBySetFilter();
  }

  /**
   * Filters projects by a given technology.
   * @param tech The technology name to filter projects.
   */
  filterProjectsBy(tech: string) {
    if (!this.filterTech.includes(tech)) this.filterTech.push(tech);
    else this.filterTech = this.filterTech.filter((v) => v !== tech);

    this.filterProjectsBySetFilter();
  }

  /**
   * Filters projects based on the applied technology filter.
   */
  filterProjectsBySetFilter() {
    const filteredProjectCategories = [...this.projectcategories];
    this.filteredProjectCategories =
      this.filterTech.length > 0
        ? filteredProjectCategories
            .map((category) => ({
              title: category.title,
              data: category.data.filter((project) => project.tech.some((tech) => this.filterTech.includes(tech.name))),
            }))
            .filter((category) => category.data.length > 0)
        : filteredProjectCategories;
  }
}
