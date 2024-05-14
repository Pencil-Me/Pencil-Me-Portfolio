import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ScrollManagerDirective } from '@shared/directives/scroll-manager.directive';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
        {
          provide: ScrollManagerDirective,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('function currentYear', () => {
    const currentYear = new Date().getFullYear().toString();
    expect(component.getCurrentYear()).toEqual(currentYear);
  });

  it('should display the current year', () => {
    const currentYear = new Date().getFullYear().toString();
    const footerElement: HTMLElement = fixture.nativeElement;
    const yearElement = footerElement.querySelector('.footer-copyright');
    expect(yearElement?.textContent).toContain(currentYear);
  });

  it('should display tech stack items', () => {
    const footerElement: HTMLElement = fixture.nativeElement;
    const techStackItems = footerElement.querySelectorAll('.footer-disclaimer ul li');
    expect(techStackItems.length).toBe(component.techStackForPortfolio.length);
    component.techStackForPortfolio.forEach((item, index) => {
      const techStackItem = techStackItems[index];
      expect(techStackItem.textContent).toContain(item.name);
    });
  });
});
