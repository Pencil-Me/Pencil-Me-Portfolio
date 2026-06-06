const GIBBERISH_CHARS = '!<>-_\\/[]{}—=+*^?#@&%0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function randomGibberishChar(): string {
  return GIBBERISH_CHARS[Math.floor(Math.random() * GIBBERISH_CHARS.length)] ?? '#';
}

export function randomMs(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function scrambleText(text: string): string {
  return [...text]
    .map((char) => (isPreservedChar(char) ? char : randomGibberishChar()))
    .join('');
}

export function tickScramble(current: string, lettersPerTick = 1): string {
  const chars = [...current];
  const indices = pickRandomLetterIndices(chars, lettersPerTick);

  for (const index of indices) {
    chars[index] = randomGibberishChar();
  }

  return chars.join('');
}

function isPreservedChar(char: string): boolean {
  return char === ' ' || char === '\n' || char === '\t';
}

function collectScrambleableIndices(chars: string[]): number[] {
  return chars.reduce<number[]>((indices, char, index) => {
    if (!isPreservedChar(char)) {
      indices.push(index);
    }
    return indices;
  }, []);
}

function pickRandomLetterIndices(chars: string[], count: number): number[] {
  const scrambleable = collectScrambleableIndices(chars);

  if (scrambleable.length === 0) {
    return [];
  }

  const picks: number[] = [];
  const pool = [...scrambleable];

  while (picks.length < count && pool.length > 0) {
    const pickIndex = Math.floor(Math.random() * pool.length);
    picks.push(pool[pickIndex] ?? pool[0]!);
    pool.splice(pickIndex, 1);
  }

  return picks;
}
