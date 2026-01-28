import {screen, waitFor} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import 'flatpickr';
import {renderForm} from 'jstests/formio/utils';

import {getComponentNode} from 'formio/components/jest-util';
import {sleep} from 'utils';

const dateForm = {
  type: 'form',
  components: [
    {
      key: 'date',
      type: 'date',
      label: 'Date',
      format: 'dd-MM-yyyy',
      validate: {
        required: true,
      },
    },
  ],
};

const multipleDateForm = {
  type: 'form',
  components: [
    {
      key: 'date-multiple',
      type: 'date',
      label: 'Multiple date',
      format: 'dd-MM-yyyy',
      multiple: true,
      validate: {
        required: true,
      },
    },
  ],
};

const waitForFlatpickr = async node => {
  let calendarNode;
  for (let i = 0; i < 20; i++) {
    calendarNode = node.querySelector('.flatpickr-calendar');
    if (calendarNode !== null) return;
    await sleep(100);
  }
};

describe('The date component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Single date component with valid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form, container} = await renderForm(dateForm);
    await waitForFlatpickr(container);

    const input = screen.getByRole('textbox');

    expect(input).toBeVisible();

    await user.type(input, '16-08-2024');
    await user.tab({shift: true});

    expect(form.isValid()).toBeTruthy();
  }, 10000);

  test('Single date component with invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form, container} = await renderForm(dateForm);
    await waitForFlatpickr(container);

    const input = screen.getByRole('textbox');
    expect(input).toBeVisible();

    // Trigger validation
    await user.type(input, '16-08-2024');
    await user.tab({shift: true});
    await user.clear(input);
    await user.tab({shift: true});

    // Input is invalid and should have aria-describedby and aria-invalid
    expect(input).toHaveClass('is-invalid');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(form.isValid()).toBeFalsy();

    await user.type(input, '16-08-2024');
    await user.tab({shift: true});

    // Input is again valid and without aria-describedby and aria-invalid
    await waitFor(async () => {
      expect(input).not.toHaveClass('is-invalid');
      expect(input).not.toHaveAttribute('aria-describedby');
      expect(input).not.toHaveAttribute('aria-invalid', 'true');
      expect(form.isValid()).toBeTruthy();
    });
  }, 10000);
});

describe('The multiple date component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Multiple date component with valid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form, container} = await renderForm(multipleDateForm);
    await waitForFlatpickr(container);

    const input = screen.getByRole('textbox');

    expect(input).toBeVisible();

    await user.type(input, '16-08-2024');
    await user.tab({shift: true});

    expect(form.isValid()).toBeTruthy();
  }, 10000);

  test('Multiple date component with invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form, container} = await renderForm(multipleDateForm);
    await waitForFlatpickr(container);

    const input = screen.getByRole('textbox');

    // Trigger validation
    await user.type(input, '16-08-2024');
    await user.tab({shift: true});
    await user.clear(input);
    await user.tab({shift: true});

    // The field is invalid, and shouldn't have the aria-describedby or aria-invalid tags
    expect(input).toHaveClass('is-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(form.isValid()).toBeFalsy();

    await user.type(input, '16-08-2024');
    await user.tab({shift: true});

    // The field is again valid

    await waitFor(async () => {
      expect(input).not.toHaveClass('is-invalid');
      expect(form.isValid()).toBeTruthy();
    });
  }, 10000);

  test('Multiple date without inputs', async () => {
    const user = userEvent.setup({delay: 50});
    const {form, container} = await renderForm(multipleDateForm);
    await waitForFlatpickr(container);

    const input = screen.getByRole('textbox');
    const component = getComponentNode(input);

    // Trigger validation
    await user.type(input, '16-08-2024');
    await user.tab({shift: true});
    await user.clear(input);
    await user.tab({shift: true});

    // Remove input
    const [removeButton] = screen.getAllByRole('button');
    await user.click(removeButton);

    expect(component).toHaveClass('has-error');
    expect(form.isValid()).toBeFalsy();
  }, 10000);

  test('Multiple date with one valid and one invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form, container} = await renderForm(multipleDateForm);
    await waitForFlatpickr(container);

    await user.click(screen.getByRole('button', {name: 'Add Another'}));

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);

    await user.type(inputs[0], '08-08-2024 14:45');
    await user.type(inputs[1], '08-08-2024 14:45');
    await user.click(container);

    // The Both inputs are valid
    await waitFor(async () => {
      expect(inputs[0]).not.toHaveClass('is-invalid');
      expect(inputs[1]).not.toHaveClass('is-invalid');
      expect(form.isValid()).toBeTruthy();
    });

    await user.clear(inputs[0]);
    await user.click(container);

    // Only the invalid input is marked as invalid
    await waitFor(async () => {
      expect(inputs[0]).toHaveClass('is-invalid');
      expect(inputs[1]).not.toHaveClass('is-invalid');
      expect(form.isValid()).toBeFalsy();
    });

    await user.type(inputs[0], '16-08-2024');
    await user.tab({shift: true});

    // Both inputs are again valid
    await waitFor(async () => {
      expect(inputs[0]).not.toHaveClass('is-invalid');
      expect(inputs[1]).not.toHaveClass('is-invalid');
      expect(form.isValid()).toBeTruthy();
    });
  }, 10000);
});
