import {validateDateBoundaries} from './minMaxDateValidator';

// Timezone Amsterdam
test.each([
  {min: '2020-01-01T00:00:00+01:00', max: '', value: '2024-04-16'},
  {min: '2020-01-01T00:00:00+01:00', max: '', value: '2020-01-01'},
  {min: '', max: '2020-01-01T00:00:00+01:00', value: '2019-04-16'},
  {min: '', max: '2020-01-01T00:00:00+01:00', value: '2020-01-01'},
])(
  'validateDateBoundaries with datetimes, min: $min, max: $max, value: $value (valid)',
  ({min, max, value}) => {
    const {isValid} = validateDateBoundaries(min, max, value);
    expect(isValid).toBe(true);
  }
);

test.each([
  {min: '2020-01-01T00:00:00+01:00', max: '', value: '2019-04-16'},
  {min: '2020-01-01T00:00:00+01:00', max: '', value: '2019-12-31T23:59:59+01:00'},
  {min: '', max: '2020-01-01T00:00:00+01:00', value: '2019-12-31T23:59:00Z'},
  {min: '', max: '2020-01-01T00:00:00+01:00', value: '2020-01-02'},
])(
  'validateDateBoundaries with datetimes, min: $min, max: $max, value: $value (invalid)',
  ({min, max, value}) => {
    const {isValid} = validateDateBoundaries(min, max, value);

    expect(isValid).toBe(false);
  }
);

test.each([
  {min: '2020-01-01', max: '', value: '2024-04-16'},
  {min: '2020-01-01', max: '', value: '2020-01-01'},
  {min: '', max: '2020-01-01', value: '2019-04-16'},
  {min: '', max: '2020-01-01', value: '2020-01-01'},
])(
  'validateDateBoundaries with dates, min: $min, max: $max, value: $value (valid)',
  ({min, max, value}) => {
    const {isValid} = validateDateBoundaries(min, max, value);

    expect(isValid).toBe(true);
  }
);

test.each([
  {min: '2020-01-01', max: '', value: '2015-07-23'},
  {min: '', max: '2020-01-01', value: '2020-01-02'},
])(
  'validateDateBoundaries with dates, min: $min, max: $max, value: $value (invalid)',
  ({min, max, value}) => {
    const {isValid} = validateDateBoundaries(min, max, value);

    expect(isValid).toBe(false);
  }
);
