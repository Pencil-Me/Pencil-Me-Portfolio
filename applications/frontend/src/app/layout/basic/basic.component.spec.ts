import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BasicComponent } from './basic.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('BasicComponent', () => {
  let component: BasicComponent;
  let fixture: ComponentFixture<BasicComponent>;
  let scrollToSpy: jasmine.Spy;

  // Helper function to set up scroll mocks and dispatch scroll event
  const setupScrollTest = (scrollY: number, scrollHeight: number, innerHeight: number) => {
    spyOnProperty(window, 'scrollY', 'get').and.returnValue(scrollY);
    spyOnProperty(document.body, 'scrollHeight', 'get').and.returnValue(scrollHeight);
    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(innerHeight);
    window.dispatchEvent(new Event('scroll'));
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Scroll behavior', () => {
    it('should show scroll-to-top button when scrolled down more than 200px', () => {
      setupScrollTest(201, 2000, 800);
      expect(component.showScrollToTop).toBeTrue();
    });

    it('should not show scroll-to-top button when scrolled less than 200px', () => {
      setupScrollTest(199, 2000, 800);
      expect(component.showScrollToTop).toBeFalse();
    });

    it('should not show scroll-to-top button when content is shorter than viewport', () => {
      setupScrollTest(201, 1000, 800);
      expect(component.showScrollToTop).toBeFalse();
    });

    it('should scroll to top on deactivate', fakeAsync(() => {
      scrollToSpy = spyOn(window, 'scrollTo');

      component.onDeactivate();
      tick();

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    }));
  });
});
