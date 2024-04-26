import _ from 'lodash';
import {Formio} from 'react-formio';

// Use our custom components
import OpenFormsModule from 'formio/module';

Formio.use(OpenFormsModule);

const mapForm = {
  type: 'form',
  components: [
    {
      label: 'Hidden map',
      key: 'map',
      type: 'map',
      hidden: true,
    },
  ],
  title: 'Test Map form',
  display: 'Test Map form',
  name: 'testMapForm',
  path: 'testMapForm',
};

describe('Map component', () => {
  test('Hidden map component', done => {
    let formJSON = _.cloneDeep(mapForm);

    const element = document.createElement('div');

    Formio.createForm(element, formJSON)
      .then(form => {
        form.setPristine(false);
        done();
      })
      .catch(done);
  });
});
