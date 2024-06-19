import { Component, ElementRef, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TrackVisibilityDirective } from './track-visibility.directive';

@Component({
  template: `<div appTrackVisibility (visibile)="onVisibilityChange($event)"></div>`,
})
class TestComponent {
  isVisible = false;

  onVisibilityChange(isVisible: boolean) {
    this.isVisible = isVisible;
  }
}

describe('TrackVisibilityDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: ElementRef;
  let directiveInstance: TrackVisibilityDirective;
  let ngZone: NgZone;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackVisibilityDirective, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(TrackVisibilityDirective));
    ngZone = TestBed.inject(NgZone);

    // Mock IntersectionObserver
    spyOn(window, 'IntersectionObserver').and.callFake((callback: IntersectionObserverCallback) => {
      observerCallback = callback;
      return {
        observe: jasmine.createSpy('observe'),
        disconnect: jasmine.createSpy('disconnect'),
      } as unknown as IntersectionObserver;
    });

    directiveInstance = new TrackVisibilityDirective(debugElement, ngZone);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directiveInstance).toBeTruthy();
  });

  it('should emit visibility changes', () => {
    spyOn(component, 'onVisibilityChange');
    fixture.detectChanges(); // trigger initial binding

    directiveInstance.ngOnInit();

    const mockEntriesIntersecting: IntersectionObserverEntry[] = [
      {
        isIntersecting: true,
        target: debugElement.nativeElement,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: 0,
      },
    ];

    observerCallback(mockEntriesIntersecting, directiveInstance['observer']);
    expect(component.onVisibilityChange).toHaveBeenCalledWith(true);

    const mockEntriesNotIntersecting: IntersectionObserverEntry[] = [
      {
        isIntersecting: false,
        target: debugElement.nativeElement,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 0,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: 0,
      },
    ];

    observerCallback(mockEntriesNotIntersecting, directiveInstance['observer']);
    expect(component.onVisibilityChange).toHaveBeenCalledWith(false);
  });

  it('should disconnect observer on destroy', () => {
    const mockDisconnect = jasmine.createSpy('disconnect');
    (window as any).IntersectionObserver = jasmine.createSpy().and.callFake(() => {
      return {
        observe: jasmine.createSpy('observe'),
        disconnect: mockDisconnect,
      } as unknown as IntersectionObserver;
    });

    directiveInstance.ngOnInit();
    directiveInstance.ngOnDestroy();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
