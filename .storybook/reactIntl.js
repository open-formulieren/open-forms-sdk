const locales = ['nl', 'en'];

const messages = locales.reduce((acc, lang) => ({
  ...acc,
  [lang]: require(`../src/i18n/compiled/${lang}.json`), 
}), {});

const formats = {}; // optional, if you have any formats

export const reactIntl = {
  defaultLocale: 'nl',
  locales,
  messages,
  formats,
};