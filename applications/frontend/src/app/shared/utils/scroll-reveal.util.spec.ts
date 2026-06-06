import {
  findScrollRevealHost,
  getScrollRevealTransitionMs,
  SCROLL_REVEAL_BAND_TRANSITION_MS,
  SCROLL_REVEAL_TRANSITION_MS,
} from './scroll-reveal.util';

describe('scroll-reveal.util', () => {
  it('should find the nearest scroll-reveal host', () => {
    const host = document.createElement('div');
    host.classList.add('pm-scroll-reveal');
    const child = document.createElement('p');
    host.appendChild(child);

    expect(findScrollRevealHost(child)).toBe(host);
  });

  it('should include reveal delay in transition duration', () => {
    const host = document.createElement('div');
    host.classList.add('pm-scroll-reveal', 'pm-scroll-reveal--up');
    document.body.appendChild(host);
    host.style.setProperty('--pm-reveal-delay', '120ms');

    expect(getScrollRevealTransitionMs(host)).toBe(SCROLL_REVEAL_TRANSITION_MS + 120);

    document.body.removeChild(host);
  });

  it('should use band transition duration', () => {
    const host = document.createElement('div');
    host.classList.add('pm-scroll-reveal', 'pm-scroll-reveal--band');

    expect(getScrollRevealTransitionMs(host)).toBe(SCROLL_REVEAL_BAND_TRANSITION_MS);
  });
});
