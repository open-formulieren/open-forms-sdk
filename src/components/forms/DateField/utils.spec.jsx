import {dateFromParts} from './utils';

describe('dateFromParts', () => {
  it('pads with leading zeroes', () => {
    const dateStr = dateFromParts('2023', '7', '1');

    expect(dateStr).toBe('2023-07-01');
  });

  it('returns undefined for invalid dates', () => {
    const dateStr = dateFromParts('', '', '');

    expect(dateStr).toBeUndefined();
  });

  it('requires all parts to be truthy (empty year)', () => {
    const dateStr = dateFromParts('', '1', '1');

    expect(dateStr).toBeUndefined();
  });

  it('requires all parts to be truthy (empty month)', () => {
    const dateStr = dateFromParts('2023', '', '1');

    expect(dateStr).toBeUndefined();
  });

  it('requires all parts to be truthy (empty day)', () => {
    const dateStr = dateFromParts('2023', '1', '');

    expect(dateStr).toBeUndefined();
  });
});
