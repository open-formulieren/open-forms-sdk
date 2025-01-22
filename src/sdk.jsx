import ProtectedEval from '@formio/protected-eval';
import 'flatpickr';
import lodash from 'lodash';
import {fixIconUrls as fixLeafletIconUrls} from 'map';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {Formio, Templates} from 'react-formio';
import ReactModal from 'react-modal';
import {RouterProvider, createBrowserRouter, createHashRouter, resolvePath} from 'react-router-dom';
import {NonceProvider} from 'react-select';

import {ConfigContext, FormContext} from 'Context';
import {get} from 'api';
import {getRedirectParams} from 'components/routingActions';
import {AddFetchAuth} from 'formio/plugins';
import {CSPNonce} from 'headers';
import {I18NErrorBoundary, I18NManager} from 'i18n';
import routes, {FUTURE_FLAGS} from 'routes';
import initialiseSentry from 'sentry';
import {DEBUG, getVersion} from 'utils';

import OpenFormsModule from './formio/module';
import OFLibrary from './formio/templates';
import './styles.scss';

// lodash must be bundled for Formio templates to work properly...
if (typeof window !== 'undefined') {
  window._ = lodash;
}

// use protected eval to not rely on unsafe-eval (CSP)
// eslint-disable-next-line react-hooks/rules-of-hooks
Formio.use(ProtectedEval);

// use custom component overrides
// eslint-disable-next-line react-hooks/rules-of-hooks
Formio.use(OpenFormsModule);
// use our own template library
Templates.current = OFLibrary;

Formio.registerPlugin(AddFetchAuth, 'addFetchAuth');

Formio.libraries = {
  // The flatpickr css is added as part of our scss build so add empty attribute to
  //   prevent Formio trying to get this css from a CDN
  'flatpickr-css': '',
};

fixLeafletIconUrls();

const VERSION = getVersion();

class OpenForm {
  constructor(targetNode, opts) {
    const {
      baseUrl,
      basePath,
      formId,
      CSPNonce: CSPNonceValue,
      lang,
      sentryDSN,
      sentryEnv = '',
      languageSelectorTarget,
      useHashRouting = false,
      onLanguageChange,
    } = opts;

    this.targetNode = targetNode;
    this.baseUrl = baseUrl;
    this.formId = formId;
    this.formObject = null;
    this.lang = lang;
    this.useHashRouting = useHashRouting;
    this.onLanguageChange = typeof onLanguageChange === 'function' ? onLanguageChange : undefined;

    switch (typeof languageSelectorTarget) {
      case 'string': {
        this.languageSelectorTarget = document.querySelector(languageSelectorTarget);
        break;
      }
      case 'object': {
        this.languageSelectorTarget = languageSelectorTarget;
        break;
      }
      default:
        this.languageSelectorTarget = undefined;
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
  }

  makeRedirect() {
    // Perform pre-redirect based on this action: this is decoupled from the backend
    const query = new URLSearchParams(document.location.search);
    const action = query.get('_of_action');
    if (action) {
      const actionParamsQuery = query.get('_of_action_params');
      const actionParams = actionParamsQuery ? JSON.parse(actionParamsQuery) : {};
      query.delete('_of_action');
      query.delete('_of_action_params');

      const {path: redirectPath, query: redirectQuery = new URLSearchParams()} = getRedirectParams(
        action,
        actionParams
      );
      const newUrl = new URL(this.browserBasePath, window.location.origin);
      if (!this.useHashRouting) {
        newUrl.pathname += `${!newUrl.pathname.endsWith('/') ? '/' : ''}${redirectPath}`;
        // We first append query params from the redirect action
        for (let [key, val] of redirectQuery.entries()) {
          newUrl.searchParams.append(key, val);
        }
        // And extra unrelated query params
        for (let [key, val] of query.entries()) {
          newUrl.searchParams.append(key, val);
        }
      } else {
        // First add extra unrelated query params, before hash (`#`)
        for (let [key, val] of query.entries()) {
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
  }

  calculateClientBaseUrl() {
    // calculate the client-side base URL, as this is recorded in backend calls for
    // submissions.
    const clientBase = resolvePath(this.browserBasePath).pathname; // has leading slash
    this.clientBaseUrl = new URL(
      `${clientBase}${window.location.search}`,
      window.location.origin
    ).href;
  }

  async init() {
    ReactModal.setAppElement(this.targetNode);

    this.url = `${this.baseUrl}forms/${this.formId}`;
    this.targetNode.textContent = `Loading form...`;
    this.baseTitle = document.title;
    this.formObject = await get(this.url);
    this.root = createRoot(this.targetNode);
    this.render();
  }

  async onLanguageChangeDone(newLanguagecode) {
    if (this.onLanguageChange) {
      this.onLanguageChange(newLanguagecode);
      return;
    }
    this.formObject = await get(this.url);
    this.render();
  }

  render() {
    const createRouter = this.useHashRouting ? createHashRouter : createBrowserRouter;
    const router = createRouter(routes, {basename: this.routerBasePath, future: FUTURE_FLAGS});

    // render the wrapping React component
    this.root.render(
      <React.StrictMode>
        <FormContext.Provider value={this.formObject}>
          <ConfigContext.Provider
            value={{
              baseUrl: this.baseUrl,
              clientBaseUrl: this.clientBaseUrl,
              basePath: this.routerBasePath,
              baseTitle: this.baseTitle,
              // XXX: deprecate and refactor usage to use useFormContext?
              requiredFieldsWithAsterisk: this.formObject.requiredFieldsWithAsterisk,
              debug: DEBUG,
            }}
          >
            <NonceProvider nonce={CSPNonce.getValue()} cacheKey="sdk-react-select">
              <I18NErrorBoundary>
                <I18NManager
                  languageSelectorTarget={this.languageSelectorTarget}
                  onLanguageChangeDone={this.onLanguageChangeDone.bind(this)}
                >
                  <RouterProvider router={router} />
                </I18NManager>
              </I18NErrorBoundary>
            </NonceProvider>
          </ConfigContext.Provider>
        </FormContext.Provider>
      </React.StrictMode>
    );
  }
}

export default OpenForm;
export {ANALYTICS_PROVIDERS} from 'hooks/usePageViews';
export {VERSION, OpenForm, Formio, Templates, OFLibrary, OpenFormsModule};
