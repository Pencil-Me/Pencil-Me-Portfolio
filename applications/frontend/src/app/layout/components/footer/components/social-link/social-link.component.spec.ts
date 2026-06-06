import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { SocialLinkComponent } from './social-link.component';

describe('SocialLinkComponent', () => {
  let fixture: ComponentFixture<SocialLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialLinkComponent);
    fixture.componentInstance.socialLinks = [
      {
        name: 'GitHub',
        url: 'https://github.com/example',
        svgPath: 'M0 0',
        viewBox: '0 0 24 24',
      },
    ];
    fixture.detectChanges();
  });

  it('should render social links with accessible labels', () => {
    const link = fixture.nativeElement.querySelector('a.social-link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://github.com/example');
    expect(link.getAttribute('aria-label')).toBe('GitHub');
    expect(link.getAttribute('rel')).toContain('noopener');
  });
});
