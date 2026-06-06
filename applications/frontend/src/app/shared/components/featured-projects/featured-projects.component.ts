import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { ProjectsService } from '@modules/projects/projects.service';
import {
  resolveFeaturedProjects,
  type IFeaturedProject,
} from '@modules/projects/featured-projects.config';
import { PmAsyncContentComponent } from '@shared/components/pm-async-content/pm-async-content.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { GibberishRevealDirective } from '@shared/directives/gibberish-reveal.directive';
import { toLoadStatusSignals } from '@app/shared/models/load-status.signals';

@Component({
  selector: 'app-featured-projects',
  imports: [NgClass, PmAsyncContentComponent, ScrollRevealDirective, GibberishRevealDirective],
  templateUrl: './featured-projects.component.html',
  styleUrl: './featured-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedProjectsComponent {
  private projectsService = inject(ProjectsService);
  private router = inject(Router);

  @Input() variant: 'home' | 'projects' = 'projects';

  private readonly projectsLoad = toLoadStatusSignals(this.projectsService.projectsState$);
  readonly projectsLoadStatus = this.projectsLoad.loadStatus;
  readonly projectsError = this.projectsLoad.error;
  readonly featuredProjects = toSignal(
    this.projectsService.projects$.pipe(map((categories) => resolveFeaturedProjects(categories))),
    { initialValue: [] as IFeaturedProject[] },
  );

  openProject(id: string): void {
    void this.router.navigate(['/projects', id]);
  }

  retryProjectsLoad(): void {
    this.projectsService.reloadProjects();
  }
}
