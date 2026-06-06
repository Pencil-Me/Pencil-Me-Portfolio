import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectsService } from '@modules/projects/projects.service';
import type { IProjectsCategory } from '@modules/projects/projects.models';
import { Router } from '@angular/router';
import { FeaturedProjectsComponent } from '@shared/components/featured-projects/featured-projects.component';
import { ProjectDateRangeComponent } from '@shared/components/project-date-range/project-date-range.component';
import { PmAsyncContentComponent } from '@shared/components/pm-async-content/pm-async-content.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { GibberishRevealDirective } from '@shared/directives/gibberish-reveal.directive';
import { toLoadStatusSignals } from '@app/shared/models/load-status.signals';

@Component({
  selector: 'app-projects',
  imports: [NgClass, FeaturedProjectsComponent, ProjectDateRangeComponent, PmAsyncContentComponent, ScrollRevealDirective, GibberishRevealDirective],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private projectsService = inject(ProjectsService);
  private router = inject(Router);

  readonly techs = toSignal(this.projectsService.tech$, { initialValue: [] });
  private readonly projectsLoad = toLoadStatusSignals(this.projectsService.projectsState$);
  readonly projectsLoadStatus = this.projectsLoad.loadStatus;
  readonly projectsError = this.projectsLoad.error;

  private readonly techLoad = toLoadStatusSignals(this.projectsService.techState$);
  readonly techLoadStatus = this.techLoad.loadStatus;
  readonly techError = this.techLoad.error;

  readonly filterTech = signal<string[]>([]);

  private readonly projectcategories = toSignal(this.projectsService.projects$, {
    initialValue: [] as IProjectsCategory[],
  });

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

  openProject(id: string): void {
    void this.router.navigate(['/projects', id]);
  }

  resetFilterProjects(): void {
    this.filterTech.set([]);
  }

  filterProjectsBy(tech: string): void {
    this.filterTech.update((current) =>
      current.includes(tech) ? current.filter((value) => value !== tech) : [...current, tech],
    );
  }

  retryProjectsLoad(): void {
    this.projectsService.reloadProjects();
  }

  retryTechLoad(): void {
    this.projectsService.reloadTechstack();
  }
}
