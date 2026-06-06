import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { PmAsyncContentComponent } from '@shared/components/pm-async-content/pm-async-content.component';
import { ProjectDateRangeComponent } from '@shared/components/project-date-range/project-date-range.component';
import { GibberishRevealDirective } from '@shared/directives/gibberish-reveal.directive';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import type { IProject } from '@modules/projects/projects.models';
import { ProjectsService } from '@modules/projects/projects.service';
import { toLoadStatusSignals } from '@app/shared/models/load-status.signals';

@Component({
  selector: 'app-project-details',
  imports: [
    RouterLink,
    ProjectDateRangeComponent,
    PmAsyncContentComponent,
    ScrollRevealDirective,
    GibberishRevealDirective,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  private projectsService = inject(ProjectsService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private readonly projectLoad = toLoadStatusSignals(this.projectsService.projectState$);
  readonly projectLoadStatus = this.projectLoad.loadStatus;
  readonly projectError = this.projectLoad.error;

  private readonly routeProjectId = toSignal(
    this.activatedRoute.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' },
  );

  private readonly projectdetailRaw = toSignal(this.projectsService.project$, {
    initialValue: {} as IProject,
  });

  readonly projectdetail = computed(() => {
    const project = this.projectdetailRaw();
    return project.id ? project : null;
  });

  readonly content = computed(() => {
    const project = this.projectdetail();
    return project ? this.renderNewLines(project.content) : '';
  });

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.projectsService.selectProject(params.get('id') ?? '');
    });
  }

  ngOnDestroy(): void {
    this.projectsService.selectProject(undefined);
  }

  retryProjectLoad(): void {
    const id = this.routeProjectId();
    if (id) {
      this.projectsService.selectProject(id);
    }
  }

  private renderNewLines(text: string): string {
    return text.replace(/\\n/g, '<br>');
  }
}
