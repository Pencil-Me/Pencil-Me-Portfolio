import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import type { ITechCategory } from '@modules/about/about.models';
import { AboutService } from '@modules/about/about.service';

class MockAboutService {
  tech$: Observable<ITechCategory[]> = of([]);
  techState$ = of({ loadStatus: 'COMPLETED', error: null, data: [] });
}

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [{ provide: AboutService, useClass: MockAboutService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format experience years and months', () => {
    expect(component.years(2)).toBe('2+ Jahre');
    expect(component.years(1)).toBe('1+ Jahr');
    expect(component.years(0.083)).toBe('1 Monat');
    expect(component.years(0)).toBe('');
  });
});
