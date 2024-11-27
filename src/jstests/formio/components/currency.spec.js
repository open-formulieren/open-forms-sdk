import _ from 'lodash';
import {Formio} from 'react-formio';

import OpenFormsModule from 'formio/module';

import {currencyForm} from './fixtures/currency';

// Use our custom components
Formio.use(OpenFormsModule);

describe('Currency Component', () => {
  test('Currency component with 0 decimalLimit formatted correctly', async () => {
    let formJSON = _.cloneDeep(currencyForm);

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('currency');
    const formattedValue = component.getValueAsString(1);

    expect(formattedValue).toEqual('€1');
  });

  test('#2903 - Emptying currency component results in null value in data', async () => {
    let formJSON = _.cloneDeep(currencyForm);

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('currency');
    component.setValue(13);

    expect(form._data['currency']).toEqual(13);

    component.dataValue = null;

    // null, instead of undefined (default Formio behaviour which removes the key from the data)
    expect(form._data['currency']).toEqual(null);
  });
});
