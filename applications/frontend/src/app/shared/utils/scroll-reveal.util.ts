export const SCROLL_REVEAL_TRANSITION_MS = 620;
export const SCROLL_REVEAL_BAND_TRANSITION_MS = 720;

export function findScrollRevealHost(element: HTMLElement): HTMLElement | null {
  return element.closest('.pm-scroll-reveal');
}

export function getScrollRevealTransitionMs(element: HTMLElement): number {
  const isBand = element.classList.contains('pm-scroll-reveal--band');
  const base = isBand ? SCROLL_REVEAL_BAND_TRANSITION_MS : SCROLL_REVEAL_TRANSITION_MS;
  const delayRaw = getComputedStyle(element).getPropertyValue('--pm-reveal-delay').trim();
  const delayMatch = delayRaw.match(/^(\d+(?:\.\d+)?)ms$/);
  const delay = delayMatch ? Number.parseFloat(delayMatch[1]) : 0;

  return base + delay;
}
