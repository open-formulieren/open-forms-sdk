import {expect} from '@storybook/test';
import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';
import {Formio} from 'react-formio';

import {getComponentNode} from 'formio/components/jest-util';
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

    const input = screen.getByLabelText('Text');

    expect(input).toBeVisible();

    await user.type(input, 'foo');

    expect(form.isValid()).toBeTruthy();
  });

  test('Single textfield component with invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(textfieldForm);

    const input = screen.getByLabelText('Text');

    // Trigger validation
    await user.type(input, 'foo');
    await user.clear(input);
    // Lose focus of input
    await user.tab({shift: true});

    // Input is invalid and should have aria-describedby and aria-invalid
    expect(input).toHaveClass('is-invalid');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(form.isValid()).toBeFalsy();

    await user.type(input, 'foo');
    await user.tab({shift: true});

    // Input is again valid and without aria-describedby and aria-invalid
    expect(input).not.toHaveClass('is-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');
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
    expect(multipleInput).toHaveClass('is-invalid');
    expect(multipleInput).not.toHaveAttribute('aria-describedby');
    expect(multipleInput).not.toHaveAttribute('aria-invalid');
    expect(form.isValid()).toBeFalsy();
  });

  test('Multiple textfield without inputs', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleTextfieldForm);

    const multipleInput = screen.getByLabelText('Text list');
    const multipleTextComponent = getComponentNode(multipleInput);

    // Trigger validation
    await user.type(multipleInput, 'foo');
    await user.clear(multipleInput);
    await user.tab({shift: true});

    // Remove input
    const [removeButton] = screen.getAllByRole('button');
    await user.click(removeButton);

    expect(multipleTextComponent).toHaveClass('has-error');
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
    expect(inputs[0]).not.toHaveClass('is-invalid');
    expect(inputs[1]).not.toHaveClass('is-invalid');
    expect(form.isValid()).toBeTruthy();

    await user.clear(inputs[0]);
    await user.tab({shift: true});

    // Both inputs are now marked as invalid
    expect(inputs[0]).toHaveClass('is-invalid');
    expect(inputs[1]).toHaveClass('is-invalid');
    expect(form.isValid()).toBeFalsy();

    await user.type(inputs[0], 'foo bar');
    await user.tab({shift: true});

    // Both inputs are again valid
    expect(inputs[0]).not.toHaveClass('is-invalid');
    expect(inputs[1]).not.toHaveClass('is-invalid');
    expect(form.isValid()).toBeTruthy();
  });
});

// This is not officially supported yet... but due to the generic implementation it
// works. It is/was intended for file fields only at first.
describe('Textfield with soft required validation', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('The softRequiredErrors component is linked', async () => {
    const user = userEvent.setup({delay: 50});
    const FORM = {
      type: 'form',
      components: [
        {
          type: 'textfield',
          key: 'textfield',
          label: 'Text',
          validate: {required: false},
          openForms: {softRequired: true},
        },
        {
          id: 'softReq123',
          type: 'softRequiredErrors',
          key: 'softRequiredErrors',
          html: `{{ missingFields }}`,
        },
      ],
    };
    const {form} = await renderForm(FORM);

    const input = screen.getByLabelText('Text');

    // Trigger validation
    await user.type(input, 'foo');
    await user.clear(input);
    // Lose focus of input
    await user.tab({shift: true});

    // Input is invalid and should have aria-describedby and aria-invalid
    expect(input).not.toHaveClass('is-invalid');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid', 'true');
    expect(form.isValid()).toBeTruthy();

    // check that it points to a real div
    const expectedDiv = document.getElementById(input.getAttribute('aria-describedby'));
    expect(expectedDiv).not.toBeNull();

    await user.type(input, 'foo');
    await user.tab({shift: true});

    // Input is again valid and without aria-describedby and aria-invalid
    expect(input).not.toHaveClass('is-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(form.isValid()).toBeTruthy();
  });
});
