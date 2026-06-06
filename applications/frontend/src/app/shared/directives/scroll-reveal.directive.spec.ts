import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  installIntersectionObserverSpy,
  installMatchMediaSpy,
  installRequestAnimationFrameSpy,
  type IntersectionObserverSpyState,
} from '../../../testing/dom-test.helpers';
import { ScrollRevealDirective } from './scroll-reveal.directive';

@Component({
  template: `<div [appScrollReveal]="variant" [revealDelay]="delay"></div>`,
  imports: [ScrollRevealDirective],
})
class TestHostComponent {
  variant: 'up' | 'band' = 'up';
  delay = 0;
}

describe('ScrollRevealDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostElement: HTMLElement;
  let observerState: IntersectionObserverSpyState;
  let prefersReducedMotion = false;

  beforeEach(waitForAsync(() => {
    prefersReducedMotion = false;
    observerState = {} as IntersectionObserverSpyState;
    installMatchMediaSpy(() => prefersReducedMotion);
    installIntersectionObserverSpy(observerState);
    installRequestAnimationFrameSpy();
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostElement = fixture.debugElement.query(By.css('div')).nativeElement;
  });

  it('should reveal immediately when prefers-reduced-motion is enabled', () => {
    prefersReducedMotion = true;
    fixture.detectChanges();

    expect(hostElement.classList.contains('is-revealed')).toBeTrue();
    expect(hostElement.classList.contains('pm-scroll-reveal--up')).toBeTrue();
  });

  it('should reveal on initial viewport check without waiting for scroll', () => {
    spyOn(hostElement, 'getBoundingClientRect').and.returnValue({
      top: 100,
      bottom: 300,
      left: 0,
      right: 100,
      width: 100,
      height: 200,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    });

    fixture.detectChanges();

    expect(hostElement.classList.contains('is-revealed')).toBeTrue();
  });

  it('should reveal when intersection observer reports visibility', () => {
    spyOn(hostElement, 'getBoundingClientRect').and.returnValue({
      top: 2000,
      bottom: 2200,
      left: 0,
      right: 100,
      width: 100,
      height: 200,
      x: 0,
      y: 2000,
      toJSON: () => ({}),
    });

    fixture.detectChanges();
    expect(hostElement.classList.contains('is-revealed')).toBeFalse();

    observerState.callback(
      [{ isIntersecting: true, target: hostElement } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(hostElement.classList.contains('is-revealed')).toBeTrue();
  });

  it('should use threshold 0 for band variant', () => {
    fixture.componentInstance.variant = 'band';
    fixture.detectChanges();

    expect(hostElement.classList.contains('pm-scroll-reveal--band')).toBeTrue();
    expect(observerState.options?.threshold).toBe(0);
    expect(hostElement.style.opacity).not.toBe('0');
  });

  it('should apply reveal delay as CSS variable', () => {
    fixture.componentInstance.delay = 220;
    fixture.detectChanges();

    expect(hostElement.style.getPropertyValue('--pm-reveal-delay')).toBe('220ms');
  });
});
