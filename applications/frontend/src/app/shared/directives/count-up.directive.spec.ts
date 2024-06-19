import { Component, DebugElement, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CountUpDirective } from './count-up.directive';
import { BehaviorSubject } from 'rxjs';
import { Destroy } from '@shared/injectable/destroy';

@Component({
  template: `<div [appCountUp]="count" [duration]="duration"></div>`,
})
class TestComponent {
  count = 100;
  duration = 2000;
}

describe('CountUpDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountUpDirective, TestComponent],
      providers: [Destroy],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(CountUpDirective));
    renderer = TestBed.inject(Renderer2);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directiveInstance = debugElement.injector.get(CountUpDirective);
    expect(directiveInstance).toBeTruthy();
  });

  it('should update the innerHTML of the element over time', fakeAsync(() => {
    spyOn(renderer, 'setProperty').and.callThrough();

    component.count = 100;
    component.duration = 2000;
    fixture.detectChanges();

    tick(1000);
    expect(renderer.setProperty).toHaveBeenCalledWith(debugElement.nativeElement, 'innerHTML', jasmine.any(Number));

    tick(1000);
    expect(renderer.setProperty).toHaveBeenCalledWith(debugElement.nativeElement, 'innerHTML', 100);
  }));

  it('should handle different count and duration values', fakeAsync(() => {
    spyOn(renderer, 'setProperty').and.callThrough();

    component.count = 200;
    component.duration = 4000;
    fixture.detectChanges();

    tick(2000);
    expect(renderer.setProperty).toHaveBeenCalledWith(debugElement.nativeElement, 'innerHTML', jasmine.any(Number));

    tick(2000);
    expect(renderer.setProperty).toHaveBeenCalledWith(debugElement.nativeElement, 'innerHTML', 200);
  }));

  it('should complete the count up even if duration is zero', fakeAsync(() => {
    spyOn(renderer, 'setProperty').and.callThrough();

    component.count = 50;
    component.duration = 0;
    fixture.detectChanges();

    tick();
    expect(renderer.setProperty).toHaveBeenCalledWith(debugElement.nativeElement, 'innerHTML', 50);
  }));
});
