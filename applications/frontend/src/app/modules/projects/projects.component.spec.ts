import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projects.component';
import { Observable, of } from 'rxjs';
import { ProjectsService } from '@modules/projects/projects.service';
import { IProjectsCategory, IProjectTech } from '@modules/projects/projects.models';
import { Router } from '@angular/router';

class MockProjectsService {
  tech$: Observable<IProjectTech[]> = of([]);
  projects$: Observable<IProjectsCategory[]> = of([]);
}
describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  const mockProjectsService: any = MockProjectsService;
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

  it('should initialize project categories and techs', () => {
    expect(component.projectcategories).toEqual(mockProjectCategories);
    expect(component.filteredProjectCategories).toEqual(mockProjectCategories);
    expect(component.techs).toEqual(mockTechs);
  });

  it('should navigate to the project details page', () => {
    const projectId = 'project1';
    component.openProject(projectId);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/projects', projectId]);
  });

  it('should filter projects by tech', () => {
    component.resetFilterProjects();
    component.filterProjectsBy('Tech1');
    expect(component.filterTech).toContain('Tech1');
    expect(component.filteredProjectCategories).toEqual([
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
    expect(component.filterTech).toContain('Tech2');
    expect(component.filteredProjectCategories).toEqual([
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
    expect(component.filterTech.length).toBe(1);

    component.resetFilterProjects();
    expect(component.filterTech.length).toBe(0);
    expect(component.filteredProjectCategories).toEqual(mockProjectCategories);
  });

  it('should set filteredProjectCategories correctly based on filterTech', () => {
    component.resetFilterProjects();
    component.filterTech = ['Tech1'];
    component.filterProjectsBySetFilter();
    expect(component.filteredProjectCategories).toEqual([
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
    component.filterTech = ['Tech2'];
    component.filterProjectsBySetFilter();
    expect(component.filteredProjectCategories).toEqual([
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
});
