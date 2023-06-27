import {parse, parseISO} from 'date-fns';

export const parseDate = value => {
  if (!value) return undefined;
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  // Invalid Date is apparently a thing :ThisIsFine:
  if (isNaN(parsed)) return undefined;
  return parsed;
};

export const getDateLocaleMeta = locale => {
  const testDate = new Date(2023, 4, 31);
  const options = {year: 'numeric', month: 'numeric', day: 'numeric'};
  const dateTimeFormat = new Intl.DateTimeFormat(locale, options);
  const parts = dateTimeFormat.formatToParts(testDate);

  const separator = parts.find(part => part.type === 'literal')?.value || '';

  const yearPart = parts.find(part => part.type === 'year');
  const monthPart = parts.find(part => part.type === 'month');
  const dayPart = parts.find(part => part.type === 'day');

  return {
    year: parts.indexOf(yearPart),
    month: parts.indexOf(monthPart),
    day: parts.indexOf(dayPart),
    separator: separator,
  };
};

export const convertMonth = (month, toAdd) => {
  if (!month) return '';
  const monthNumber = parseInt(month);
  return String(monthNumber + toAdd);
};

export const dateFromParts = (yearStr, monthStr, dayStr) => {
  const bits = [yearStr.padStart(4, '0'), monthStr.padStart(2, '0'), dayStr.padStart(2, '0')];
  const ISOFormatted = bits.join('-');
  const parsed = parseISO(ISOFormatted);
  if (isNaN(parsed)) return undefined; // Invalid date (which is instanceof Date)
  return ISOFormatted;
};
