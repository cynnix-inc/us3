import { mergeLww } from '../conflict';

describe('mergeLww', () => {
  it('prefers newer timestamp', () => {
    expect(mergeLww({ value: 'a', updatedAtMs: 1 }, { value: 'b', updatedAtMs: 2 })).toEqual({
      value: 'b',
      updatedAtMs: 2,
    });
  });

  it('breaks ties in favor of remote', () => {
    expect(mergeLww({ value: 'a', updatedAtMs: 2 }, { value: 'b', updatedAtMs: 2 })).toEqual({
      value: 'b',
      updatedAtMs: 2,
    });
  });

  it('handles nulls', () => {
    expect(mergeLww(null, { value: 'x', updatedAtMs: 1 })).toEqual({
      value: 'x',
      updatedAtMs: 1,
    });
    expect(mergeLww({ value: 'x', updatedAtMs: 1 }, null)).toEqual({
      value: 'x',
      updatedAtMs: 1,
    });
  });
});
