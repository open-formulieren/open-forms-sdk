import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import { Formio, Templates } from 'react-formio';

import OpenFormsModule from './formio/module';
import OFLibrary from './formio/templates';

import './styles.scss';

import { get } from 'api';
import { ConfigContext } from 'Context';
import { Form } from 'components/Form';
import { AddFetchAuth } from 'formio/plugins';
import loadLocaleData from 'i18n';
import {initialiseSentry} from 'utils';

// use custom component overrides
Formio.use(OpenFormsModule);
// use our own template library
Templates.current = OFLibrary;

Formio.registerPlugin(AddFetchAuth, 'addFetchAuth');


class OpenForm {

  constructor( targetNode, { baseUrl, formId, basePath, lang, sentryDns } ) {
    this.targetNode = targetNode;
    this.baseUrl = baseUrl;
    this.formId = formId;
    this.formObject = null;
    this.lang = lang;

    initialiseSentry(sentryDns);

    // ensure that the basename has no trailing slash (for react router)
    let pathname = basePath || window.location.pathname;
    if (pathname.endsWith('/')) {
      pathname = pathname.slice(0, pathname.length - 1);
    }
    this.basePath = pathname;
  }

  async init() {
    // use explicitly forced language, or look up the browser html lang attribute value
    const lang = this.lang || document.querySelector('html').getAttribute("lang");

    const url = `${this.baseUrl}forms/${this.formId}`;
    this.targetNode.textContent = `Loading form...`;

    const promises = [
      // load the message catalog for i18n
      loadLocaleData(lang),
      // fetch the form object from the API
      get(url),
    ];
    const [messages, formObject] = await Promise.all(promises);

    this.formObject = formObject

    // render the wrapping React component
    ReactDOM.render(
      <React.StrictMode>
        <IntlProvider messages={messages} locale={lang} defaultLocale="nl">
          <ConfigContext.Provider value={{baseUrl: this.baseUrl}}>
            <Router basename={this.basePath}>
              <Form form={this.formObject} />
            </Router>
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
