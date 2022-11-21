import isValidBsn from '../../../../src/formio/validators/bsn';

describe('Test isValidBsn function', () => {
  test('Test isValidBsn returns true for valid BSNs', () => {
    expect(isValidBsn('111222333')).toEqual(true);
    expect(isValidBsn('123456782')).toEqual(true);
  });

  test('Test isValidBsn returns false for invalid BSNs', () => {
    expect(isValidBsn('123456789')).toEqual(false);
    expect(isValidBsn('abc')).toEqual(false);
    expect(isValidBsn('12345678')).toEqual(false);
    expect(isValidBsn('1234567890')).toEqual(false);
  });
});
