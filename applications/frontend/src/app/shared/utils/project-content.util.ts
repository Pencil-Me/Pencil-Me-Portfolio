/** Normalisiert API-Text (escaped newlines, trim). */
export function normalizeProjectText(text: string | null | undefined): string {
  if (!text) {
    return '';
  }

  return text.replace(/\\n/g, '\n').trim();
}

/** Parst Stichpunkt-Listen aus dem legacy `content`-Feld (•, -, *, o). */
export function parseProjectBulletItems(content: string | null | undefined): string[] {
  const normalized = normalizeProjectText(content);
  if (!normalized) {
    return [];
  }

  return normalized
    .split(/\n/)
    .map((line) => line.replace(/^[•\-*o]\s*/u, '').trim())
    .filter(Boolean);
}

/** Kurztext-Fallback aus erstem Stichpunkt oder gekürztem Fliesstext. */
export function deriveContentShort(content: string | null | undefined, maxLength = 180): string {
  const bullets = parseProjectBulletItems(content);
  if (bullets.length > 0) {
    return bullets[0];
  }

  const normalized = normalizeProjectText(content);
  if (!normalized) {
    return '';
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}
