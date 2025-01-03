import cloneDeep from 'lodash/cloneDeep';
import {Formio} from 'react-formio';

import {BASE_URL} from 'api-mocks';

import {editgridForm} from './fixtures/editgrid';

describe('EditGrid Component', () => {
  test('Unsaved row raises error', async () => {
    // setup
    const formJSON = cloneDeep(editgridForm);
    const data = {repeatingGroup: []};

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON, {baseUrl: BASE_URL});
    form.setPristine(false);
    const componentRepeatingGroup = form.getComponent('repeatingGroup');

    // check presumption
    expect(form.errors.length).toBe(0);

    // act
    componentRepeatingGroup.addRow();
    await form.checkAsyncValidity(data, true, data);

    //assert
    expect(form.errors.length).toBeGreaterThan(0);
  });
});
