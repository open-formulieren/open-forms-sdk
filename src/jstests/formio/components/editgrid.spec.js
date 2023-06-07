import _ from 'lodash';
import {Formio} from 'react-formio';

import OpenFormsModule from 'formio/module';

import {editgridForm} from './fixtures/editgrid';

// Use our custom components
Formio.use(OpenFormsModule);

describe('EditGrid Component', () => {
  test('Unsaved row raises error', done => {
    let formJSON = _.cloneDeep(editgridForm);
    const data = {repeatingGroup: []};

    const element = document.createElement('div');

    let formInstance;

    Formio.createForm(element, formJSON, {baseUrl: 'http://test-base.nl/'})
      .then(form => {
        form.setPristine(false);
        const componentRepeatingGroup = form.getComponent('repeatingGroup');
        componentRepeatingGroup.addRow();

        formInstance = form;

        return form.checkAsyncValidity(data, true, data);
      })
      .then(isValid => {
        setTimeout(() => {
          expect(formInstance.errors.length).toBeGreaterThan(0);
          done();
        }, 300);
      })
      .catch(done);
  });
});
