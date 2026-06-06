import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { installMatchMediaSpy } from '../../../testing/dom-test.helpers';
import { ParallaxDirective } from './parallax.directive';

@Component({
  template: `<div appParallax="0.3" [parallaxMax]="80" parallaxMode="viewport"></div>`,
  imports: [ParallaxDirective],
})
class TestHostComponent {}

describe('ParallaxDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostElement: HTMLElement;
  let prefersReducedMotion = false;

  beforeEach(async () => {
    prefersReducedMotion = false;
    installMatchMediaSpy(() => prefersReducedMotion);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostElement = fixture.debugElement.query(By.css('div')).nativeElement;
  });

  it('should not set transform when prefers-reduced-motion is enabled', () => {
    prefersReducedMotion = true;
    fixture.detectChanges();

    expect(hostElement.classList.contains('pm-parallax-layer')).toBeFalse();
    expect(hostElement.style.transform).toBe('');
  });

  it('should set transform on scroll when motion is allowed', () => {
    prefersReducedMotion = false;
    spyOn(hostElement, 'getBoundingClientRect').and.returnValue({
      top: 200,
      bottom: 400,
      left: 0,
      right: 100,
      width: 100,
      height: 200,
      x: 0,
      y: 200,
      toJSON: () => ({}),
    });

    fixture.detectChanges();

    expect(hostElement.style.transform).toContain('translate3d');

    window.dispatchEvent(new Event('scroll'));
    expect(hostElement.style.transform).toContain('translate3d');
  });

  it('should remove transform on destroy', () => {
    prefersReducedMotion = false;
    fixture.detectChanges();
    hostElement.style.transform = 'translate3d(0, 12px, 0)';

    const directive = fixture.debugElement
      .query(By.directive(ParallaxDirective))
      .injector.get(ParallaxDirective);
    directive.ngOnDestroy();

    expect(hostElement.style.transform).toBe('');
  });
});
