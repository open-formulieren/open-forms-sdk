import {HttpResponse, http} from 'msw';

import {BASE_URL} from 'api-mocks';

export const DEFAULT_LANGUAGES = [
  {code: 'nl', name: 'Nederlands'},
  {code: 'en', name: 'English'},
  {code: 'fy', name: 'frysk'},
];

export const mockLanguageInfoGet = (languages = DEFAULT_LANGUAGES, current = 'nl') =>
  http.get(`${BASE_URL}i18n/info`, () =>
    HttpResponse.json({
      languages: languages,
      current: current,
    })
  );

export const mockLanguageChoicePut = http.put(
  `${BASE_URL}i18n/language`,
  () => new HttpResponse(null, {status: 204})
);

export const mockInvalidLanguageChoicePut = (lang = 'fy') =>
  http.put(`${BASE_URL}i18n/language`, () =>
    HttpResponse.json(
      {
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
      },
      {status: 400}
    )
  );

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

export const mockFormioTranslations = http.get(`${BASE_URL}i18n/formio/:lang`, ({params}) => {
  const {lang} = params;
  const translations = FORMIO_TRANSLATIONS[lang];
  return HttpResponse.json(translations);
});

export const mockFormioTranslationsServiceUnavailable = http.get(
  `${BASE_URL}i18n/formio/:lang`,
  () => {
    const errBody = {
      type: `${BASE_URL}fouten/ServiceUnavailable/`,
      code: 'service_unavailable',
      title: 'Service is not available.',
      status: 503,
      detail: 'Service is not available.',
      instance: 'urn:uuid:60b443e3-b847-424b-aed0-23820fc2a48d',
    };
    return HttpResponse.json(errBody, {status: 503});
  }
);