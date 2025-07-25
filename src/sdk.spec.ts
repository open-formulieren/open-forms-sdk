import {act, waitFor, within} from '@testing-library/react';

import {BASE_URL, buildForm, mockAnalyticsToolConfigGet, mockFormGet} from '@/api-mocks';
import mswServer from '@/api-mocks/msw-server';
import type {LanguageInfo} from '@/components/LanguageSelection/LanguageSelection';
import {mockFormioTranslations, mockLanguageInfoGet} from '@/components/LanguageSelection/mocks';

import {OpenForm} from './sdk';

// scrollIntoView is not supported in jest-dom
const scrollIntoViewMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

const LANGUAGES: LanguageInfo['languages'] = [
  {code: 'nl', name: 'Nederlands'},
  {code: 'en', name: 'English'},
];

const apiMocks = [
  mockFormGet(buildForm({translationEnabled: true})),
  mockLanguageInfoGet(LANGUAGES),
  mockFormioTranslations,
  mockAnalyticsToolConfigGet(),
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
    await waitFor(() => expect(within(formRoot).queryByRole('status')).toBeNull());

    expect(target).not.toBeEmptyDOMElement();
  });

  it('should accept a target selector string as languageSelectorTarget', async () => {
    document.body.innerHTML = `
      <div id="my-languages-element"></div>
      <div id="root"></div>
    `;
    const formRoot = document.getElementById('root')!;
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
    await waitFor(() => expect(within(formRoot).queryByRole('status')).toBeNull());

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
    await waitFor(() => expect(within(formRoot).queryByRole('status')).toBeNull());

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
      mockFormioTranslations,
      mockAnalyticsToolConfigGet()
    );

    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      lang: 'nl',
    });

    await act(async () => await form.init());

    // wait for the loader to be removed when all network requests have completed
    await waitFor(() => expect(within(formRoot).queryByRole('status')).toBeNull());

    expect(within(formRoot).getAllByText('Nederlandse versie').length).toBeGreaterThan(0);

    await act(async () => {
      // @ts-expect-error we're calling a private method here
      await form.onLanguageChangeDone('en');
    });

    expect(within(formRoot).getAllByText('English version').length).toBeGreaterThan(0);
  });

  it('should call the onLanguageChange callback on language change', async () => {
    mswServer.use(...apiMocks);
    const formRoot = document.createElement('div');
    const target = document.createElement('div');
    const onLanguageChangeMock = vi.fn();

    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      languageSelectorTarget: target,
      lang: 'nl',
      onLanguageChange: onLanguageChangeMock,
    });

    await act(async () => await form.init());

    // wait for the loader to be removed when all network requests have completed
    await waitFor(() => expect(within(formRoot).queryByRole('status')).toBeNull());

    expect(target).not.toBeEmptyDOMElement();

    await act(async () => {
      // @ts-expect-error we're calling a private method here
      await form.onLanguageChangeDone('en');
    });

    // Second argument is the initialDataReference, which is null in this case
    expect(onLanguageChangeMock).toBeCalledWith('en', null);
  });

  it('should call the onLanguageChange callback with initial data reference', async () => {
    mswServer.use(...apiMocks);
    window.history.pushState({}, '', '?initial_data_reference=foo');
    const formRoot = document.createElement('div');
    const target = document.createElement('div');
    const onLanguageChangeMock = vi.fn();

    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      languageSelectorTarget: target,
      lang: 'nl',
      onLanguageChange: onLanguageChangeMock,
    });

    await act(async () => await form.init());

    // wait for the loader to be removed when all network requests have completed
    await waitFor(() => expect(within(formRoot).queryByRole('status')).toBeNull());

    expect(target).not.toBeEmptyDOMElement();

    await act(async () => {
      // @ts-expect-error we're calling a private method here
      await form.onLanguageChangeDone('en');
    });

    // Ensure the data reference is kept when a language change happens
    expect(onLanguageChangeMock).toBeCalledWith('en', 'foo');

    // Remove query param to ensure other tests don't fail
    window.history.pushState({}, '', window.location.pathname);
  });

  it('should correctly set the formUrl', () => {
    mswServer.use(...apiMocks);
    const formRoot = document.createElement('div');
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '/some-subpath/',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
    });

    // @ts-expect-error accessing a protected property here
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

    // @ts-expect-error accessing a protected property here
    expect(form.clientBaseUrl).toEqual('http://localhost/some-path');
  });

  it('must retain query string parameters with hash based routing', () => {
    mswServer.use(...apiMocks);
    window.history.pushState({}, '', '/some-path?someQuery=foo');
    const formRoot = document.createElement('div');
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '/i-must-be-ignored',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      useHashRouting: true,
    });

    // @ts-expect-error accessing a protected property here
    expect(form.clientBaseUrl).toEqual('http://localhost/some-path?someQuery=foo');
  });

  it.each([
    [
      `/some-subpath?_of_action=afspraak-annuleren&_of_action_params=${encodeURIComponent(
        JSON.stringify({time: '2021-07-21T12:00:00+00:00'})
      )}`,
      'http://localhost/some-subpath/afspraak-annuleren?time=2021-07-21T12%3A00%3A00%2B00%3A00',
    ],
    ['/some-subpath?_of_action=afspraak-maken', 'http://localhost/some-subpath/afspraak-maken'],
    [
      `/some-subpath?_of_action=cosign&_of_action_params=${encodeURIComponent(
        JSON.stringify({submission_uuid: 'abc'})
      )}`,
      'http://localhost/some-subpath/cosign/check?submission_uuid=abc',
    ],
    [
      `/some-subpath?_of_action=resume&_of_action_params=${encodeURIComponent(
        JSON.stringify({step_slug: 'step-1', submission_uuid: 'abc'})
      )}`,
      'http://localhost/some-subpath/stap/step-1?submission_uuid=abc',
    ],
  ])('should handle action redirects correctly', async (initialUrl, expected) => {
    mswServer.use(...apiMocks);
    const formRoot = document.createElement('div');
    window.history.pushState(null, '', initialUrl);
    new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '/some-subpath',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      useHashRouting: false,
      lang: 'nl',
    });

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
      'http://localhost/base-path/?unrelated_q=1#/afspraak-maken',
    ],
    [
      `/base-path/?_of_action=cosign&_of_action_params=${encodeURIComponent(
        JSON.stringify({submission_uuid: 'abc'})
      )}&unrelated_q=1`,
      'http://localhost/base-path/?unrelated_q=1#/cosign/check?submission_uuid=abc',
    ],
    [
      `/base-path/?_of_action=resume&_of_action_params=${encodeURIComponent(
        JSON.stringify({step_slug: 'step-1', submission_uuid: 'abc'})
      )}&unrelated_q=1`,
      'http://localhost/base-path/?unrelated_q=1#/stap/step-1?submission_uuid=abc',
    ],
    [
      `/base-path/?_of_action=payment&_of_action_params=${encodeURIComponent(
        JSON.stringify({of_payment_status: 'completed'})
      )}&unrelated_q=1`,
      'http://localhost/base-path/?unrelated_q=1#/betalen?of_payment_status=completed',
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
      'http://localhost/?unrelated_q=1#/afspraak-maken',
    ],
    [
      `/?_of_action=cosign&_of_action_params=${encodeURIComponent(
        JSON.stringify({submission_uuid: 'abc'})
      )}&unrelated_q=1`,
      'http://localhost/?unrelated_q=1#/cosign/check?submission_uuid=abc',
    ],
    [
      `/?_of_action=resume&_of_action_params=${encodeURIComponent(
        JSON.stringify({step_slug: 'step-1', submission_uuid: 'abc'})
      )}&unrelated_q=1`,
      'http://localhost/?unrelated_q=1#/stap/step-1?submission_uuid=abc',
    ],
    [
      `/?_of_action=payment&_of_action_params=${encodeURIComponent(
        JSON.stringify({of_payment_status: 'completed'})
      )}&unrelated_q=1`,
      'http://localhost/?unrelated_q=1#/betalen?of_payment_status=completed',
    ],
  ])(
    'should handle action redirects correctly (hash based routing)',
    async (initialUrl, expected) => {
      mswServer.use(...apiMocks);
      const formRoot = document.createElement('div');
      window.history.pushState(null, '', initialUrl);
      new OpenForm(formRoot, {
        baseUrl: BASE_URL,
        basePath: '/i-must-be-ignored',
        formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
        useHashRouting: true,
        lang: 'nl',
      });

      expect(location.href).toEqual(expected);
    }
  );
});
