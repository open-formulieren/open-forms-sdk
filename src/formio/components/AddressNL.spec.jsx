import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {renderForm} from 'jstests/formio/utils';

const addressNLForm = {
  type: 'form',
  components: [
    {
      key: 'addressnl',
      type: 'addressNL',
      label: 'Address NL',
      validate: {
        required: true,
      },
    },
  ],
};

describe('The addressNL component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });
  test('Postcode provided and missing housenumber', async () => {
    const user = userEvent.setup({delay: 50});
    await renderForm(addressNLForm, {
      evalContext: {
        requiredFieldsWithAsterisk: true,
      },
    });
    const postcode = screen.getByLabelText('Postcode');
    const houseNumber = screen.getByLabelText('House number');

    await user.type(postcode, '1017 CJ');

    expect(houseNumber).toHaveClass('utrecht-textbox--invalid');
    expect(houseNumber).toHaveAttribute('aria-describedby');
    expect(houseNumber).toHaveAttribute('aria-invalid');
  });
  test('Postcode missing and housenumber provided', async () => {
    const user = userEvent.setup({delay: 50});
    await renderForm(addressNLForm, {
      evalContext: {
        requiredFieldsWithAsterisk: true,
      },
    });
    const postcode = screen.getByLabelText('Postcode');
    const houseNumber = screen.getByLabelText('House number');

    await user.type(houseNumber, '22');

    expect(postcode).toHaveClass('utrecht-textbox--invalid');
    expect(postcode).toHaveAttribute('aria-describedby');
    expect(postcode).toHaveAttribute('aria-invalid');
  });
});
