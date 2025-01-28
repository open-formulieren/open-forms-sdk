import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {renderForm} from 'jstests/formio/utils';

const currencyForm = {
  type: 'form',
  components: [
    {
      key: 'currency',
      type: 'currency',
      label: 'Currency',
      validate: {
        required: true,
      },
    },
  ],
};

describe('The currency component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Single currency component with valid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(currencyForm);

    const input = screen.getByLabelText('Currency');

    expect(input).toBeVisible();

    await user.type(input, '6');

    expect(form.isValid()).toBeTruthy();
  });

  test('Single currency component with invalid input', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(currencyForm);

    const input = screen.getByLabelText('Currency');

    // Trigger validation
    await user.type(input, '6');
    await user.clear(input);
    await user.tab({shift: true});

    // Input is invalid and should have aria-describedby and aria-invalid
    expect(input).toHaveClass('is-invalid');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(form.isValid()).toBeFalsy();

    await user.type(input, '6');
    await user.tab({shift: true});

    // Input is again valid and without aria-describedby and aria-invalid
    expect(input).not.toHaveClass('is-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(form.isValid()).toBeTruthy();
  });
});
