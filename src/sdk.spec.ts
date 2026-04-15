import {afterEach, describe, expect, test, vi} from 'vitest';
import {page} from 'vitest/browser';

import {
  BASE_URL,
  buildForm,
  mockAnalyticsToolConfigGet,
  mockCustomStaticTranslationsNullGet,
  mockFormGet,
} from '@/api-mocks';
import mswWorker from '@/api-mocks/msw-worker';
import type {LanguageInfo} from '@/components/LanguageSelection/LanguageSelection';
import {mockLanguageInfoGet} from '@/components/LanguageSelection/mocks';

import {OpenForm} from './sdk';

const LANGUAGES: LanguageInfo['languages'] = [
  {code: 'nl', name: 'Nederlands'},
  {code: 'en', name: 'English'},
];

const apiMocks = [
  mockFormGet(buildForm({translationEnabled: true})),
  mockLanguageInfoGet(LANGUAGES),
  mockAnalyticsToolConfigGet(),
  mockCustomStaticTranslationsNullGet('en'),
  mockCustomStaticTranslationsNullGet('nl'),
];

afterEach(() => {
  document.body.innerHTML = '';
});

describe('OpenForm', () => {
  test('should accept a DOM node as languageSelectorTarget', async () => {
    mswWorker.use(...apiMocks);
    const formRoot = document.createElement('div');
    document.body.appendChild(formRoot);
    const target = document.createElement('div');
    document.body.appendChild(formRoot);
    document.body.appendChild(target);
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      languageSelectorTarget: target,
      lang: 'nl',
    });

    await form.init();

    // wait for the loader to be removed when all network requests have completed
    await expect.element(page.getByRole('status')).not.toBeInTheDocument();
    await expect.poll(() => target).not.toBeEmptyDOMElement();
  });

  test('should accept a target selector string as languageSelectorTarget', async () => {
    document.body.innerHTML = `
      <div id="my-languages-element"></div>
      <div id="root"></div>
    `;
    const formRoot = document.getElementById('root')!;
    const target = document.getElementById('my-languages-element');
    mswWorker.use(...apiMocks);
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      languageSelectorTarget: '#my-languages-element',
      lang: 'nl',
    });

    await form.init();

    // wait for the loader to be removed when all network requests have completed
    await expect.element(page.getByRole('status')).not.toBeInTheDocument();
    await expect.poll(() => target).not.toBeEmptyDOMElement();
  });

  test('should render the form on init', async () => {
    const formRoot = document.createElement('div');
    document.body.appendChild(formRoot);
    mswWorker.use(...apiMocks);
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      lang: 'nl',
    });

    await form.init();

    // wait for the loader to be removed when all network requests have completed
    await expect.element(page.getByRole('status')).not.toBeInTheDocument();
    await expect.poll(() => formRoot).not.toHaveTextContent('Loading');
  });

  test('should re-fetch the form to get new literals after language change', async () => {
    const formRoot = document.createElement('div');
    document.body.appendChild(formRoot);
    // first we load NL variant, second time we load the form in NL
    const formNL = buildForm({translationEnabled: true, name: 'Nederlandse versie'});
    const formEN = buildForm({translationEnabled: true, name: 'English version'});
    mswWorker.use(
      mockFormGet(formNL, true),
      mockFormGet(formEN, true),
      mockLanguageInfoGet(LANGUAGES),
      mockAnalyticsToolConfigGet(),
      mockCustomStaticTranslationsNullGet('nl'),
      mockCustomStaticTranslationsNullGet('en')
    );

    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      lang: 'nl',
    });

    await form.init();

    // wait for the loader to be removed when all network requests have completed
    await expect.element(page.getByRole('status')).not.toBeInTheDocument();
    await expect.element(page.getByRole('heading', {name: 'Nederlandse versie'})).toBeVisible();

    // @ts-expect-error we're calling a private method here
    await form.onLanguageChangeDone('en');

    await expect.element(page.getByRole('heading', {name: 'English version'})).toBeVisible();
  });

  test('should call the onLanguageChange callback on language change', async () => {
    mswWorker.use(...apiMocks);
    const formRoot = document.createElement('div');
    document.body.appendChild(formRoot);
    const target = document.createElement('div');
    document.body.appendChild(target);
    const onLanguageChangeMock = vi.fn();

    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      languageSelectorTarget: target,
      lang: 'nl',
      onLanguageChange: onLanguageChangeMock,
    });

    await form.init();

    // wait for the loader to be removed when all network requests have completed
    await expect.element(page.getByRole('status')).not.toBeInTheDocument();
    await expect.poll(() => target).not.toBeEmptyDOMElement();

    // @ts-expect-error we're calling a private method here
    await form.onLanguageChangeDone('en');

    // Second argument is the initialDataReference, which is null in this case
    await expect.poll(() => onLanguageChangeMock).toHaveBeenCalledWith('en', null);
  });

  test('should call the onLanguageChange callback with initial data reference', async () => {
    mswWorker.use(...apiMocks);
    window.history.pushState({}, '', '?initial_data_reference=foo');
    const formRoot = document.createElement('div');
    document.body.appendChild(formRoot);
    const target = document.createElement('div');
    document.body.appendChild(target);
    const onLanguageChangeMock = vi.fn();

    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      languageSelectorTarget: target,
      lang: 'nl',
      onLanguageChange: onLanguageChangeMock,
    });

    await form.init();

    // wait for the loader to be removed when all network requests have completed
    await expect.element(page.getByRole('status')).not.toBeInTheDocument();
    await expect.poll(() => target).not.toBeEmptyDOMElement();

    // @ts-expect-error we're calling a private method here
    await form.onLanguageChangeDone('en');

    // Ensure the data reference is kept when a language change happens
    await expect.poll(() => onLanguageChangeMock).toHaveBeenCalledWith('en', 'foo');

    // Remove query param to ensure other tests don't fail
    window.history.pushState({}, '', window.location.pathname);
  });

  test('should correctly set the formUrl', () => {
    mswWorker.use(...apiMocks);
    const formRoot = document.createElement('div');
    document.body.appendChild(formRoot);
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '/some-subpath/',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
    });

    // @ts-expect-error accessing a protected property here
    const clientBaseUrl = new URL(form.clientBaseUrl);
    expect(clientBaseUrl.host).toEqual(window.location.host);
    expect(clientBaseUrl.pathname).toEqual('/some-subpath');
  });

  test("shouldn't take basepath into account (hash based routing)", () => {
    mswWorker.use(...apiMocks);
    window.history.pushState({}, '', '/some-path');
    const formRoot = document.createElement('div');
    document.body.appendChild(formRoot);
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '/i-must-be-ignored',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      useHashRouting: true,
    });

    // @ts-expect-error accessing a protected property here
    const clientBaseUrl = new URL(form.clientBaseUrl);
    expect(clientBaseUrl.host).toEqual(window.location.host);
    expect(clientBaseUrl.pathname).toEqual('/some-path');
  });

  test('must retain query string parameters with hash based routing', () => {
    mswWorker.use(...apiMocks);
    window.history.pushState({}, '', '/some-path?someQuery=foo');
    const formRoot = document.createElement('div');
    document.body.appendChild(formRoot);
    const form = new OpenForm(formRoot, {
      baseUrl: BASE_URL,
      basePath: '/i-must-be-ignored',
      formId: '81a22589-abce-4147-a2a3-62e9a56685aa',
      useHashRouting: true,
    });

    // @ts-expect-error accessing a protected property here
    const clientBaseUrl = new URL(form.clientBaseUrl);
    expect(clientBaseUrl.host).toEqual(window.location.host);
    expect(clientBaseUrl.pathname).toEqual('/some-path');
    expect(clientBaseUrl.searchParams.get('someQuery')).toEqual('foo');
  });

  test.each([
    [
      `/some-subpath?_of_action=afspraak-annuleren&_of_action_params=${encodeURIComponent(
        JSON.stringify({time: '2021-07-21T12:00:00+00:00'})
      )}`,
      `http://${window.location.host}/some-subpath/afspraak-annuleren?time=2021-07-21T12%3A00%3A00%2B00%3A00`,
    ],
    [
      '/some-subpath?_of_action=afspraak-maken',
      `http://${window.location.host}/some-subpath/afspraak-maken`,
    ],
    [
      `/some-subpath?_of_action=cosign&_of_action_params=${encodeURIComponent(
        JSON.stringify({submission_uuid: 'abc'})
      )}`,
      `http://${window.location.host}/some-subpath/cosign/check?submission_uuid=abc`,
    ],
    [
      `/some-subpath?_of_action=resume&_of_action_params=${encodeURIComponent(
        JSON.stringify({step_slug: 'step-1', submission_uuid: 'abc'})
      )}`,
      `http://${window.location.host}/some-subpath/stap/step-1?submission_uuid=abc`,
    ],
  ])('should handle action redirects correctly', async (initialUrl, expected) => {
    mswWorker.use(...apiMocks);
    const formRoot = document.createElement('div');
    document.body.appendChild(formRoot);
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

  test.each([
    // With a base path:
    [
      // Omitting submission_uuid for simplicity
      `/base-path/?_of_action=afspraak-annuleren&unrelated_q=1&_of_action_params=${encodeURIComponent(
        JSON.stringify({time: '2021-07-21T12:00:00+00:00'})
      )}`,
      `http://${window.location.host}/base-path/?unrelated_q=1#/afspraak-annuleren?time=2021-07-21T12%3A00%3A00%2B00%3A00`,
    ],
    [
      '/base-path/?_of_action=afspraak-maken&unrelated_q=1',
      `http://${window.location.host}/base-path/?unrelated_q=1#/afspraak-maken`,
    ],
    [
      `/base-path/?_of_action=cosign&_of_action_params=${encodeURIComponent(
        JSON.stringify({submission_uuid: 'abc'})
      )}&unrelated_q=1`,
      `http://${window.location.host}/base-path/?unrelated_q=1#/cosign/check?submission_uuid=abc`,
    ],
    [
      `/base-path/?_of_action=resume&_of_action_params=${encodeURIComponent(
        JSON.stringify({step_slug: 'step-1', submission_uuid: 'abc'})
      )}&unrelated_q=1`,
      `http://${window.location.host}/base-path/?unrelated_q=1#/stap/step-1?submission_uuid=abc`,
    ],
    [
      `/base-path/?_of_action=payment&_of_action_params=${encodeURIComponent(
        JSON.stringify({of_payment_status: 'completed'})
      )}&unrelated_q=1`,
      `http://${window.location.host}/base-path/?unrelated_q=1#/betalen?of_payment_status=completed`,
    ],
    // Without a base path:
    [
      // Omitting submission_uuid for simplicity
      `/?_of_action=afspraak-annuleren&unrelated_q=1&_of_action_params=${encodeURIComponent(
        JSON.stringify({time: '2021-07-21T12:00:00+00:00'})
      )}`,
      `http://${window.location.host}/?unrelated_q=1#/afspraak-annuleren?time=2021-07-21T12%3A00%3A00%2B00%3A00`,
    ],
    [
      '/?_of_action=afspraak-maken&unrelated_q=1',
      `http://${window.location.host}/?unrelated_q=1#/afspraak-maken`,
    ],
    [
      `/?_of_action=cosign&_of_action_params=${encodeURIComponent(
        JSON.stringify({submission_uuid: 'abc'})
      )}&unrelated_q=1`,
      `http://${window.location.host}/?unrelated_q=1#/cosign/check?submission_uuid=abc`,
    ],
    [
      `/?_of_action=resume&_of_action_params=${encodeURIComponent(
        JSON.stringify({step_slug: 'step-1', submission_uuid: 'abc'})
      )}&unrelated_q=1`,
      `http://${window.location.host}/?unrelated_q=1#/stap/step-1?submission_uuid=abc`,
    ],
    [
      `/?_of_action=payment&_of_action_params=${encodeURIComponent(
        JSON.stringify({of_payment_status: 'completed'})
      )}&unrelated_q=1`,
      `http://${window.location.host}/?unrelated_q=1#/betalen?of_payment_status=completed`,
    ],
  ])(
    'should handle action redirects correctly (hash based routing)',
    async (initialUrl, expected) => {
      mswWorker.use(...apiMocks);
      const formRoot = document.createElement('div');
      document.body.appendChild(formRoot);
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
