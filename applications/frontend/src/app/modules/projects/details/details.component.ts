import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ProjectsService } from '@modules/projects/projects.service';
import { Observable } from 'rxjs';
import { IProject } from '@modules/projects/projects.models';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-details',
  imports: [NgForOf, NgIf, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  private projectsService = inject(ProjectsService);
  private activatedRoute = inject(ActivatedRoute);
  projectdetail$: Observable<IProject> = this.projectsService.project$;

  projectdetail: IProject | null = null;

  constructor() {
    this.projectdetail$.subscribe((e) => (this.projectdetail = e));
  }
  ngOnDestroy() {
    this.projectdetail = null;
    this.projectsService.selectProject(undefined);
  }
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.projectsService.selectProject(id);
    });
  }

  get content() {
    return this.projectdetail ? this.renderNewLines(this.projectdetail.content) : '';
  }

  renderNewLines(text: string): string {
    return text.replace(/\\n/g, '<br>');
  }
}
