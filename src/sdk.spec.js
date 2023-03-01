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

    await act(async () => {
      await form.init();
      await waitForElementToBeRemoved(() => within(formRoot).getByRole('status'));
    });

    expect(within(formRoot).getAllByText('Nederlandse versie').length).toBeGreaterThan(0);

    await act(async () => {
      await form.onLanguageChangeDone('en');
    });

    expect(within(formRoot).getAllByText('English version').length).toBeGreaterThan(0);
  });
});
