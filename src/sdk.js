// polyfill
import 'cookie-store';

import React from 'react';
import ReactDOM from 'react-dom';

import { Formio, Templates } from 'react-formio';

import OpenFormsModule from './formio/module';
import OFLibrary from './formio/templates';

import './styles.scss';

import { get } from './api';
import { ConfigContext } from './Context';
import { Form } from './Form';

// use custom component overrides
Formio.use(OpenFormsModule);
// use our own template library
Templates.current = OFLibrary;


class OpenForm {

    constructor( targetNode, { baseUrl, formId } ) {
        this.targetNode = targetNode;
        this.baseUrl = baseUrl;
        this.formId = formId;
        this.formObject = null;
    }

    async init() {
        const url = `${this.baseUrl}forms/${this.formId}`;
        this.targetNode.textContent = `Loading form...`;

        // fetch the form object from the API
        this.formObject = await get(url);

        // render the wrapping React component
        ReactDOM.render(
          <React.StrictMode>
            <ConfigContext.Provider value={{baseUrl: this.baseUrl}}>
              <Form form={this.formObject} />
            </ConfigContext.Provider>
          </React.StrictMode>,
          this.targetNode,
        );
    }
}


export default OpenForm;
export { OpenForm };
