import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BasicComponent } from './basic.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('BasicComponent', () => {
  let component: BasicComponent;
  let fixture: ComponentFixture<BasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update showScrollToTop when scrolling', () => {
    const windowScrollEvent = new Event('scroll');

    // Mocking window.scrollY, document.body.scrollHeight, and window.innerHeight
    spyOnProperty(window, 'scrollY', 'get').and.returnValue(201);
    spyOnProperty(document.body, 'scrollHeight', 'get').and.returnValue(2000);
    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(800);

    // Dispatching the scroll event
    window.dispatchEvent(windowScrollEvent);

    // Logging the values for debugging
    console.log('window.scrollY:', window.scrollY);
    console.log('document.body.scrollHeight:', document.body.scrollHeight);
    console.log('window.innerHeight:', window.innerHeight);

    // Checking the value of component.showScrollToTop
    console.log('component.showScrollToTop:', component.showScrollToTop);

    expect(component.showScrollToTop).toBeTrue();
  });

  it('should NOT update showScrollToTop when scrolling', () => {
    const windowScrollEvent = new Event('scroll');

    // Mocking window.scrollY, document.body.scrollHeight, and window.innerHeight
    spyOnProperty(window, 'scrollY', 'get').and.returnValue(201);
    spyOnProperty(document.body, 'scrollHeight', 'get').and.returnValue(1000);
    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(800);

    // Dispatching the scroll event
    window.dispatchEvent(windowScrollEvent);

    // Logging the values for debugging
    console.log('window.scrollY:', window.scrollY);
    console.log('document.body.scrollHeight:', document.body.scrollHeight);
    console.log('window.innerHeight:', window.innerHeight);

    // Checking the value of component.showScrollToTop
    console.log('component.showScrollToTop:', component.showScrollToTop);

    // Expecting component.showScrollToTop to be true
    expect(component.showScrollToTop).toBeFalse();
  });

  it('should scroll to top on deactivate', fakeAsync(() => {
    const scrollToSpy = spyOn(window, 'scrollTo') as jasmine.Spy<(options?: ScrollToOptions) => void>;

    component.onDeactivate();
    tick();

    expect(scrollToSpy).toHaveBeenCalled();
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  }));
});
