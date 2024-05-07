import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projects.component';
import { Observable, of } from 'rxjs';
import { ITechCategory } from '@modules/about/about.models';
import { ProjectsService } from '@modules/projects/projects.service';
import { IProjectsCategory } from '@modules/projects/projects.models';

class MockProjectsService {
  tech$: Observable<ITechCategory[]> = of([]);
  projects$: Observable<IProjectsCategory[]> = of([]);
}
describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [{ provide: ProjectsService, useClass: MockProjectsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
