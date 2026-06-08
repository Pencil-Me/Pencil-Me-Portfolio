import {
  deriveContentShort,
  normalizeProjectText,
  parseProjectBulletItems,
} from './project-content.util';

describe('project-content.util', () => {
  it('should normalize escaped newlines', () => {
    expect(normalizeProjectText('Line one\\nLine two')).toBe('Line one\nLine two');
  });

  it('should parse bullet items from content', () => {
    const items = parseProjectBulletItems('•First task\n•Second task\nPlain line');

    expect(items).toEqual(['First task', 'Second task', 'Plain line']);
  });

  it('should derive short text from first bullet', () => {
    expect(deriveContentShort('•Angular migration\n•Cypress tests')).toBe('Angular migration');
  });

  it('should return empty string for missing text', () => {
    expect(normalizeProjectText(null)).toBe('');
    expect(normalizeProjectText(undefined)).toBe('');
    expect(parseProjectBulletItems(null)).toEqual([]);
    expect(deriveContentShort(null)).toBe('');
  });

  it('should return plain text unchanged when shorter than max length', () => {
    const input = '•  \n•  ';
    expect(deriveContentShort(input, 180)).toBe(normalizeProjectText(input));
  });

  it('should truncate long plain text with ellipsis', () => {
    const longText = Array(80).fill('•  ').join('\n');

    const result = deriveContentShort(longText, 180);

    expect(result.endsWith('…')).toBeTrue();
    expect(result.length).toBeLessThan(longText.length);
    expect(result.length).toBeLessThanOrEqual(181);
  });
});
