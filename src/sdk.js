import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import flatpickr from 'flatpickr';

import { Formio, Templates } from 'react-formio';
import ProtectedEval from '@formio/protected-eval';

import OpenFormsModule from './formio/module';
import OFLibrary from './formio/templates';

import './styles.scss';

import {CSPNonce} from 'headers';
import { AddFetchAuth } from 'formio/plugins';
import {fixIconUrls as fixLeafletIconUrls} from 'map';
import I18NManager from './i18n';
import ErrorBoundary from 'components/ErrorBoundary';
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
  'flatpickr-css': ''
};

fixLeafletIconUrls();

class OpenForm {
  constructor( targetNode, opts ) {
    const {
      baseUrl,
      basePath,
      formId,
      CSPNonce: CSPNonceValue,
      lang,
      sentryDSN,
      sentryEnv='',
      languageSelectorTarget,
    } = opts;

    this.targetNode = targetNode;
    this.baseUrl = baseUrl;
    this.formId = formId;
    this.formObject = null;
    this.lang = lang;

    switch (typeof languageSelectorTarget) {
      case "string": {
        this.languageSelectorTarget = document.querySelector(
          languageSelectorTarget
        );
        break;
      }
      case "object": {
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
    // use explicitly forced language, or look up the browser html lang attribute value
    const lang = this.lang || document.querySelector('html').getAttribute('lang');

    // Use the language to set the locale for flatpickr, which is used for translating widgets like the date picker.
    try {
      const flatpickrLocale = require(`flatpickr/dist/l10n/${lang}.js`)?.default[lang];
      if (flatpickrLocale) flatpickr.localize(flatpickrLocale);
    } catch (e) {
      console.error('Language module not available in flatpickr.');
    }

    ReactModal.setAppElement(this.targetNode);

    const url = `${this.baseUrl}forms/${this.formId}`;
    this.targetNode.textContent = `Loading form...`;

    // render the wrapping React component
    // TODO: make this work with React 18 which has a different react-dom API
    ReactDOM.render(
      <React.StrictMode>
        <Router basename={this.basePath}>
          {/* outer IntlProvider for errors thrown in I18NManager */}
          <IntlProvider messages={{}} locale='en' >
            <ErrorBoundary useCard>
              <I18NManager
                initialLang={lang}
                baseUrl={this.baseUrl}
                basePath={this.basePath}
                languageSelectorTarget={this.languageSelectorTarget}
                formUrl={url}
              />
            </ErrorBoundary>
          </IntlProvider>
        </Router>
      </React.StrictMode>,
      this.targetNode,
    );
  }
}

export default OpenForm;
export { ANALYTICS_PROVIDERS } from 'hooks/usePageViews';
export { OpenForm, Formio, Templates, OFLibrary, OpenFormsModule };
