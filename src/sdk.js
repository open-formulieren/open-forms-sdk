import ProtectedEval from '@formio/protected-eval';
import 'flatpickr';
import {fixIconUrls as fixLeafletIconUrls} from 'map';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {Formio, Templates} from 'react-formio';
import ReactModal from 'react-modal';
import {RouterProvider, createBrowserRouter, createHashRouter, resolvePath} from 'react-router-dom';
import {NonceProvider} from 'react-select';

import {ConfigContext, FormContext} from 'Context';
import {get} from 'api';
import App, {routes as nestedRoutes} from 'components/App';
import {AddFetchAuth} from 'formio/plugins';
import {CSPNonce} from 'headers';
import {I18NErrorBoundary, I18NManager} from 'i18n';
import initialiseSentry from 'sentry';
import {getVersion} from 'utils';

import OpenFormsModule from './formio/module';
import OFLibrary from './formio/templates';
import './styles.scss';

// use protected eval to not rely on unsafe-eval (CSP)
Formio.use(ProtectedEval);

// use custom component overrides
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

const defaultDisplayComponents = {
  app: null,
  form: null,
  progressIndicator: null,
};

const routes = [
  {
    path: '*',
    element: <App />,
    children: nestedRoutes,
  },
];

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
      displayComponents = {}, // TODO: document as unstable API
      useHashRouting = false,
    } = opts;

    this.targetNode = targetNode;
    this.baseUrl = baseUrl;
    this.formId = formId;
    this.formObject = null;
    this.lang = lang;
    this.displayComponents = {...defaultDisplayComponents, ...displayComponents};
    this.useHashRouting = useHashRouting;

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

    if (useHashRouting) {
      this.basePath = '';
    } else {
      // ensure that the basename has no trailing slash (for react router)
      let pathname = basePath || window.location.pathname;
      if (pathname.endsWith('/')) {
        pathname = pathname.slice(0, pathname.length - 1);
      }
      this.basePath = pathname;
    }

    this.calculateClientBaseUrl();
  }

  calculateClientBaseUrl() {
    // calculate the client-side base URL, as this is recorded in backend calls for
    // submissions.
    const clientBase = resolvePath(this.basePath).pathname; // has leading slash
    const prefix = this.useHashRouting ? window.location.pathname : ''; // may have trailing slash
    this.clientBaseUrl = new URL(
      this.useHashRouting ? `${prefix}#${clientBase}` : clientBase,
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
    this.formObject = await get(this.url);
    this.render();
  }

  render() {
    const createRouter = this.useHashRouting ? createHashRouter : createBrowserRouter;
    const router = createRouter(routes, {basename: this.basePath});

    // render the wrapping React component
    this.root.render(
      <React.StrictMode>
        <FormContext.Provider value={this.formObject}>
          <ConfigContext.Provider
            value={{
              baseUrl: this.baseUrl,
              clientBaseUrl: this.clientBaseUrl,
              basePath: this.basePath,
              baseTitle: this.baseTitle,
              displayComponents: this.displayComponents,
              // XXX: deprecate and refactor usage to use useFormContext?
              requiredFieldsWithAsterisk: this.formObject.requiredFieldsWithAsterisk,
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
