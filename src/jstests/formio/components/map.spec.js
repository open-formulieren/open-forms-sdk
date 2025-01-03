import _ from 'lodash';
import {Formio} from 'react-formio';

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
  test('Hidden map component', async () => {
    let formJSON = _.cloneDeep(mapForm);

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
  });
});
