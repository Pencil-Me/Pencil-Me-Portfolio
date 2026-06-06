import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterNavigationComponent } from './footer-navigation.component';

describe('FooterNavigationComponent', () => {
  let fixture: ComponentFixture<FooterNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterNavigationComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterNavigationComponent);
    fixture.componentInstance.navLinks = [
      { label: 'Home', route: '/' },
      { label: 'Kontakt', route: '/contact' },
    ];
    fixture.detectChanges();
  });

  it('should render navigation links', () => {
    const links = fixture.nativeElement.querySelectorAll('.footer-nav a');
    expect(links.length).toBe(2);
    expect(links[0].textContent?.trim()).toBe('Home');
    expect(links[1].getAttribute('href')).toContain('/contact');
  });
});
