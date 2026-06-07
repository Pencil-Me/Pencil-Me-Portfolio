import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { FeaturedProjectsComponent } from '@shared/components/featured-projects/featured-projects.component';
import { PmAsyncContentComponent } from '@shared/components/pm-async-content/pm-async-content.component';
import { ProjectDateRangeComponent } from '@shared/components/project-date-range/project-date-range.component';
import { GibberishRevealDirective } from '@shared/directives/gibberish-reveal.directive';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import type { IProjectsCategory } from '@modules/projects/projects.models';
import { ProjectsService } from '@modules/projects/projects.service';
import { toLoadStatusSignals } from '@app/shared/models/load-status.signals';
import { collectProjectTechForFilter } from '@app/state/knowledge/mappers/tech-stack.mapper';

@Component({
  selector: 'app-projects',
  imports: [
    NgClass,
    FeaturedProjectsComponent,
    ProjectDateRangeComponent,
    PmAsyncContentComponent,
    ScrollRevealDirective,
    GibberishRevealDirective,
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private projectsService = inject(ProjectsService);
  private router = inject(Router);

  private readonly projectsLoad = toLoadStatusSignals(this.projectsService.projectsState$);
  readonly projectsLoadStatus = this.projectsLoad.loadStatus;
  readonly projectsError = this.projectsLoad.error;

  readonly filterTech = signal<string[]>([]);

  private readonly projectcategories = toSignal(this.projectsService.projects$, {
    initialValue: [] as IProjectsCategory[],
  });

  readonly techFilterCategories = computed(() =>
    collectProjectTechForFilter(this.projectcategories()),
  );

  readonly hasActiveFilter = computed(() => this.filterTech().length > 0);

  readonly filteredProjectCategories = computed(() => {
    const categories = this.projectcategories();
    const filters = this.filterTech();

    if (filters.length === 0) {
      return categories;
    }

    return categories
      .map((category) => ({
        title: category.title,
        data: category.data.filter((project) =>
          project.tech.some((tech) => filters.includes(tech.name)),
        ),
      }))
      .filter((category) => category.data.length > 0);
  });

  readonly filteredProjectCount = computed(() =>
    this.filteredProjectCategories().reduce((sum, category) => sum + category.data.length, 0),
  );

  readonly totalProjectCount = computed(() =>
    this.projectcategories().reduce((sum, category) => sum + category.data.length, 0),
  );

  openProject(id: string): void {
    void this.router.navigate(['/projects', id]);
  }

  resetFilterProjects(): void {
    this.filterTech.set([]);
  }

  removeTechFilter(tech: string): void {
    this.filterTech.update((current) => current.filter((value) => value !== tech));
  }

  toggleTechFilter(tech: string): void {
    this.filterTech.update((current) =>
      current.includes(tech) ? current.filter((value) => value !== tech) : [...current, tech],
    );
  }

  retryProjectsLoad(): void {
    this.projectsService.reloadProjects();
  }
}
