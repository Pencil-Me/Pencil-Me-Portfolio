import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, Directive } from '@angular/core';
import { ScrollAnchorDirective } from './scroll-anchor.directive';
import { By } from '@angular/platform-browser';
import { ScrollManagerDirective } from '@shared/directives/scroll-manager.directive';

@Component({
    selector: 'app-test-host',
    template: `
    <div id="scrollContainer">
      <div id="scrollTarget" appScrollAnchor="target"></div>
    </div>
  `,
    imports: [ScrollAnchorDirective]
})
class TestComponent {}

@Directive({
    selector: '[appScrollManager]',
    standalone: false
})
class MockScrollManagerDirective {
  scroll(id: string | number) {
    console.log(id);
  }
}

describe('ScrollAnchorDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let divEl: DebugElement;
  let scrollManager: MockScrollManagerDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollAnchorDirective, TestComponent],
      providers: [
        { provide: ScrollManagerDirective, useClass: MockScrollManagerDirective }, // MockScrollManagerDirective als Anbieter bereitstellen
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    divEl = fixture.debugElement.query(By.directive(ScrollAnchorDirective));
    scrollManager = TestBed.inject(ScrollManagerDirective) as MockScrollManagerDirective; // ScrollManagerDirective injizieren

    spyOn(scrollManager, 'scroll').and.callThrough();
  });

  it('should call manager with scroll to id', () => {
    divEl.triggerEventHandler('click', null);

    expect(scrollManager.scroll).toHaveBeenCalledWith('target');
  });
});
