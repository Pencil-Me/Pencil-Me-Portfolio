import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import type { Observable } from 'rxjs';
import { BehaviorSubject, of } from 'rxjs';
import { FeaturedProjectsComponent } from './featured-projects.component';
import { ProjectsService } from '@modules/projects/projects.service';
import type { IProjectsCategory } from '@modules/projects/projects.models';
import type { LoadStatus } from '@app/shared/models/load-status.model';

class MockProjectsService {
  private projectsStateSubject = new BehaviorSubject<{
    loadStatus: LoadStatus;
    error: string | null;
    data: unknown[];
  }>({
    loadStatus: 'PENDING',
    error: null,
    data: [],
  });

  projectsState$ = this.projectsStateSubject.asObservable();
  projects$: Observable<IProjectsCategory[]> = of([]);

  reloadProjects(): void {
    // spy target in specs
  }

  setProjectsState(state: { loadStatus: LoadStatus; error: string | null; data: unknown[] }): void {
    this.projectsStateSubject.next(state);
  }
}

describe('FeaturedProjectsComponent', () => {
  let fixture: ComponentFixture<FeaturedProjectsComponent>;
  let mockProjectsService: MockProjectsService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockProjectsService = new MockProjectsService();
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [FeaturedProjectsComponent],
      providers: [
        { provide: ProjectsService, useValue: mockProjectsService },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedProjectsComponent);
  });

  it('should show loading placeholder while projects are pending', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.pm-async-content__featured')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.pm-featured-projects__grid')).toBeNull();
  });

  it('should show error state without project grid', () => {
    mockProjectsService.setProjectsState({
      loadStatus: 'ERROR',
      error: 'API offline',
      data: [],
    });
    fixture.detectChanges();

    const errorBox = fixture.nativeElement.querySelector('.pm-load-error');
    expect(errorBox).toBeTruthy();
    expect(errorBox.textContent).toContain('API offline');
    expect(fixture.nativeElement.querySelector('.pm-featured-projects__grid')).toBeNull();
  });

  it('should render empty content when completed with no featured matches', () => {
    mockProjectsService.setProjectsState({
      loadStatus: 'COMPLETED',
      error: null,
      data: [],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.pm-load-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('.pm-featured-projects__grid')).toBeNull();
  });

  it('should call reloadProjects when retry is triggered in error state', () => {
    mockProjectsService.setProjectsState({
      loadStatus: 'ERROR',
      error: 'API offline',
      data: [],
    });
    spyOn(mockProjectsService, 'reloadProjects');
    fixture.detectChanges();

    const retryButton = fixture.nativeElement.querySelector('.pm-load-error__retry');
    retryButton.click();

    expect(mockProjectsService.reloadProjects).toHaveBeenCalled();
  });
});
