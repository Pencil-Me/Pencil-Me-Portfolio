import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, type Observable } from 'rxjs';

import type { IProjectsCategory, IProjectTech } from '@modules/projects/projects.models';
import { ProjectsService } from '@modules/projects/projects.service';
import type { LoadStatus } from '@app/shared/models/load-status.model';

import { ProjectsComponent } from './projects.component';

const completedState = { loadStatus: 'COMPLETED' as LoadStatus, error: null, data: [] };

class MockProjectsService {
  tech$: Observable<IProjectTech[]> = of([]);
  projects$: Observable<IProjectsCategory[]> = of([]);
  projectsState$ = of(completedState);
  techState$ = of(completedState);
}

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  const mockProjectsService = new MockProjectsService();
  let mockRouter: jasmine.SpyObj<Router>;

  const mockTechs: IProjectTech[] = [{ name: 'Tech1' }, { name: 'Tech2' }];
  const mockProjectCategories: IProjectsCategory[] = [
    {
      title: 'ProjectCategory1',
      data: [
        {
          id: 'project1',
          label: 'Project1',
          tech: [mockTechs[0]],
          position: 'testPosition',
          customer: 'testCustomer',
          location: 'testLocation',
          content: 'testContent',
          org_dates: [],
          dates: [],
        },
        {
          id: 'project2',
          label: 'Project2',
          tech: [mockTechs[1]],
          position: 'testPosition',
          customer: 'testCustomer',
          location: 'testLocation',
          content: 'testContent',
          org_dates: [],
          dates: [],
        },
      ],
    },
    {
      title: 'ProjectCategory2',
      data: [
        {
          id: 'project3',
          label: 'Project3',
          tech: [mockTechs[0], mockTechs[1]],
          position: 'testPosition',
          customer: 'testCustomer',
          location: 'testLocation',
          content: 'testContent',
          org_dates: [],
          dates: [],
        },
      ],
    },
  ];

  beforeEach(async () => {
    mockProjectsService.tech$ = of(mockTechs);
    mockProjectsService.projects$ = of(mockProjectCategories);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        { provide: ProjectsService, useValue: mockProjectsService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize filtered categories and techs from store streams', () => {
    expect(component.filteredProjectCategories()).toEqual(mockProjectCategories);
    expect(component.techs()).toEqual(mockTechs);
  });

  it('should navigate to the project details page', () => {
    const projectId = 'project1';
    component.openProject(projectId);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/projects', projectId]);
  });

  it('should filter projects by tech', () => {
    component.resetFilterProjects();
    component.filterProjectsBy('Tech1');
    expect(component.filterTech()).toContain('Tech1');
    expect(component.filteredProjectCategories()).toEqual([
      {
        title: 'ProjectCategory1',
        data: [
          {
            id: 'project1',
            label: 'Project1',
            tech: [mockTechs[0]],
            position: 'testPosition',
            customer: 'testCustomer',
            location: 'testLocation',
            content: 'testContent',
            org_dates: [],
            dates: [],
          },
        ],
      },
      {
        title: 'ProjectCategory2',
        data: [
          {
            id: 'project3',
            label: 'Project3',
            tech: [mockTechs[0], mockTechs[1]],
            position: 'testPosition',
            customer: 'testCustomer',
            location: 'testLocation',
            content: 'testContent',
            org_dates: [],
            dates: [],
          },
        ],
      },
    ]);

    component.resetFilterProjects();
    component.filterProjectsBy('Tech2');
    expect(component.filterTech()).toContain('Tech2');
    expect(component.filteredProjectCategories()).toEqual([
      {
        title: 'ProjectCategory1',
        data: [
          {
            id: 'project2',
            label: 'Project2',
            tech: [mockTechs[1]],
            position: 'testPosition',
            customer: 'testCustomer',
            location: 'testLocation',
            content: 'testContent',
            org_dates: [],
            dates: [],
          },
        ],
      },
      {
        title: 'ProjectCategory2',
        data: [
          {
            id: 'project3',
            label: 'Project3',
            tech: [mockTechs[0], mockTechs[1]],
            position: 'testPosition',
            customer: 'testCustomer',
            location: 'testLocation',
            content: 'testContent',
            org_dates: [],
            dates: [],
          },
        ],
      },
    ]);
  });

  it('should reset project filters', () => {
    component.resetFilterProjects();
    component.filterProjectsBy('Tech1');
    expect(component.filterTech().length).toBe(1);

    component.resetFilterProjects();
    expect(component.filterTech().length).toBe(0);
    expect(component.filteredProjectCategories()).toEqual(mockProjectCategories);
  });
});
