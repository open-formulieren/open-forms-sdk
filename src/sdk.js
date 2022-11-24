import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import 'flatpickr';

import {Formio, Templates} from 'react-formio';
import ProtectedEval from '@formio/protected-eval';

import OpenFormsModule from './formio/module';
import OFLibrary from './formio/templates';

import './styles.scss';

import {get} from 'api';
import {ConfigContext} from 'Context';
import App from 'components/App';
import {CSPNonce} from 'headers';
import {AddFetchAuth} from 'formio/plugins';
import {fixIconUrls as fixLeafletIconUrls} from 'map';
import {I18NManager, I18NErrorBoundary} from 'i18n';
import initialiseSentry from 'sentry';
import ReactModal from 'react-modal';

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
    } = opts;

    this.targetNode = targetNode;
    this.baseUrl = baseUrl;
    this.formId = formId;
    this.formObject = null;
    this.lang = lang;

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

    const url = `${this.baseUrl}forms/${this.formId}`;
    this.targetNode.textContent = `Loading form...`;
    this.formObject = await get(url);

    const prefix = document.title;

    // render the wrapping React component
    // TODO: make this work with React 18 which has a different react-dom API
    ReactDOM.render(
      <React.StrictMode>
        <ConfigContext.Provider
          value={{
            baseUrl: this.baseUrl,
            basePath: this.basePath,
            titlePrefix: prefix,
          }}
        >
          <I18NErrorBoundary>
            <I18NManager languageSelectorTarget={this.languageSelectorTarget}>
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
