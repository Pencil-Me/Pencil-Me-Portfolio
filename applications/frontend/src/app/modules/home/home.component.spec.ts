import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { Observable, of } from 'rxjs';
import { ITechCategory } from '@modules/about/about.models';
import { HomeService } from '@modules/home/home.service';
import { ActivatedRoute } from '@angular/router';

class MockHomeService {
  tech$: Observable<ITechCategory[]> = of([]);
  customers$: Observable<string[]> = of([]);
}
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
        { provide: HomeService, useClass: MockHomeService },
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
      component.currentRoleVisual = '';
      component.typewriterConfig.positionIndex = 0;

      component.typeWriter.add();

      expect(component.currentRoleVisual).toEqual('T');
    });

    it('should remove characters from currentRoleVisual', () => {
      component.currentRole = 'Test';
      component.currentRoleVisual = 'Test';
      component.typewriterConfig.positionIndex = 3;

      component.typeWriter.remove();

      expect(component.currentRoleVisual).toEqual('Tes');
    });

    it('should select next role', () => {
      spyOn(component.typeWriter, 'getRandomRole').and.returnValue('New Role');

      component.currentRole = 'Test';
      component.currentRoleVisual = 'Test';

      component.typeWriter.selectNext();

      expect(component.currentRole).toEqual('New Role');
      expect(component.currentRoleVisual).toEqual('N');
    });
  });
});
