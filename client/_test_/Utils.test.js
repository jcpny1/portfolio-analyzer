import Fmt from '../src/utils/formatter';

describe('utils', () => {
  it('should have an error formatter', () => {
    const prefix = 'HELP';
    const error = new Error('ME');
    expect(Fmt.serverError(prefix, error)).toMatch(/HELP/)
  });

  it('should have a color selector', () => {
    expect(Fmt.valueColor(1.0)).toBe('green');
  });

  it('should have a string truncator', () => {
    expect(Fmt.truncate('ABCXYZ', 3)).toBe('AB...');
  });
});
