import RenderSettingsProvider from '@open-formulieren/formio-renderer/components/RendererSettingsProvider.js';
import type {SupportedLocales} from '@open-formulieren/types';
import 'flatpickr';
import React from 'react';
import {type Root, createRoot} from 'react-dom/client';
import ReactModal from 'react-modal';
import {createBrowserRouter, createHashRouter, resolvePath} from 'react-router';
import {RouterProvider} from 'react-router/dom';
import {NonceProvider} from 'react-select';

import {PARAM_NAME} from 'hooks/useInitialDataReference';

import {ConfigContext, FormContext} from '@/Context';
import {get} from '@/api';
import type {Form} from '@/data/forms';
import {CSPNonce} from '@/headers';
import {I18NErrorBoundary, I18NManager} from '@/i18n';
import routes, {FUTURE_FLAGS} from '@/routes';
import initialiseSentry from '@/sentry';
import {DEBUG, getVersion} from '@/utils';

import {type Action as RoutingAction, getRedirectParams} from './routingActions';
import './styles.scss';

// asynchronously 'pre-load' our formio initialization so that this can be split off
// from the main bundle into a separate chunk.
import('./formio-init');

const VERSION = getVersion();

export interface SDKOptions {
  baseUrl: string;
  formId: string; // UUID or slug
  basePath?: string;
  CSPNonce?: string;
  lang?: SupportedLocales;
  sentryDSN?: string;
  sentryEnv?: string;
  languageSelectorTarget?: string | HTMLElement | null;
  useHashRouting?: boolean;
  onLanguageChange?: (
    newLanguagecode: SupportedLocales,
    initialDataReference: string | null
  ) => void;
}

class OpenForm {
  protected targetNode: HTMLElement;
  protected baseUrl: string;
  protected apiUrl: string;
  protected initialDataReference: string | null;

  protected lang: SupportedLocales;
  protected languageSelectorTarget: HTMLElement | null;
  protected onLanguageChange: SDKOptions['onLanguageChange'];

  // resolved form definition from backend
  protected formObject: Form | null;

  protected useHashRouting: boolean;
  protected routerBasePath: string;
  protected browserBasePath: string;
  protected clientBaseUrl: string;
  protected baseDocumentTitle: string;

  private root: Root | null;

  public constructor(targetNode: HTMLElement, opts: SDKOptions) {
    const {
      baseUrl,
      basePath,
      formId,
      CSPNonce: CSPNonceValue = '',
      lang = 'nl',
      sentryDSN = '',
      sentryEnv = '',
      languageSelectorTarget,
      useHashRouting = false,
      onLanguageChange,
    } = opts;

    this.targetNode = targetNode;
    this.baseUrl = baseUrl;
    this.formObject = null;
    this.lang = lang;
    this.useHashRouting = useHashRouting;
    this.onLanguageChange = typeof onLanguageChange === 'function' ? onLanguageChange : undefined;

    this.apiUrl = `${baseUrl}forms/${formId}`;

    switch (typeof languageSelectorTarget) {
      case 'string': {
        this.languageSelectorTarget = document.querySelector(
          languageSelectorTarget
        ) as HTMLElement | null;
        break;
      }
      case 'object': {
        this.languageSelectorTarget = languageSelectorTarget;
        break;
      }
      default:
        this.languageSelectorTarget = null;
        break;
    }

    CSPNonce.setValue(CSPNonceValue);
    initialiseSentry(sentryDSN, sentryEnv);

    let pathname = this.useHashRouting ? '' : basePath || window.location.pathname;

    if (pathname.endsWith('/')) {
      // ensure that the pathname has no trailing slash (for react router)
      pathname = pathname.slice(0, pathname.length - 1);
    }
    this.routerBasePath = pathname;
    this.browserBasePath = this.useHashRouting ? window.location.pathname : pathname;
    this.makeRedirect();
    this.calculateClientBaseUrl();
    this.extractInitialDataReference();

    this.baseDocumentTitle = document.title;
    this.root = null;
  }

