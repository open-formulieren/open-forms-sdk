import {screen, waitFor} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';
import {Formio} from 'react-formio';

import OpenFormsModule from 'formio/module';

// Use our custom components
Formio.use(OpenFormsModule);

const phoneForm = {
  type: 'form',
  components: [
    {
      key: 'time',
      type: 'time',
      input: true,
      label: 'Time',
      inputType: 'text',
    },
  ],
};

const renderForm = async () => {
  let formJSON = _.cloneDeep(phoneForm);
  const container = document.createElement('div');
  document.body.appendChild(container);
  const form = await Formio.createForm(container, formJSON);
  return {form, container};
};

describe('The time component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Time component with invalid time', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm();

    const input = screen.getByLabelText('Time');
    expect(input).toBeVisible();
    await user.type(input, '25:00');
    expect(input).toHaveDisplayValue('25:00');

    expect(form.isValid()).toBe(false);
  });
});
