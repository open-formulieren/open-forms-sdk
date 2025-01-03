import {screen, waitFor} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';
import {Formio} from 'react-formio';

import {getComponentNode} from 'formio/components/jest-util';

const timeForm = {
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

const multipleTimeForm = {
  type: 'form',
  components: [
    {
      key: 'time',
      type: 'time',
      input: true,
      label: 'Time',
      inputType: 'text',
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

describe('The time component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Time component with invalid time', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(timeForm);

    const input = screen.getByLabelText('Time');
    expect(input).toBeVisible();
    await user.type(input, '25:00');
    expect(input).toHaveDisplayValue('25:00');

    expect(form.isValid()).toBe(false);
  });

  test('Time component with invalid time has descriptive aria tags', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(timeForm);

    const input = screen.getByLabelText('Time');
    expect(input).toBeVisible();

    // Valid time input
    await user.type(input, '12:00');
    expect(form.isValid()).toBeTruthy();

    // Invalid time input
    await user.clear(input);
    await user.type(input, '25:00');

    // Expect the invalid time input to have aria-describedby and aria-invalid
    await waitFor(() => {
      expect(input).toHaveClass('is-invalid');
    });
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(form.isValid()).toBeFalsy();

    // Change time input to a valid time
    await user.clear(input);
    await user.type(input, '12:00');

    // Expect the valid time input to not have aria-describedby and aria-invalid
    await waitFor(() => {
      expect(input).not.toHaveClass('is-invalid');
    });
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(form.isValid()).toBeTruthy();
  });
});

describe('The time component multiple', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Multiple time component with valid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleTimeForm);

    const multipleInput = screen.getByLabelText('Time');

    expect(multipleInput).toBeVisible();

    await user.type(multipleInput, '12:00');

    expect(form.isValid()).toBeTruthy();
  });

  test('Multiple time component with invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleTimeForm);

    const input = screen.getByLabelText('Time');

    // Trigger validation
    await user.type(input, '25:00');
    await user.tab({shift: true});

    // The field is invalid, and shouldn't have the aria-describedby or aria-invalid tags
    await waitFor(() => {
      expect(input).toHaveClass('is-invalid');
    });
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');

    expect(form.isValid()).toBeFalsy();
  });

  test('Required multiple time without inputs', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleTimeForm);

    const input = screen.getByLabelText('Time');
    const component = getComponentNode(input);

    // Trigger validation
    await user.type(input, '25:00');
    await user.tab({shift: true});

    // Remove input
    const [removeButton] = screen.getAllByRole('button');
    await user.click(removeButton);

    await waitFor(() => {
      expect(component).toHaveClass('has-error');
    });
    expect(form.isValid()).toBeFalsy();
  });

  test('Multiple time with one valid and one invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(multipleTimeForm);

    await user.click(screen.getByRole('button', {name: 'Add Another'}));

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);

    await user.type(inputs[0], '12:00');
    await user.type(inputs[1], '12:00');
    await user.tab({shift: true});

    // The Both inputs are valid
    await waitFor(() => {
      expect(inputs[0]).not.toHaveClass('is-invalid');
    });
    expect(inputs[1]).not.toHaveClass('is-invalid');
    expect(form.isValid()).toBeTruthy();

    await user.clear(inputs[0]);
    await user.type(inputs[0], '25:00');
    await user.tab({shift: true});

    // Both inputs are now marked as invalid
    await waitFor(() => {
      expect(inputs[0]).toHaveClass('is-invalid');
    });
    expect(inputs[1]).toHaveClass('is-invalid');
    expect(form.isValid()).toBeFalsy();

    await user.clear(inputs[0]);
    await user.type(inputs[0], '12:00');
    await user.tab({shift: true});

    // Both inputs are again valid
    await waitFor(() => {
      expect(inputs[0]).not.toHaveClass('is-invalid');
    });
    expect(inputs[1]).not.toHaveClass('is-invalid');
    expect(form.isValid()).toBeTruthy();
  });
});
