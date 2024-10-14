import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';
import {Formio} from 'react-formio';

import {getComponent} from 'formio/components/jest-util';
import OpenFormsModule from 'formio/module';

// Use our custom components
Formio.use(OpenFormsModule);

const textfieldForm = {
  type: 'form',
  components: [
    {
      key: 'textfield-single',
      type: 'textfield',
      label: 'Text',
      validate: {
        required: true,
      },
    },
  ],
};

const multipleTextfieldForm = {
  type: 'form',
  components: [
    {
      key: 'textfield-multiple',
      type: 'textfield',
      label: 'Text list',
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

describe('The text component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Single textfield component with valid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(textfieldForm);

    const singleInput = screen.getByLabelText('Text');

    expect(singleInput).toBeVisible();

    await user.type(singleInput, 'foo');

    expect(form.isValid()).toBeTruthy();
  });

  test('Single textfield component with invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(textfieldForm);

    const singleInput = screen.getByLabelText('Text');

    // Trigger validation
    await user.type(singleInput, 'foo');
    await user.clear(singleInput);
    // Lose focus of input
    await user.tab({shift: true});

    // Input is invalid and should have aria-describedby and aria-invalid
    expect(singleInput.className.includes('is-invalid')).toBeTruthy();
    expect(singleInput.hasAttribute('aria-describedby')).toBeTruthy();
    expect(singleInput.hasAttribute('aria-invalid')).toBeTruthy();
    expect(singleInput.getAttribute('aria-invalid')).toBeTruthy();
    expect(form.isValid()).toBeFalsy();

    await user.type(singleInput, 'foo');
    await user.tab({shift: true});

    // Input is again valid and without aria-describedby and aria-invalid
    expect(singleInput.className.includes('is-invalid')).toBeFalsy();
    expect(singleInput.hasAttribute('aria-describedby')).toBeFalsy();
    expect(singleInput.hasAttribute('aria-invalid')).toBeFalsy();
    expect(form.isValid()).toBeTruthy();
  });
});

describe('The mutiple text component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Multiple textfield component with valid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleTextfieldForm);

    const multipleInput = screen.getByLabelText('Text list');

    expect(multipleInput).toBeVisible();

    await user.type(multipleInput, 'foo');

    expect(form.isValid()).toBeTruthy();
  });

  test('Multiple textfield component with invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleTextfieldForm);

    const multipleInput = screen.getByLabelText('Text list');

    // Trigger validation
    await user.type(multipleInput, 'foo');
    await user.clear(multipleInput);
    await user.tab({shift: true});

    // The field is invalid, and shouldn't have the aria-describedby or aria-invalid tags
    expect(multipleInput.className.includes('is-invalid')).toBeTruthy();
    expect(multipleInput.hasAttribute('aria-describedby')).toBeFalsy();
    expect(multipleInput.hasAttribute('aria-invalid')).toBeFalsy();

    expect(form.isValid()).toBeFalsy();
  });

  test('Multiple textfield without inputs', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleTextfieldForm);

    const multipleInput = screen.getByLabelText('Text list');
    const multipleTextComponent = getComponent(multipleInput);

    // Trigger validation
    await user.type(multipleInput, 'foo');
    await user.clear(multipleInput);
    await user.tab({shift: true});

    // Remove input
    const [removeButton] = screen.getAllByRole('button');
    await user.click(removeButton);

    expect(multipleTextComponent.className.includes('has-error')).toBeTruthy();
    expect(form.isValid()).toBeFalsy();
  });

  test('Multiple textfield with one valid and one invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleTextfieldForm);

    await user.click(screen.getByRole('button', {name: 'Add Another'}));

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);

    await user.type(inputs[0], 'foo');
    await user.type(inputs[1], 'bar');
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

    await user.type(inputs[0], 'foo bar');
    await user.tab({shift: true});

    // Both inputs are again valid
    expect(inputs[0].className.includes('is-invalid')).toBeFalsy();
    expect(inputs[1].className.includes('is-invalid')).toBeFalsy();
    expect(form.isValid()).toBeTruthy();
  });
});
