import { Component, DebugElement, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CountUpDirective } from './count-up.directive';

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

  beforeEach(waitForAsync(() => {
    const rendererMock = jasmine.createSpyObj('Renderer2', ['setProperty']);

    TestBed.configureTestingModule({
      imports: [CountUpDirective],
      declarations: [TestComponent],
      providers: [{ provide: Renderer2, useValue: rendererMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(CountUpDirective));

    fixture.detectChanges();
  }));

  it('should create an instance', () => {
    const directiveInstance = debugElement.injector.get(CountUpDirective);
    expect(directiveInstance).toBeTruthy();
  });

  it('should update the innerHTML of the element over time', fakeAsync(() => {
    component.count = 100;
    component.duration = 2000;
    fixture.detectChanges();

    tick(1000);
    const innerHTMLAfter1Second = parseInt(debugElement.nativeElement.innerHTML);
    expect(innerHTMLAfter1Second).toEqual(jasmine.any(Number));

    tick(1000);
    const innerHTMLAfter2Seconds = parseInt(debugElement.nativeElement.innerHTML);
    expect(innerHTMLAfter2Seconds).toEqual(100);
  }));
});
