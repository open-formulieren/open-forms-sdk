import React from 'react';
import _ from 'lodash';
import {Formio} from 'react-formio';

import OpenFormsModule from 'formio/module';
import {currencyForm} from './fixtures/currency';

// Use our custom components
Formio.use(OpenFormsModule);

describe('Currency Component', () => {
  test('Currency component with 0 decimalLimit formatted correctly', done => {
    let formJSON = _.cloneDeep(currencyForm);

    const element = document.createElement('div');

    Formio.createForm(element, formJSON)
      .then(form => {
        form.setPristine(false);
        const component = form.getComponent('currency');
        const formattedValue = component.getValueAsString(1);

        expect(formattedValue).toEqual('€1');

        done();
      })
      .catch(done);
  });
});
