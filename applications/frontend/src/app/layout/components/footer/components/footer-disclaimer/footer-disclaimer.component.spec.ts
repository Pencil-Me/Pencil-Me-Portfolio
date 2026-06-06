import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FooterDisclaimerComponent } from './footer-disclaimer.component';

describe('FooterDisclaimerComponent', () => {
  let fixture: ComponentFixture<FooterDisclaimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterDisclaimerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterDisclaimerComponent);
    fixture.componentInstance.techStack = [
      { name: 'Angular', version: '21', url: 'https://angular.dev' },
      { name: 'PHP', version: '8', url: undefined },
    ];
    fixture.detectChanges();
  });

  it('should render tech stack items and disclaimer text', () => {
    const items = fixture.nativeElement.querySelectorAll('.tech-stack li');
    expect(items.length).toBe(2);
    expect(items[0].querySelector('a')?.textContent).toContain('Angular');
    expect(items[1].querySelector('span')?.textContent).toContain('PHP');
    expect(fixture.nativeElement.querySelector('.disclaimer-text')?.textContent).toContain(
      'Alle Logos, Marken',
    );
  });
});
