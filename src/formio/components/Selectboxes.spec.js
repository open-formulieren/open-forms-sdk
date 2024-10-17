import {expect} from '@storybook/test';
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
      key: 'selectboxes',
      type: 'selectboxes',
      label: 'Selectboxes',
      values: [
        {
          label: 'Optie A',
          value: 'selectA',
        },
        {
          label: 'Optie B',
          value: 'selectB',
        },
      ],
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

describe('The selectboxes component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Selectboxes component checked', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm();

    const selectboxA = screen.getByLabelText('Optie A');
    const selectboxB = screen.getByLabelText('Optie B');

    expect(selectboxA).toBeVisible();
    expect(selectboxB).toBeVisible();

    await user.click(selectboxA);

    expect(form.isValid()).toBeTruthy();
  });

  test('Selectboxes component without checked selectbox', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm();

    const selectboxA = screen.getByLabelText('Optie A');
    const selectboxB = screen.getByLabelText('Optie B');

    // Check and uncheck selectboxA to trigger the validation
    await user.click(selectboxA);
    await user.click(selectboxA);

    // All selectboxes are marked as invalid and have aria-describedby and aria-invalid
    expect(selectboxA.className.includes('is-invalid')).toBeTruthy();
    expect(selectboxB.className.includes('is-invalid')).toBeTruthy();
    expect(selectboxA.hasAttribute('aria-describedby')).toBeTruthy();
    expect(selectboxB.hasAttribute('aria-describedby')).toBeTruthy();
    expect(selectboxA.hasAttribute('aria-invalid')).toBeTruthy();
    expect(selectboxB.hasAttribute('aria-invalid')).toBeTruthy();
    expect(selectboxA.getAttribute('aria-invalid')).toBeTruthy();
    expect(selectboxB.getAttribute('aria-invalid')).toBeTruthy();
    expect(form.isValid()).toBeFalsy();

    await user.click(selectboxB);

    // All checkboxes are again marked as valid and without aria-describedby and aria-invalid
    expect(selectboxA.className.includes('is-invalid')).toBeFalsy();
    expect(selectboxB.className.includes('is-invalid')).toBeFalsy();
    expect(selectboxA.hasAttribute('aria-describedby')).toBeFalsy();
    expect(selectboxB.hasAttribute('aria-describedby')).toBeFalsy();
    expect(selectboxA.hasAttribute('aria-invalid')).toBeFalsy();
    expect(selectboxB.hasAttribute('aria-invalid')).toBeFalsy();
    expect(form.isValid()).toBeTruthy();
  });
});
