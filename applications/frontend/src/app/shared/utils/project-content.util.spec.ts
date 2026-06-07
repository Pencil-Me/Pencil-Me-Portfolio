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
});
