import {screen, waitFor} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {renderForm} from 'jstests/formio/utils';

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

describe('The selectboxes component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('Selectboxes component checked', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(selectboxesForm);

    const selectboxA = screen.getByLabelText('Optie A');
    const selectboxB = screen.getByLabelText('Optie B');

    expect(selectboxA).toBeVisible();
    expect(selectboxB).toBeVisible();

    await user.click(selectboxA);

    expect(form.isValid()).toBeTruthy();
  });

  test('Selectboxes component without checked selectbox', async () => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(selectboxesForm);

    const selectboxA = screen.getByLabelText('Optie A');
    const selectboxB = screen.getByLabelText('Optie B');

    // Check and uncheck selectboxA to trigger the validation
    await user.click(selectboxA);
    await user.click(selectboxA);

    // All selectboxes are marked as invalid and have aria-describedby and aria-invalid
    expect(selectboxA).toHaveClass('is-invalid');
    expect(selectboxA).toHaveAttribute('aria-describedby');
    expect(selectboxA).toHaveAttribute('aria-invalid', 'true');
    expect(selectboxB).toHaveClass('is-invalid');
    expect(selectboxB).toHaveAttribute('aria-describedby');
    expect(selectboxB).toHaveAttribute('aria-invalid', 'true');
    expect(form.isValid()).toBeFalsy();

    await user.click(selectboxB);

    // All checkboxes are again marked as valid and without aria-describedby and aria-invalid
    await waitFor(() => {
      expect(selectboxA).not.toHaveClass('is-invalid');
    });
    expect(selectboxA).not.toHaveAttribute('aria-describedby');
    expect(selectboxA).not.toHaveAttribute('aria-invalid');
    expect(selectboxB).not.toHaveClass('is-invalid');
    expect(selectboxB).not.toHaveAttribute('aria-describedby');
    expect(selectboxB).not.toHaveAttribute('aria-invalid');
    expect(form.isValid()).toBeTruthy();
  });
});
