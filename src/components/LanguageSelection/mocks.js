import {rest} from 'msw';

export const BASE_URL = 'http://localhost:8000/api/v2/';

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
