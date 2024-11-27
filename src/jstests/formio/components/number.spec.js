import _ from 'lodash';
import {Formio} from 'react-formio';

import OpenFormsModule from 'formio/module';

import {numberForm} from './fixtures/number';

// Use our custom components
Formio.use(OpenFormsModule);

describe('Number Component', () => {
  test('#2903 - Emptying number component results in null value in data', async () => {
    let formJSON = _.cloneDeep(numberForm);

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('number');
    component.setValue(13);

    expect(form._data['number']).toEqual(13);

    component.dataValue = null;

    // null, instead of undefined (default Formio behaviour which removes the key from the data)
    expect(form._data['number']).toEqual(null);
  });
});
