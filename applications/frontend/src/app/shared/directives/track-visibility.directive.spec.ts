import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TrackVisibilityDirective } from './track-visibility.directive';

@Component({
  template: `<div appTrackVisibility (visible)="onVisibilityChange($event)"></div>`,
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
  let debugElement: DebugElement;
  let directiveInstance: TrackVisibilityDirective;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TrackVisibilityDirective],
      declarations: [TestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(TrackVisibilityDirective));

    directiveInstance = debugElement.injector.get(TrackVisibilityDirective);

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directiveInstance).toBeTruthy();
  });

  it('should emit visibility changes', () => {
    spyOn(component, 'onVisibilityChange');
    fixture.detectChanges(); // Initial binding trigger

    // Simulate the intersection change by manually invoking the observer's callback
    directiveInstance['intersectionCallback']({ isIntersecting: true } as IntersectionObserverEntry);

    // Test if the visibility change was emitted correctly
    expect(component.onVisibilityChange).toHaveBeenCalledWith(true);
  });

  it('should disconnect observer on destroy', () => {
    spyOn(directiveInstance['observer'], 'disconnect');
    directiveInstance.ngOnDestroy();
    expect(directiveInstance['observer'].disconnect).toHaveBeenCalled();
  });
});
