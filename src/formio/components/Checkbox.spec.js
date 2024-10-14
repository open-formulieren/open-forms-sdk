import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';
import {Formio} from 'react-formio';

import OpenFormsModule from 'formio/module';

// Use our custom components
Formio.use(OpenFormsModule);

const selectboxesForm = {
  type: 'form',
  components: [
    {
      key: 'checkbox',
      type: 'checkbox',
      label: 'Checkbox',
      validate: {
        required: true,
      },
    },
  ],
};

const renderForm = async () => {
  let formJSON = _.cloneDeep(selectboxesForm);
  const container = document.createElement('div');
  document.body.appendChild(container);
  const form = await Formio.createForm(container, formJSON);
  return {form, container};
};

describe('The checkbox component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Checkbox component required and checked', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm();

    const checkbox = screen.getByLabelText('Checkbox');

    expect(checkbox).toBeVisible();

    await user.click(checkbox);

    expect(form.isValid()).toBeTruthy();
  });

  test('Checkbox component required without being checked', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm();

    const checkbox = screen.getByLabelText('Checkbox');

    // Check and uncheck the checkbox to trigger the validation
    await user.click(checkbox);
    await user.click(checkbox);

    // All selectboxes are marked as invalid and have aria-describedby and aria-invalid
    expect(checkbox.className.includes('is-invalid')).toBeTruthy();
    expect(checkbox.hasAttribute('aria-describedby')).toBeTruthy();
    expect(checkbox.hasAttribute('aria-invalid')).toBeTruthy();
    expect(checkbox.getAttribute('aria-invalid')).toBeTruthy();
    expect(form.isValid()).toBeFalsy();

    await user.click(checkbox);

    // All checkboxes are again marked as valid and without aria-describedby and aria-invalid
    expect(checkbox.className.includes('is-invalid')).toBeFalsy();
    expect(checkbox.hasAttribute('aria-describedby')).toBeFalsy();
    expect(checkbox.hasAttribute('aria-invalid')).toBeFalsy();
    expect(form.isValid()).toBeTruthy();
  });
});
