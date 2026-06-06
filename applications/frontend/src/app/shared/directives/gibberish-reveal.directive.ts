import {
  Directive,
  ElementRef,
  inject,
  Input,
  NgZone,
  type AfterViewInit,
  type OnDestroy,
  type OnInit,
} from '@angular/core';

import { randomMs, scrambleText, tickScramble } from '@app/shared/utils/gibberish-text.util';
import {
  findScrollRevealHost,
  getScrollRevealTransitionMs,
} from '@app/shared/utils/scroll-reveal.util';

@Directive({
  selector: '[appGibberishReveal]',
  standalone: true,
})
export class GibberishRevealDirective implements OnInit, AfterViewInit, OnDestroy {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private ngZone = inject(NgZone);

  /** Minimum milliseconds gibberish stays visible before readable text appears. */
  @Input() gibberishMinDelay = 300;
  /** Maximum milliseconds gibberish stays visible before readable text appears. */
  @Input() gibberishMaxDelay = 500;
  /** Minimum milliseconds between letter updates. */
  @Input() gibberishMinMs = 35;
  /** Maximum milliseconds between letter updates. */
  @Input() gibberishMaxMs = 100;

  private observer?: IntersectionObserver;
  private revealObserver?: MutationObserver;
  private tickTimeoutId?: ReturnType<typeof setTimeout>;
  private revealTimeoutId?: ReturnType<typeof setTimeout>;
  private scrollRevealWaitId?: ReturnType<typeof setTimeout>;
  private originalHtml = '';
  private originalText = '';
  private displayText = '';
  private revealed = false;
  private scrambling = false;
  private prepared = false;

  ngOnInit(): void {
    this.host.nativeElement.classList.add('pm-gibberish-reveal');
  }

  ngAfterViewInit(): void {
    const element = this.host.nativeElement;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.revealed = true;
      element.classList.add('is-revealed');
      return;
    }

    this.prepareContent(element);
    if (this.revealed) return;

    this.bindRevealTrigger(element);
  }

  ngOnDestroy(): void {
    this.stopScramble();
    this.observer?.disconnect();
    this.revealObserver?.disconnect();
    if (this.scrollRevealWaitId !== undefined) {
      clearTimeout(this.scrollRevealWaitId);
    }
  }

  private prepareContent(element: HTMLElement): void {
    if (this.prepared) return;
    this.prepared = true;

    this.originalHtml = element.innerHTML.trim();
    this.originalText = (element.textContent ?? '').trim();

    if (!this.originalText) {
      this.revealed = true;
      element.classList.add('is-revealed');
      return;
    }

    this.displayText = scrambleText(this.originalText);
    element.textContent = this.displayText;
    element.setAttribute('aria-label', this.originalText);
  }

  private bindRevealTrigger(element: HTMLElement): void {
    const scrollHost = findScrollRevealHost(element);

    if (scrollHost) {
      this.waitForScrollReveal(scrollHost, element);
      return;
    }

    this.bindViewportTrigger(element);
  }

  private waitForScrollReveal(scrollHost: HTMLElement, element: HTMLElement): void {
    const startAfterTransition = (): void => {
      this.scrollRevealWaitId = setTimeout(() => {
        this.ngZone.run(() => this.startScramble(element));
      }, getScrollRevealTransitionMs(scrollHost));
    };

    if (scrollHost.classList.contains('is-revealed')) {
      startAfterTransition();
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.revealObserver = new MutationObserver(() => {
        if (!scrollHost.classList.contains('is-revealed')) return;
        this.revealObserver?.disconnect();
        startAfterTransition();
      });
      this.revealObserver.observe(scrollHost, { attributes: true, attributeFilter: ['class'] });
    });
  }

  private bindViewportTrigger(element: HTMLElement): void {
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.ngZone.run(() => this.startScramble(entry.target as HTMLElement));
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: '0px 0px -4% 0px',
        },
      );
      this.observer.observe(element);
    });

    this.checkInitialVisibility();
  }

  private checkInitialVisibility(): void {
    if (this.revealed || this.scrambling) return;

    requestAnimationFrame(() => {
      const element = this.host.nativeElement;
      if (this.revealed || this.scrambling || !this.isInViewport(element)) return;
      this.startScramble(element);
    });
  }

  private isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08;
  }

  private startScramble(element: HTMLElement): void {
    if (this.revealed || this.scrambling || !this.originalText) return;

    this.scrambling = true;
    element.classList.add('is-scrambling');
    this.observer?.unobserve(element);

    this.scheduleTick(element);
    const revealDelay = randomMs(this.gibberishMinDelay, this.gibberishMaxDelay);
    this.revealTimeoutId = setTimeout(() => this.reveal(element), revealDelay);
  }

  private scheduleTick(element: HTMLElement): void {
    if (this.revealed) return;

    const lettersPerTick = randomMs(1, 3);
    this.displayText = tickScramble(this.displayText, lettersPerTick);
    element.textContent = this.displayText;

    this.tickTimeoutId = setTimeout(
      () => this.scheduleTick(element),
      randomMs(this.gibberishMinMs, this.gibberishMaxMs),
    );
  }

  private reveal(element: HTMLElement): void {
    if (this.revealed) return;

    this.revealed = true;
    this.stopScramble();
    element.innerHTML = this.originalHtml;
    element.classList.remove('is-scrambling');
    element.classList.add('is-revealed');
    element.removeAttribute('aria-label');
  }

  private stopScramble(): void {
    if (this.tickTimeoutId !== undefined) {
      clearTimeout(this.tickTimeoutId);
      this.tickTimeoutId = undefined;
    }
    if (this.revealTimeoutId !== undefined) {
      clearTimeout(this.revealTimeoutId);
      this.revealTimeoutId = undefined;
    }
    this.scrambling = false;
  }
}
