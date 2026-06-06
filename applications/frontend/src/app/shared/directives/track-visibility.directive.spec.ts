import { Component, type DebugElement } from '@angular/core';
import { TestBed, waitForAsync, type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  installIntersectionObserverSpy,
  type IntersectionObserverSpyState,
} from '../../../testing/dom-test.helpers';
import { TrackVisibilityDirective } from './track-visibility.directive';

@Component({
  template: `<div appTrackVisibility (visible)="onVisibilityChange($event)"></div>`,
  standalone: false,
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
  let observerState: IntersectionObserverSpyState;

  beforeEach(waitForAsync(() => {
    observerState = {} as IntersectionObserverSpyState;
    installIntersectionObserverSpy(observerState);

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

  it('should emit visibility when intersection occurs', () => {
    spyOn(component, 'onVisibilityChange');

    observerState.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(component.onVisibilityChange).toHaveBeenCalledWith(true);
  });

  it('should disconnect observer on destroy', () => {
    directiveInstance.ngOnDestroy();
    expect(directiveInstance['observer']?.disconnect).toHaveBeenCalled();
  });
});
