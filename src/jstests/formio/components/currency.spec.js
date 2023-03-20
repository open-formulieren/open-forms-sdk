import _ from 'lodash';
import React from 'react';
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

  test('#2903 - Emptying currency component results in null value in data', done => {
    let formJSON = _.cloneDeep(currencyForm);

    const element = document.createElement('div');

    Formio.createForm(element, formJSON)
      .then(form => {
        form.setPristine(false);
        const component = form.getComponent('currency');
        component.setValue(13);

        expect(form._data['currency']).toEqual(13);

        component.dataValue = null;

        // null, instead of undefined (default Formio behaviour which removes the key from the data)
        expect(form._data['currency']).toEqual(null);

        done();
      })
      .catch(done);
  });
});
