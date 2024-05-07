import { Component, inject } from '@angular/core';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ProjectsService } from '@modules/projects/projects.service';
import { Observable } from 'rxjs';
import { IProjectsCategory, IProjectTech } from '@modules/projects/projects.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgForOf, NgIf, JsonPipe, NgClass],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
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

  constructor() {
    this.projectcategories$.subscribe((e) => {
      this.projectcategories = e;
      this.filteredProjectCategories = e;
    });
    this.techs$.subscribe((e) => {
      this.techs = e;
    });
  }

  openProject(id: string) {
    this.router.navigate(['/projects', id]);
  }
  resetFilterProjects() {
    this.filterTech = [];
    this.filterProjectsBySetFilter();
  }
  filterProjectsBy(tech: string) {
    if (!this.filterTech.includes(tech)) this.filterTech.push(tech);
    else this.filterTech = this.filterTech.filter((v) => v !== tech);

    this.filterProjectsBySetFilter();
  }

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
