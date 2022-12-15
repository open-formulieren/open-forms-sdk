import ProtectedEval from '@formio/protected-eval';
import 'flatpickr';
import {fixIconUrls as fixLeafletIconUrls} from 'map';
import React from 'react';
import ReactDOM from 'react-dom';
import {Formio, Templates} from 'react-formio';
import ReactModal from 'react-modal';
import {BrowserRouter as Router} from 'react-router-dom';

import {ConfigContext} from 'Context';
import {get} from 'api';
import App from 'components/App';
import {AddFetchAuth} from 'formio/plugins';
import {CSPNonce} from 'headers';
import {I18NErrorBoundary, I18NManager} from 'i18n';
import initialiseSentry from 'sentry';

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

const defaultDisplayComponents = {
  app: null,
  form: null,
  progressIndicator: null,
};

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
    } = opts;

    this.targetNode = targetNode;
    this.baseUrl = baseUrl;
    this.formId = formId;
    this.formObject = null;
    this.lang = lang;
    this.displayComponents = {...defaultDisplayComponents, ...displayComponents};

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

    // ensure that the basename has no trailing slash (for react router)
    let pathname = basePath || window.location.pathname;
    if (pathname.endsWith('/')) {
      pathname = pathname.slice(0, pathname.length - 1);
    }
    this.basePath = pathname;
  }

  async init() {
    ReactModal.setAppElement(this.targetNode);

    this.url = `${this.baseUrl}forms/${this.formId}`;
    this.targetNode.textContent = `Loading form...`;
    this.titlePrefix = document.title;
    this.formObject = await get(this.url);
    this.render();
  }

  async onLanguageChangeDone(newLanguagecode) {
    this.formObject = await get(this.url);
    this.render();
  }

  async render() {
    // render the wrapping React component
    // TODO: make this work with React 18 which has a different react-dom API
    ReactDOM.render(
      <React.StrictMode>
        <ConfigContext.Provider
          value={{
            baseUrl: this.baseUrl,
            basePath: this.basePath,
            titlePrefix: this.titlePrefix,
            displayComponents: this.displayComponents,
          }}
        >
          <I18NErrorBoundary>
            <I18NManager
              languageSelectorTarget={this.languageSelectorTarget}
              onLanguageChangeDone={this.onLanguageChangeDone.bind(this)}
            >
              <Router basename={this.basePath}>
                <App form={this.formObject} />
              </Router>
            </I18NManager>
          </I18NErrorBoundary>
        </ConfigContext.Provider>
      </React.StrictMode>,
      this.targetNode
    );
  }
}

export default OpenForm;
export {ANALYTICS_PROVIDERS} from 'hooks/usePageViews';
export {OpenForm, Formio, Templates, OFLibrary, OpenFormsModule};
