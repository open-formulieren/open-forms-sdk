// TODO: figure out how to build/export this as UMD?
// find inspiration in https://github.com/formio/formio.js/tree/master/config
import React from 'react';
import ReactDOM from 'react-dom';

import { get } from './api';
import { ConfigContext } from './Context';
import { Form } from './Form';

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
