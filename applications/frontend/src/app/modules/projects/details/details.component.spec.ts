import { ProjectDetailsComponent } from '@modules/projects/details/details.component';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProjectsService } from '@modules/projects/projects.service';

class MockProjectsService {
  project$ = of({
    id: 'testID',
    label: 'testLabel',
    position: 'testPosition',
    customer: 'testCustomer',
    location: 'testLocation',
    content: 'testContent',
    org_dates: [],
    dates: [],
    tech: [],
  });
  projectState$ = of({ loadStatus: 'COMPLETED' as const, error: null, data: {} });
  selectProject(_id?: string) {
    return;
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
