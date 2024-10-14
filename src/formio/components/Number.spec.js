import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';
import {Formio} from 'react-formio';

import {getComponent} from 'formio/components/jest-util';
import OpenFormsModule from 'formio/module';

// Use our custom components
Formio.use(OpenFormsModule);

const numberForm = {
  type: 'form',
  components: [
    {
      key: 'number',
      type: 'number',
      label: 'Number',
      validate: {
        required: true,
      },
    },
  ],
};

const multipleNumberForm = {
  type: 'form',
  components: [
    {
      key: 'number',
      type: 'number',
      label: 'Multiple number',
      multiple: true,
      validate: {
        required: true,
      },
    },
  ],
};

const renderForm = async formConfig => {
  let formJSON = _.cloneDeep(formConfig);
  const container = document.createElement('div');
  document.body.appendChild(container);
  const form = await Formio.createForm(container, formJSON);
  return {form, container};
};

describe('The number component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Single number component with valid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(numberForm);

    const input = screen.getByLabelText('Number');

    expect(input).toBeVisible();

    await user.type(input, '6');

    expect(form.isValid()).toBeTruthy();
  });

  test('Single number component with invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(numberForm);

    const input = screen.getByLabelText('Number');

    // Trigger validation
    await user.type(input, '6');
    await user.clear(input);
    await user.tab({shift: true});

    // Input is invalid and should have aria-describedby and aria-invalid
    expect(input.className.includes('is-invalid')).toBeTruthy();
    expect(input.hasAttribute('aria-describedby')).toBeTruthy();
    expect(input.hasAttribute('aria-invalid')).toBeTruthy();
    expect(input.getAttribute('aria-invalid')).toBeTruthy();
    expect(form.isValid()).toBeFalsy();

    await user.type(input, '6');
    await user.tab({shift: true});

    // Input is again valid and without aria-describedby and aria-invalid
    expect(input.className.includes('is-invalid')).toBeFalsy();
    expect(input.hasAttribute('aria-describedby')).toBeFalsy();
    expect(input.hasAttribute('aria-invalid')).toBeFalsy();
    expect(form.isValid()).toBeTruthy();
  });
});

describe('The multiple number component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Multiple number component with valid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleNumberForm);

    const input = screen.getByLabelText('Multiple number');

    expect(input).toBeVisible();

    await user.type(input, '6');

    expect(form.isValid()).toBeTruthy();
  });

  test('Multiple number component with invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleNumberForm);

    const input = screen.getByLabelText('Multiple number');

    // Trigger validation
    await user.type(input, '6');
    await user.clear(input);
    await user.tab({shift: true});

    // The field is invalid, and shouldn't have the aria-describedby or aria-invalid tags
    expect(input.className.includes('is-invalid')).toBeTruthy();
    expect(input.hasAttribute('aria-describedby')).toBeFalsy();
    expect(input.hasAttribute('aria-invalid')).toBeFalsy();
    expect(form.isValid()).toBeFalsy();

    await user.type(input, '6');
    await user.tab({shift: true});

    // The field is again valid
    expect(input.className.includes('is-invalid')).toBeFalsy();
    expect(form.isValid()).toBeTruthy();
  });

  test('Multiple number without inputs', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleNumberForm);

    const input = screen.getByLabelText('Multiple number');
    const component = getComponent(input);

    // Trigger validation
    await user.type(input, '6');
    await user.clear(input);
    await user.tab({shift: true});

    // Remove input
    const [removeButton] = screen.getAllByRole('button');
    await user.click(removeButton);

    expect(component.className.includes('has-error')).toBeTruthy();
    expect(form.isValid()).toBeFalsy();
  });

  test('Multiple number with one valid and one invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleNumberForm);

    await user.click(screen.getByRole('button', {name: 'Add Another'}));

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);

    await user.type(inputs[0], '6');
    await user.type(inputs[1], '12');
    await user.tab({shift: true});

    // The Both inputs are valid
    expect(inputs[0].className.includes('is-invalid')).toBeFalsy();
    expect(inputs[1].className.includes('is-invalid')).toBeFalsy();
    expect(form.isValid()).toBeTruthy();

    await user.clear(inputs[0]);
    await user.tab({shift: true});

    // Both inputs are now marked as invalid
    expect(inputs[0].className.includes('is-invalid')).toBeTruthy();
    expect(inputs[1].className.includes('is-invalid')).toBeTruthy();
    expect(form.isValid()).toBeFalsy();

    await user.type(inputs[0], '3');
    await user.tab({shift: true});

    // Both inputs are again valid
    expect(inputs[0].className.includes('is-invalid')).toBeFalsy();
    expect(inputs[1].className.includes('is-invalid')).toBeFalsy();
    expect(form.isValid()).toBeTruthy();
  });
});
