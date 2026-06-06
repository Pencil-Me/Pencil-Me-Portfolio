import { randomGibberishChar, randomMs, scrambleText, tickScramble } from './gibberish-text.util';

describe('gibberish-text.util', () => {
  it('should return a single gibberish character', () => {
    expect(randomGibberishChar()).toMatch(/^.$/);
  });

  it('should return a value within the requested millisecond range', () => {
    for (let i = 0; i < 20; i++) {
      expect(randomMs(35, 100)).toBeGreaterThanOrEqual(35);
      expect(randomMs(35, 100)).toBeLessThanOrEqual(100);
    }
  });

  it('should preserve whitespace when scrambling', () => {
    const scrambled = scrambleText('ab cd');
    expect(scrambled[2]).toBe(' ');
    expect(scrambled).not.toBe('ab cd');
  });

  it('should keep the same length as the source text', () => {
    const source = 'Hello\nWorld';
    expect(scrambleText(source).length).toBe(source.length);
  });

  it('should keep length when ticking letters', () => {
    const current = scrambleText('abcd');
    const next = tickScramble(current, 2);

    expect(next.length).toBe(current.length);
  });
});
