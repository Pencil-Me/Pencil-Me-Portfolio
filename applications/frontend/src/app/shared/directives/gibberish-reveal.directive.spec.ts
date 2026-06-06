import { Component } from '@angular/core';
import {
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
  type ComponentFixture,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SCROLL_REVEAL_TRANSITION_MS } from '@app/shared/utils/scroll-reveal.util';

import {
  installIntersectionObserverSpy,
  installMatchMediaSpy,
  installRequestAnimationFrameSpy,
  type IntersectionObserverSpyState,
} from '../../../testing/dom-test.helpers';
import { GibberishRevealDirective } from './gibberish-reveal.directive';
import { ScrollRevealDirective } from './scroll-reveal.directive';

@Component({
  template: `
    <div appScrollReveal="up" class="is-revealed">
      <p appGibberishReveal [gibberishMinDelay]="delay" [gibberishMaxDelay]="delay">
        Lesbarer Text
      </p>
    </div>
  `,
  imports: [ScrollRevealDirective, GibberishRevealDirective],
})
class RevealedScrollHostComponent {
  delay = 750;
}

@Component({
  template: `
    <div appScrollReveal="up" [revealDelay]="120" class="is-revealed">
      <p appGibberishReveal [gibberishMinDelay]="750" [gibberishMaxDelay]="750">Lesbarer Text</p>
    </div>
  `,
  imports: [ScrollRevealDirective, GibberishRevealDirective],
})
class DelayedScrollHostComponent {}

@Component({
  template: `<p appGibberishReveal [gibberishMinDelay]="delay" [gibberishMaxDelay]="delay">
    Lesbarer Text
  </p>`,
  imports: [GibberishRevealDirective],
})
class ViewportHostComponent {
  delay = 750;
}

describe('GibberishRevealDirective', () => {
  let prefersReducedMotion = false;
  let observerState: IntersectionObserverSpyState;

  beforeEach(waitForAsync(async () => {
    prefersReducedMotion = false;
    observerState = {} as IntersectionObserverSpyState;
    installMatchMediaSpy(() => prefersReducedMotion);
    installIntersectionObserverSpy(observerState);
    installRequestAnimationFrameSpy();

    await TestBed.configureTestingModule({
      imports: [RevealedScrollHostComponent, DelayedScrollHostComponent, ViewportHostComponent],
    }).compileComponents();
  }));

  describe('with scroll-reveal host', () => {
    let textElement: HTMLElement;

    it('should start gibberish after scroll-reveal transition completes', fakeAsync(() => {
      const fixture = TestBed.createComponent(RevealedScrollHostComponent);
      document.body.appendChild(fixture.nativeElement);
      fixture.detectChanges();
      textElement = fixture.debugElement.query(By.css('p')).nativeElement;

      tick(SCROLL_REVEAL_TRANSITION_MS + 749);
      expect(textElement.textContent?.trim()).not.toBe('Lesbarer Text');

      tick(1);
      expect(textElement.textContent?.trim()).toBe('Lesbarer Text');
      expect(textElement.classList.contains('is-revealed')).toBeTrue();

      fixture.nativeElement.remove();
    }));

    it('should wait for reveal delay before gibberish starts', fakeAsync(() => {
      const fixture = TestBed.createComponent(DelayedScrollHostComponent);
      document.body.appendChild(fixture.nativeElement);
      fixture.detectChanges();
      textElement = fixture.debugElement.query(By.css('p')).nativeElement;

      tick(SCROLL_REVEAL_TRANSITION_MS + 120 - 1);
      expect(textElement.classList.contains('is-scrambling')).toBeFalse();

      tick(1);
      expect(textElement.classList.contains('is-scrambling')).toBeTrue();

      fixture.nativeElement.remove();
    }));
  });

  describe('without scroll-reveal host', () => {
    let fixture: ComponentFixture<ViewportHostComponent>;
    let hostElement: HTMLElement;

    beforeEach(() => {
      prefersReducedMotion = false;
    });

    afterEach(() => {
      fixture?.nativeElement.remove();
    });

    it('should keep readable text when prefers-reduced-motion is enabled', () => {
      prefersReducedMotion = true;
      fixture = TestBed.createComponent(ViewportHostComponent);
      document.body.appendChild(fixture.nativeElement);
      fixture.detectChanges();
      hostElement = fixture.debugElement.query(By.css('p')).nativeElement;

      expect(hostElement.textContent?.trim()).toBe('Lesbarer Text');
      expect(hostElement.classList.contains('is-revealed')).toBeTrue();
    });

    it('should reveal readable text after delay in viewport', fakeAsync(() => {
      fixture = TestBed.createComponent(ViewportHostComponent);
      document.body.appendChild(fixture.nativeElement);
      fixture.detectChanges();
      hostElement = fixture.debugElement.query(By.css('p')).nativeElement;

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
      expect(hostElement.textContent?.trim()).not.toBe('Lesbarer Text');

      observerState.callback(
        [{ isIntersecting: true, target: hostElement } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );

      tick(749);
      expect(hostElement.textContent?.trim()).not.toBe('Lesbarer Text');

      tick(1);
      expect(hostElement.textContent?.trim()).toBe('Lesbarer Text');
      expect(hostElement.classList.contains('is-revealed')).toBeTrue();
    }));
  });
});
