import {parseISO} from 'date-fns';

const RE_PARTS = {
  year: '(?<year>\\d{4})',
  month: '(?<month>\\d{1,2})',
  day: '(?<day>\\d{1,2})',
};

export const parseDate = (value, meta = null) => {
  if (!value) return undefined;

  let parsed;
  if (meta) {
    // respect the order of the parts, but be lax about the separator
    const orderedParts = orderByPart(RE_PARTS, meta);
    const re = new RegExp(orderedParts.join('[^0-9]'));
    const match = value.match(re);
    if (!match) return undefined;
    const {year, month, day} = match.groups;
    parsed = parseISOFromParts(year, month, day)[1];
  } else {
    parsed = parseISO(value);
  }

  if (isNaN(parsed)) return undefined; // Invalid date (which is instanceof Date)
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

const parseISOFromParts = (yearStr, monthStr, dayStr) => {
  const bits = [yearStr.padStart(4, '0'), monthStr.padStart(2, '0'), dayStr.padStart(2, '0')];
  const ISOFormatted = bits.join('-');
  return [ISOFormatted, parseISO(ISOFormatted)];
};

export const dateFromParts = (yearStr, monthStr, dayStr) => {
  if (!yearStr || !monthStr || !dayStr) return undefined;
  const [ISOFormatted, parsed] = parseISOFromParts(yearStr, monthStr, dayStr);
  if (isNaN(parsed)) return undefined; // Invalid date (which is instanceof Date)
  return ISOFormatted;
};

export const orderByPart = (parts, meta) => {
  return Object.keys(parts)
    .sort((a, b) => meta[a] - meta[b])
    .map(part => parts[part]);
};
