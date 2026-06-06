/** Fuehrt Arbeit nach dem naechsten Paint aus (First Contentful Paint nicht blockieren). */
export function scheduleAfterPaint(work: () => void): void {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => requestAnimationFrame(work));
    return;
  }

  setTimeout(work, 0);
}

/** Fuehrt Arbeit aus, wenn der Browser idle ist (Fallback: kurzer Timeout). */
export function scheduleIdleWork(work: () => void, timeoutMs = 1500): void {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(work, { timeout: timeoutMs });
    return;
  }

  setTimeout(work, 1);
}
