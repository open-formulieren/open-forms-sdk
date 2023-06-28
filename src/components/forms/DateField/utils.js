import parse from 'date-fns/parse';

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
