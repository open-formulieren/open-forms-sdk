import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';
import {Formio} from 'react-formio';

import {getAllChildInputs, getComponentNode} from 'formio/components/jest-util';
import OpenFormsModule from 'formio/module';

// Use our custom components
Formio.use(OpenFormsModule);

const passwordForm = {
  type: 'form',
  components: [
    {
      key: 'password',
      type: 'password',
      label: 'Password',
      validate: {
        required: true,
      },
    },
  ],
};

const multiplePasswordForm = {
  type: 'form',
  components: [
    {
      key: 'password',
      type: 'password',
      label: 'Multiple password',
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

describe('The password component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Single password component with valid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(passwordForm);

    const input = screen.getByLabelText('Password');

    expect(input).toBeVisible();

    await user.type(input, 'foo');

    expect(form.isValid()).toBeTruthy();
  });

  test('Single password component with invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(passwordForm);

    const input = screen.getByLabelText('Password');

    // Trigger validation
    await user.type(input, 'foo');
    await user.clear(input);
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

describe('The multiple password component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Multiple password component with valid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multiplePasswordForm);

    const input = screen.getByLabelText('Multiple password');

    expect(input).toBeVisible();

    await user.type(input, 'foo');

    expect(form.isValid()).toBeTruthy();
  });

  test('Multiple password component with invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multiplePasswordForm);

    const input = screen.getByLabelText('Multiple password');

    // Trigger validation
    await user.type(input, 'foo');
    await user.clear(input);
    await user.tab({shift: true});

    // The field is invalid, and shouldn't have the aria-describedby or aria-invalid tags
    expect(input).toHaveClass('is-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(form.isValid()).toBeFalsy();

    await user.type(input, 'foo');
    await user.tab({shift: true});

    // The field is again valid
    expect(input).not.toHaveClass('is-invalid');
    expect(form.isValid()).toBeTruthy();
  });

  test('Multiple password without inputs', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multiplePasswordForm);

    const input = screen.getByLabelText('Multiple password');
    const component = getComponentNode(input);

    // Trigger validation
    await user.type(input, 'foo');
    await user.clear(input);
    await user.tab({shift: true});

    // Remove input
    const [removeButton] = screen.getAllByRole('button');
    await user.click(removeButton);

    expect(component).toHaveClass('has-error');
    expect(form.isValid()).toBeFalsy();
  });

  test('Multiple password with one valid and one invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multiplePasswordForm);

    await user.click(screen.getByRole('button', {name: 'Add Another'}));

    // Password inputs cannot be found using `getByRole` https://github.com/testing-library/dom-testing-library/issues/1128#issuecomment-1125662009
    const component = getComponentNode(screen.getByLabelText('Multiple password'));
    const inputs = getAllChildInputs(component);
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
