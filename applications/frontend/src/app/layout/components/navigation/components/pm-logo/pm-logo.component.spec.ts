import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PmLogoComponent } from './pm-logo.component';

describe('PmLogoComponent', () => {
  let component: PmLogoComponent;
  let fixture: ComponentFixture<PmLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmLogoComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PmLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link to home', () => {
    const link: HTMLAnchorElement | null = fixture.nativeElement.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/');
  });
});
