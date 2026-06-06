import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { BehaviorSubject, of } from 'rxjs';
import type { ITechCategories } from '@modules/home/home.models';
import { HomeService } from '@modules/home/home.service';
import { ProjectsService } from '@modules/projects/projects.service';
import { ActivatedRoute } from '@angular/router';
import type { LoadStatus } from '@app/shared/models/load-status.model';

class MockHomeService {
  tech$ = of([] as ITechCategories[]);
  customers$ = of([] as { url: string; alt: string }[]);
  private techStateSubject = new BehaviorSubject<{
    loadStatus: LoadStatus;
    error: string | null;
    data: unknown[];
  }>({
    loadStatus: 'COMPLETED' as LoadStatus,
    error: null,
    data: [],
  });
  techState$ = this.techStateSubject.asObservable();
  customersState$ = of({ loadStatus: 'COMPLETED' as LoadStatus, error: null, data: [] });

  setTechState(state: { loadStatus: LoadStatus; error: string | null; data: unknown[] }): void {
    this.techStateSubject.next(state);
  }

  reloadTechstack(): void {
    // spy target in specs
  }

  reloadCustomers(): void {
    // spy target in specs
  }
}

class MockProjectsService {
  projects$ = of([]);
  projectsState$ = of({ loadStatus: 'COMPLETED' as LoadStatus, error: null, data: [] });
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockHomeService: MockHomeService;

  beforeEach(async () => {
    mockHomeService = new MockHomeService();
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
        { provide: HomeService, useValue: mockHomeService },
        { provide: ProjectsService, useClass: MockProjectsService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('typeWriter', () => {
    it('should add characters to currentRoleVisual', () => {
      component.currentRole = 'Test';
      component.currentRoleVisual.set('');
      component.typewriterConfig.positionIndex = 0;

      component.typeWriter.add();

      expect(component.currentRoleVisual()).toEqual('T');
    });

    it('should remove characters from currentRoleVisual', () => {
      component.currentRole = 'Test';
      component.currentRoleVisual.set('Test');
      component.typewriterConfig.positionIndex = 3;

      component.typeWriter.remove();

      expect(component.currentRoleVisual()).toEqual('Tes');
    });

    it('should select next role', () => {
      spyOn(component.typeWriter, 'getRandomRole').and.returnValue('New Role');

      component.currentRole = 'Test';
      component.currentRoleVisual.set('Test');

      component.typeWriter.selectNext();

      expect(component.currentRole).toEqual('New Role');
      expect(component.currentRoleVisual()).toEqual('N');
    });

    it('should clear scheduled timeouts on destroy', () => {
      component.currentRole = 'Ab';
      component.currentRoleVisual.set('');
      component.typewriterConfig.positionIndex = 0;
      component.typeWriter.add();

      expect(component['timeouts'].length).toBeGreaterThan(0);

      component.ngOnDestroy();

      expect(component['timeouts'].length).toBe(0);
    });

    it('should call reloadTechstack when retry is clicked in error state', () => {
      mockHomeService.setTechState({ loadStatus: 'ERROR', error: 'API down', data: [] });
      spyOn(mockHomeService, 'reloadTechstack');
      fixture.detectChanges();

      const retryButtons = fixture.nativeElement.querySelectorAll('.pm-load-error__retry');
      retryButtons[retryButtons.length - 1]?.click();

      expect(mockHomeService.reloadTechstack).toHaveBeenCalled();
    });
  });
});
