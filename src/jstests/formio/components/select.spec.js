import _ from 'lodash';
import {Formio} from 'react-formio';

import {BASE_URL} from 'api-mocks';
import OpenFormsModule from 'formio/module';

// Use our custom components
Formio.use(OpenFormsModule);

const selectForm = {
  type: 'form',
  components: [
    {
      type: 'select',
      key: 'selectWithInt',
      label: 'Select with integer values',
      data: {
        values: [
          {
            label: 'Optie 1',
            value: '1',
          },
          {
            label: 'Optie 2',
            value: '2',
          },
        ],
      },
      validate: {
        required: true,
      },
    },
  ],
  title: 'Test Select form',
  display: 'Test Select form',
  name: 'testSelectForm',
  path: 'testSelectForm',
};

describe('Select Component', () => {
  test('Values are always strings', done => {
    let formJSON = _.cloneDeep(selectForm);

    const element = document.createElement('div');

    Formio.createForm(element, formJSON, {baseUrl: BASE_URL})
      .then(form => {
        form.setPristine(false);
        const select = form.getComponent('selectWithInt');

        select.setValue('1');

        form
          .submit()
          .then(submission => {
            // Verify that the value of the select component in the submission data is as expected
            expect(submission.data.selectWithInt).toEqual('1');
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
});
