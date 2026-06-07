import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, type Observable } from 'rxjs';

import type { IProjectsCategory, IProjectTech } from '@modules/projects/projects.models';
import { ProjectsService } from '@modules/projects/projects.service';
import type { LoadStatus } from '@app/shared/models/load-status.model';

import { ProjectsComponent } from './projects.component';

const completedState = { loadStatus: 'COMPLETED' as LoadStatus, error: null, data: [] };

class MockProjectsService {
  projects$: Observable<IProjectsCategory[]> = of([]);
  projectsState$ = of(completedState);
}

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  const mockProjectsService = new MockProjectsService();
  let mockRouter: jasmine.SpyObj<Router>;

  const mockTechs: IProjectTech[] = [
    { name: 'Tech1', type: 'FEFRAME' },
    { name: 'Tech2', type: 'FEDEV' },
  ];
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

  it('should initialize filtered categories from store streams', () => {
    expect(component.filteredProjectCategories()).toEqual(mockProjectCategories);
    expect(component.totalProjectCount()).toBe(3);
  });

  it('should derive filter options from project tech only', () => {
    const labels = component
      .techFilterCategories()
      .flatMap((group) => group.data.map((item) => item.label));

    expect(labels.sort()).toEqual(['Tech1', 'Tech2']);
  });

  it('should navigate to the project details page', () => {
    const projectId = 'project1';
    component.openProject(projectId);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/projects', projectId]);
  });

  it('should filter projects by tech (OR semantics)', () => {
    component.resetFilterProjects();
    component.toggleTechFilter('Tech1');
    expect(component.filterTech()).toContain('Tech1');
    expect(component.filteredProjectCount()).toBe(2);
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
    component.toggleTechFilter('Tech2');
    expect(component.filterTech()).toContain('Tech2');
    expect(component.filteredProjectCount()).toBe(2);
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

  it('should remove a single tech from active filter', () => {
    component.toggleTechFilter('Tech1');
    component.toggleTechFilter('Tech2');
    expect(component.filterTech().length).toBe(2);

    component.removeTechFilter('Tech1');
    expect(component.filterTech()).toEqual(['Tech2']);
  });

  it('should reset project filters', () => {
    component.resetFilterProjects();
    component.toggleTechFilter('Tech1');
    expect(component.filterTech().length).toBe(1);
    expect(component.hasActiveFilter()).toBeTrue();

    component.resetFilterProjects();
    expect(component.filterTech().length).toBe(0);
    expect(component.hasActiveFilter()).toBeFalse();
    expect(component.filteredProjectCategories()).toEqual(mockProjectCategories);
  });

  it('should report zero results for unknown tech filter', () => {
    component.toggleTechFilter('UnknownTech');
    expect(component.filteredProjectCount()).toBe(0);
    expect(component.filteredProjectCategories()).toEqual([]);
  });

  it('should not bypass tech filter for featured projects in the list', () => {
    const featuredWithoutMatch = {
      ...mockProjectCategories[0].data[0],
      id: 'featured',
      label: 'Featured Project',
      tech: [{ name: 'OtherTech', type: 'FEFRAME' }],
      featured_rank: 1,
    };
    const categoriesWithFeatured: IProjectsCategory[] = [
      {
        title: 'ProjectCategory1',
        data: [featuredWithoutMatch, mockProjectCategories[0].data[1]],
      },
    ];
    mockProjectsService.projects$ = of(categoriesWithFeatured);
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.toggleTechFilter('UnknownTech');

    expect(component.filteredProjectCategories()).toEqual([]);
    expect(component.filteredProjectCount()).toBe(0);
  });
});
