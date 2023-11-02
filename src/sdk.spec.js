import {act, waitForElementToBeRemoved, within} from '@testing-library/react';

import {BASE_URL, buildForm, mockFormGet} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {mockFormioTranslations, mockLanguageInfoGet} from 'components/LanguageSelection/mocks';

import {OpenForm} from './sdk.js';

// scrollIntoView is not not supported in Jest
let scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

const LANGUAGES = [
  {code: 'nl', name: 'Nederlands'},
  {code: 'en', name: 'English'},
];

const apiMocks = [
  mockFormGet(buildForm({translationEnabled: true})),
  mockLanguageInfoGet(LANGUAGES),
  mockFormioTranslations,
];

describe('OpenForm', () => {
  it('should accept a DOM node as languageSelectorTarget', async () => {
    mswServer.use(...apiMocks);
    const formRoot = document.createElement('div');
    const target = document.createElement('div');
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      languageSelectorTarget: target,
      lang: 'nl',
    });

    await act(async () => await form.init());

    // wait for the loader to be removed when all network requests have completed
    await waitForElementToBeRemoved(() => within(formRoot).getByRole('status'));
    expect(target).not.toBeEmptyDOMElement();
  });

  it('should accept a target selector string as languageSelectorTarget', async () => {
    document.body.innerHTML = `
      <div id="my-languages-element"></div>
      <div id="root"></div>
    `;
    const formRoot = document.getElementById('root');
    const target = document.getElementById('my-languages-element');
    mswServer.use(...apiMocks);
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      languageSelectorTarget: '#my-languages-element',
      lang: 'nl',
    });

    await act(async () => await form.init());

    // wait for the loader to be removed when all network requests have completed
    await waitForElementToBeRemoved(() => within(formRoot).getByRole('status'));
    expect(target).not.toBeEmptyDOMElement();
  });

  it('should render the form on init', async () => {
    const formRoot = document.createElement('div');
    mswServer.use(...apiMocks);
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      lang: 'nl',
    });

    await act(async () => await form.init());

    // wait for the loader to be removed when all network requests have completed
    await waitForElementToBeRemoved(() => within(formRoot).getByRole('status'));
    expect(formRoot.textContent).not.toContain('Loading');
  });

  it('should re-fetch the form to get new literals after language change', async () => {
    const formRoot = document.createElement('div');
    // first we load NL variant, second time we load the form in NL
    const formNL = buildForm({translationEnabled: true, name: 'Nederlandse versie'});
    const formEN = buildForm({translationEnabled: true, name: 'English version'});
    mswServer.use(
      mockFormGet(formNL, true),
      mockFormGet(formEN, true),
      mockLanguageInfoGet(LANGUAGES),
      mockFormioTranslations
    );

    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      lang: 'nl',
    });

    await act(async () => await form.init());

    // wait for the loader to be removed when all network requests have completed
    await waitForElementToBeRemoved(() => within(formRoot).getByRole('status'));
    expect(within(formRoot).getAllByText('Nederlandse versie').length).toBeGreaterThan(0);

    await act(async () => {
      await form.onLanguageChangeDone('en');
    });

    expect(within(formRoot).getAllByText('English version').length).toBeGreaterThan(0);
  });

  it('should correctly set the formUrl', () => {
    mswServer.use(...apiMocks);
    const formRoot = document.createElement('div');
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '/some-subpath/',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
    });

    expect(form.clientBaseUrl).toEqual('http://localhost/some-subpath');
  });

  it("shouldn't take basepath into account (hash based routing)", () => {
    mswServer.use(...apiMocks);
    window.history.pushState({}, '', '/some-path');
    const formRoot = document.createElement('div');
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '/i-must-be-ignored',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      useHashRouting: true,
    });

    expect(form.clientBaseUrl).toEqual('http://localhost/some-path');
  });

  it.each([
    [
      `/some-subpath?_of_action=afspraak-annuleren&_of_action_params=${encodeURIComponent(
        JSON.stringify({time: '2021-07-21T12:00:00+00:00'})
      )}`,
      'http://localhost/some-subpath/afspraak-annuleren?time=2021-07-21T12%3A00%3A00%2B00%3A00',
    ],
    [
      '/some-subpath?_of_action=afspraak-maken',
      'http://localhost/some-subpath/afspraak-maken/producten', // SDK redirects to producten
    ],
    [
      `/some-subpath?_of_action=cosign&_of_action_params=${encodeURIComponent(
        JSON.stringify({submission_uuid: 'abc'})
      )}`,
      'http://localhost/some-subpath/cosign/check?submission_uuid=abc',
    ],
    [
      `/some-subpath?_of_action=resume&_of_action_params=${encodeURIComponent(
        JSON.stringify({next_step: 'step-1'})
      )}`,
      'http://localhost/some-subpath/startpagina', // SDK redirects to start page
    ],
  ])('should handle action redirects correctly', async (initialUrl, expected) => {
    mswServer.use(...apiMocks);
    const formRoot = document.createElement('div');
    window.history.pushState(null, '', initialUrl);
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '/some-subpath',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      useHashRouting: false,
      lang: 'nl',
    });
    await act(async () => await form.init());

    // wait for the loader to be removed when all network requests have completed
    await waitForElementToBeRemoved(() => within(formRoot).getByRole('status'));
    expect(location.href).toEqual(expected);
  });

  it.each([
    // With a base path:
    [
      // Omitting submission_uuid for simplicity
      `/base-path/?_of_action=afspraak-annuleren&unrelated_q=1&_of_action_params=${encodeURIComponent(
        JSON.stringify({time: '2021-07-21T12:00:00+00:00'})
      )}`,
      'http://localhost/base-path/?unrelated_q=1#/afspraak-annuleren?time=2021-07-21T12%3A00%3A00%2B00%3A00',
    ],
    [
      '/base-path/?_of_action=afspraak-maken&unrelated_q=1',
      'http://localhost/base-path/?unrelated_q=1#/afspraak-maken/producten',
    ],
    [
      `/base-path/?_of_action=cosign&_of_action_params=${encodeURIComponent(
        JSON.stringify({submission_uuid: 'abc'})
      )}&unrelated_q=1`,
      'http://localhost/base-path/?unrelated_q=1#/cosign/check?submission_uuid=abc',
    ],
    [
      `/base-path/?_of_action=resume&_of_action_params=${encodeURIComponent(
        JSON.stringify({next_step: 'step-1'})
      )}&unrelated_q=1`,
      'http://localhost/base-path/?unrelated_q=1#/startpagina', // SDK redirects to start page
    ],
    // Without a base path:
    [
      // Omitting submission_uuid for simplicity
      `/?_of_action=afspraak-annuleren&unrelated_q=1&_of_action_params=${encodeURIComponent(
        JSON.stringify({time: '2021-07-21T12:00:00+00:00'})
      )}`,
      'http://localhost/?unrelated_q=1#/afspraak-annuleren?time=2021-07-21T12%3A00%3A00%2B00%3A00',
    ],
    [
      '/?_of_action=afspraak-maken&unrelated_q=1',
      'http://localhost/?unrelated_q=1#/afspraak-maken/producten', // SDK redirects to producten
    ],
    [
      `/?_of_action=cosign&_of_action_params=${encodeURIComponent(
        JSON.stringify({submission_uuid: 'abc'})
      )}&unrelated_q=1`,
      'http://localhost/?unrelated_q=1#/cosign/check?submission_uuid=abc',
    ],
    [
      `/?_of_action=resume&_of_action_params=${encodeURIComponent(
        JSON.stringify({next_step: 'step-1'})
      )}&unrelated_q=1`,
      'http://localhost/?unrelated_q=1#/startpagina', // SDK redirects to start page
    ],
  ])(
    'should handle action redirects correctly (hash based routing)',
    async (initialUrl, expected) => {
      mswServer.use(...apiMocks);
      const formRoot = document.createElement('div');
      window.history.pushState(null, '', initialUrl);
      const form = new OpenForm(formRoot, {
        baseUrl: BASE_URL,
        basePath: '/i-must-be-ignored',
        formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
        useHashRouting: true,
        lang: 'nl',
      });
      await act(async () => await form.init());

      // wait for the loader to be removed when all network requests have completed
      await waitForElementToBeRemoved(() => within(formRoot).getByRole('status'));
      expect(location.href).toEqual(expected);
    }
  );
});
