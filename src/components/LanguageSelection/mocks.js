import {rest} from 'msw';

import {BASE_URL} from 'story-utils/mocks';

export const DEFAULT_LANGUAGES = [
  {code: 'nl', name: 'Nederlands'},
  {code: 'en', name: 'English'},
  {code: 'fy', name: 'frysk'},
];

export const mockLanguageInfoGet = (languages = DEFAULT_LANGUAGES) =>
  rest.get(`${BASE_URL}i18n/info`, (req, res, ctx) => {
    return res(
      ctx.json({
        languages: languages,
        current: 'nl',
      })
    );
  });

export const mockLanguageChoicePut = rest.put(`${BASE_URL}i18n/language`, (req, res, ctx) => {
  return res(ctx.status(204));
});

export const mockInvalidLanguageChoicePut = (lang = 'fy') =>
  rest.put(`${BASE_URL}i18n/language`, (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        type: 'http://localhost:8000/fouten/ValidationError/',
        code: 'invalid',
        title: 'Invalid input.',
        status: 400,
        detail: '',
        instance: 'urn:uuid:41e0174a-efc2-4cc0-9bf2-8366242a4e75',
        invalidParams: [
          {
            name: 'code',
            code: 'invalid_choice',
            reason: `"${lang}" is not a valid choice.`,
          },
        ],
      })
    );
  });

const FORMIO_TRANSLATIONS = {
  nl: {
    'Click to set value': 'Klik om waarde in te stellen',
    Cancel: 'Annuleren',
  },
  en: {
    'Click to set value': 'Click to set value',
    Cancel: 'Cancel',
  },
};

export const mockFormioTranslations = rest.get(`${BASE_URL}i18n/formio/:lang`, (req, res, ctx) => {
  const {lang} = req.params;
  const translations = FORMIO_TRANSLATIONS[lang];
  return res(ctx.json(translations));
});

export const mockFormioTranslationsServiceUnavailable = rest.get(
  `${BASE_URL}i18n/formio/:lang`,
  (req, res, ctx) => {
    const errBody = {
      type: `${BASE_URL}fouten/ServiceUnavailable/`,
      code: 'service_unavailable',
      title: 'Service is not available.',
      status: 503,
      detail: 'Service is not available.',
      instance: 'urn:uuid:60b443e3-b847-424b-aed0-23820fc2a48d',
    };
    return res(ctx.status(503), ctx.json(errBody));
  }
);
