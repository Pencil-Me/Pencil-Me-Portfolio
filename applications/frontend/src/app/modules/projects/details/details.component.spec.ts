import { ProjectDetailsComponent } from '@modules/projects/details/details.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IProject } from '@modules/projects/projects.models';
import { ProjectsService } from '@modules/projects/projects.service';

class MockProjectsService {
  project$: Observable<IProject> = of({
    id: 'testID',
    label: 'testLabel',
    position: 'testPosition',
    customer: 'testCustomer',
    location: 'testLocation',
    content: 'testContent',
    org_dates: [],
    dates: [],
    tech: [],
  } as IProject);
  selectProject(id: string) {
    console.log(id);
  }
}
describe('DetailsComponent', () => {
  let component: ProjectDetailsComponent;
  let fixture: ComponentFixture<ProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({}),
          },
        },
        { provide: ProjectsService, useClass: MockProjectsService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
