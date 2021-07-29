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
import messagesNL from 'i18n';

// use custom component overrides
Formio.use(OpenFormsModule);
// use our own template library
Templates.current = OFLibrary;


class OpenForm {

  constructor( targetNode, { baseUrl, formId, basePath } ) {
    this.targetNode = targetNode;
    this.baseUrl = baseUrl;
    this.formId = formId;
    this.formObject = null;

    // ensure that the basename has no trailing slash (for react router)
    let pathname = basePath || window.location.pathname;
    if (pathname.endsWith('/')) {
      pathname = pathname.slice(0, pathname.length - 1);
    }
    this.basePath = pathname;
  }

  async init() {
    const url = `${this.baseUrl}forms/${this.formId}`;
    this.targetNode.textContent = `Loading form...`;

    // fetch the form object from the API
    this.formObject = await get(url);

    // render the wrapping React component
    ReactDOM.render(
      <React.StrictMode>
        <IntlProvider messages={messagesNL} locale="nl" defaultLocale="nl">
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
export { OpenForm };