  protected makeRedirect() {
    // Perform pre-redirect based on this action: this is decoupled from the backend
    const query = new URLSearchParams(document.location.search);
    const action = query.get('_of_action');
    if (!action) return;

    const actionParamsQuery = query.get('_of_action_params');
    const actionParams = actionParamsQuery ? JSON.parse(actionParamsQuery) : null;
    query.delete('_of_action');
    query.delete('_of_action_params');

    const {path: redirectPath, query: redirectQuery = new URLSearchParams()} = getRedirectParams({
      action: action as RoutingAction['action'],
      params: actionParams,
    });
    const newUrl = new URL(this.browserBasePath, window.location.origin);
    if (!this.useHashRouting) {
      newUrl.pathname += `${!newUrl.pathname.endsWith('/') ? '/' : ''}${redirectPath}`;
      // We first append query params from the redirect action
      for (const [key, val] of redirectQuery.entries()) {
        newUrl.searchParams.append(key, val);
      }
      // And extra unrelated query params
      for (const [key, val] of query.entries()) {
        newUrl.searchParams.append(key, val);
      }
    } else {
      // First add extra unrelated query params, before hash (`#`)
      for (const [key, val] of query.entries()) {
        newUrl.searchParams.append(key, val);
      }

      // Then add our custom path as the hash part. Our query parameters are added here,
      // but are only parsed as such by react-router, e.g. location.searchParams
      // will not include them (as per RFC). This is why unrelated query params were added before hash.
      // TODO use query.size once we have better browser support
      newUrl.hash = `/${redirectPath}${[...redirectQuery].length ? '?' + redirectQuery : ''}`;
    }

    window.history.replaceState(null, '', newUrl);
  }

  protected calculateClientBaseUrl() {
    // calculate the client-side base URL, as this is recorded in backend calls for
    // submissions.
    const clientBase = resolvePath(this.browserBasePath).pathname; // has leading slash
    this.clientBaseUrl = new URL(
      `${clientBase}${window.location.search}`,
      window.location.origin
    ).href;
  }

  protected extractInitialDataReference() {
    const urlParams = new URLSearchParams(window.location.search);
    this.initialDataReference = urlParams.get(PARAM_NAME);
  }

  public async init() {
    ReactModal.setAppElement(this.targetNode);

    // Fixing an issue where browser (in particular Chrome) translations change the DOM
    // tree, causing React to lose track of DOM nodes and crashing the SDK.
    // See https://github.com/open-formulieren/open-forms/issues/5242
    this.targetNode.setAttribute('translate', 'no');

    this.targetNode.textContent = `Loading form...`;
    this.formObject = await get<Form>(this.apiUrl);

    this.root = createRoot(this.targetNode);
    this.render();
  }

  private async onLanguageChangeDone(newLanguagecode: SupportedLocales) {
    if (this.onLanguageChange) {
      this.onLanguageChange(newLanguagecode, this.initialDataReference);
      return;
    }
    this.formObject = await get<Form>(this.apiUrl);
    this.render();
  }

  private render() {
    const createRouter = this.useHashRouting ? createHashRouter : createBrowserRouter;
    const router = createRouter(routes, {basename: this.routerBasePath, future: FUTURE_FLAGS});

    if (!this.formObject) {
      throw new Error('Form must be loaded from the API, make sure to call `init` first.');
    }
    if (!this.root) {
      throw new Error('The react root is not yet initialized, make sure to call `init`` first.');
    }

    // render the wrapping React component
    this.root.render(
      <React.StrictMode>
        <FormContext.Provider value={this.formObject}>
          <ConfigContext.Provider
            value={{
              baseUrl: this.baseUrl,
              clientBaseUrl: this.clientBaseUrl,
              basePath: this.routerBasePath,
              baseTitle: this.baseDocumentTitle,
              // XXX: deprecate and refactor usage to use useFormContext?
              requiredFieldsWithAsterisk: this.formObject.requiredFieldsWithAsterisk,
              debug: DEBUG,
            }}
          >
            <RenderSettingsProvider
              requiredFieldsWithAsterisk={this.formObject.requiredFieldsWithAsterisk}
            >
              <NonceProvider nonce={CSPNonce.getValue() ?? ''} cacheKey="sdk-react-select">
                <I18NErrorBoundary>
                  <I18NManager
                    languageSelectorTarget={this.languageSelectorTarget}
                    onLanguageChangeDone={this.onLanguageChangeDone.bind(this)}
                  >
                    <RouterProvider router={router} />
                  </I18NManager>
                </I18NErrorBoundary>
              </NonceProvider>
            </RenderSettingsProvider>
          </ConfigContext.Provider>
        </FormContext.Provider>
      </React.StrictMode>
    );
  }
}

export default OpenForm;
export {ANALYTICS_PROVIDERS} from 'hooks/usePageViews';
export {VERSION, OpenForm};
