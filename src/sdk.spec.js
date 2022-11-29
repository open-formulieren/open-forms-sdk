import {act} from '@testing-library/react';

import {OpenForm} from './sdk.js';

// TODO: look into msw for API mocking instead
// see https://testing-library.com/docs/react-testing-library/example-intro
const apiModule = require('api');
jest.mock('api');

// scrollIntoView is not not supported in Jest
let scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

const FORM = {
  uuid: '81a22589-abce-4147-a2a3-62e9a56685aa',
  url: 'http://localhost:8000/api/v2/forms/81a22589-abce-4147-a2a3-62e9a56685aa',
  name: 'MOCKED',
  active: true,
  loginRequired: false,
  loginOptions: [],
  product: '',
  slug: 'jest',
  maintenanceMode: false,
  showProgressIndicator: true,
  submissionAllowed: 'yes',
  literals: {
    beginText: {resolved: 'begin', value: ''},
    changeText: {resolved: 'change', value: ''},
    confirmText: {resolved: 'confirm', value: ''},
    previousText: {resolved: 'previous', value: ''},
  },
  steps: [],
  explanationTemplate: '',
  requiredFieldsWithAsterisk: true,
  autoLoginAuthenticationBackend: '',
  translationEnabled: true,
};

const LANGUAGE_INFO = {
  languages: [
    {code: 'nl', name: 'Nederlands'},
    {code: 'en', name: 'English'},
  ],
  current: 'nl',
};

describe('OpenForm', () => {
  it('should accept a DOM node as languageSelectorTarget', async () => {
    const formRoot = document.createElement('div');
    const target = document.createElement('div');

    apiModule.get
      .mockReturnValueOnce(FORM) // form detail endpoint
      .mockReturnValueOnce({}) // formio translations
      .mockReturnValueOnce(LANGUAGE_INFO); // language info

    const form = new OpenForm(formRoot, {
      baseUrl: 'http://localhost:8000/api/v2/',
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      languageSelectorTarget: target,
      lang: 'nl',
    });

    try {
      await act(async () => await form.init());
    } catch (e) {
      throw e; // should not error
    }

    expect(target).not.toBeEmptyDOMElement();
  });

  it('should accept a target selector string as languageSelectorTarget', async () => {
    document.body.innerHTML = `
      <div id="my-languages-element"></div>
      <div id="root"></div>
    `;
    const formRoot = document.getElementById('root');
    const target = document.getElementById('my-languages-element');

    apiModule.get
      .mockReturnValueOnce(FORM) // form detail endpoint
      .mockReturnValueOnce({}) // formio translations
      .mockReturnValueOnce(LANGUAGE_INFO); // language info

    const form = new OpenForm(formRoot, {
      baseUrl: 'http://localhost:8000/api/v2/',
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      languageSelectorTarget: '#my-languages-element',
      lang: 'nl',
    });

    try {
      await act(async () => await form.init());
    } catch (e) {
      throw e; // should not error
    }

    expect(target).not.toBeEmptyDOMElement();
  });

  it('should render the form on init', async () => {
    const formRoot = document.createElement('div');

    apiModule.get
      .mockReturnValueOnce(FORM) // form detail endpoint
      .mockReturnValueOnce({}) // formio translations
      .mockReturnValueOnce(LANGUAGE_INFO); // language info

    const form = new OpenForm(formRoot, {
      baseUrl: 'http://localhost:8000/api/v2/',
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      lang: 'nl',
    });

    try {
      await act(async () => await form.init());
    } catch (e) {
      throw e; // should not error
    }

    expect(formRoot.textContent).not.toContain('Loading');
  });

  it('should re-fetch the form to get new literals after language change', async () => {
    const formRoot = document.createElement('div');

    apiModule.get
      .mockReturnValueOnce(FORM) // form detail endpoint
      .mockReturnValueOnce({}) // formio translations
      .mockReturnValueOnce(LANGUAGE_INFO) // language info
      .mockReturnValueOnce(FORM); // form detail endpoint again

    const form = new OpenForm(formRoot, {
      baseUrl: 'http://localhost:8000/api/v2/',
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      lang: 'nl',
    });

    try {
      await act(async () => {
        await form.init();
        await form.onLanguageChangeDone('en');
      });
    } catch (e) {
      throw e; // should not error
    }

    const is_get_form_call = args => args.length == 1 && args[0] == FORM.url;
    const get_form_calls = apiModule.get.mock.calls.filter(is_get_form_call);
    expect(get_form_calls.length).toBe(2);
  });
});
