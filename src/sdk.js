import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import flatpickr from 'flatpickr';

import { Formio, Templates } from 'react-formio';

import OpenFormsModule from './formio/module';
import OFLibrary from './formio/templates';

import './styles.scss';

import { get } from 'api';
import { ConfigContext, FormioTranslations } from 'Context';
import App from 'components/App';
import { AddFetchAuth } from 'formio/plugins';
import {fixIconUrls as fixLeafletIconUrls} from 'map';
import {loadLocaleData, loadFormioTranslations} from 'i18n';
import initialiseSentry from 'sentry';

// use custom component overrides
Formio.use(OpenFormsModule);
// use our own template library
Templates.current = OFLibrary;

Formio.registerPlugin(AddFetchAuth, 'addFetchAuth');

fixLeafletIconUrls();

class OpenForm {

  constructor( targetNode, opts ) {
    const {
      baseUrl, formId,
      basePath,
      lang,
      sentryDSN,
      sentryEnv='',
    } = opts;

    this.targetNode = targetNode;
    this.baseUrl = baseUrl;
    this.formId = formId;
    this.formObject = null;
    this.lang = lang;

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

    const url = `${this.baseUrl}forms/${this.formId}`;
    this.targetNode.textContent = `Loading form...`;

    const promises = [
      // load the message catalog for i18n
      loadLocaleData(lang),
      loadFormioTranslations(this.baseUrl),
      // fetch the form object from the API
      get(url),
    ];
    const [messages, translations, formObject] = await Promise.all(promises);

    this.formObject = formObject;

    // render the wrapping React component
    ReactDOM.render(
      <React.StrictMode>
        <IntlProvider messages={messages} locale={lang} defaultLocale="nl">
          <ConfigContext.Provider value={{baseUrl: this.baseUrl}}>
            <FormioTranslations.Provider value={{i18n: translations, language: lang}}>
              <Router basename={this.basePath}>
                <App form={this.formObject} />
              </Router>
            </FormioTranslations.Provider>
          </ConfigContext.Provider>
        </IntlProvider>
      </React.StrictMode>,
      this.targetNode,
    );
  }
}


export default OpenForm;
export { ANALYTICS_PROVIDERS } from 'hooks/usePageViews';
export { OpenForm, Formio, Templates, OFLibrary, OpenFormsModule };
