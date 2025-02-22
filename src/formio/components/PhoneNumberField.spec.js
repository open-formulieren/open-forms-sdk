import {screen, waitFor} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {renderForm} from 'jstests/formio/utils';

const phoneForm = {
  type: 'form',
  components: [
    {
      key: 'phoneNumber',
      type: 'phoneNumber',
      input: true,
      label: 'Phone number',
      inputMask: null,
    },
  ],
};

describe('The phone number component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it.each([['+31612345678'], ['0031612345678'], ['01612345678'], ['1234']])(
    'accepts numbers and + as first character (value: %i)',
    async value => {
      const user = userEvent.setup({delay: 50});
      const {form} = await renderForm(phoneForm, {
        evalContext: {
          requiredFieldsWithAsterisk: true,
        },
      });

      const input = screen.getByLabelText('Phone number');
      expect(input).toBeVisible();
      await user.type(input, value);
      expect(input).toHaveDisplayValue(value);

      const component = form.getComponent('phoneNumber');
      expect(component.getValue()).toBe(value);
      expect(form.isValid()).toBe(true);
    }
  );

  it.each([['-31612345678'], ['(06)12345678'], [' 01612345678'], ['$1234']])(
    'only allows numbers and + as first character (value: %i)',
    async value => {
      const user = userEvent.setup({delay: 50});
      const {form} = await renderForm(phoneForm, {
        evalContext: {
          requiredFieldsWithAsterisk: true,
        },
      });

      const input = screen.getByLabelText('Phone number');
      expect(input).toBeVisible();
      await user.type(input, value);
      expect(input).toHaveDisplayValue(value);

      const component = form.getComponent('phoneNumber');
      expect(component.getValue()).toBe(value);
      await waitFor(() => {
        expect(form.isValid()).toBe(false);
      });
      expect(await screen.findByText('Invalid Phone Number')).toBeVisible();
    }
  );

  it.each([
    ['+316 123 456 78'],
    ['06-12 34 56 78'],
    ['06-12-34-56 78'], // weird but ok
  ])('allows dashes and spaces for formatting (value: %i)', async value => {
    const user = userEvent.setup({delay: 50});
    const {form} = await renderForm(phoneForm, {
      evalContext: {
        requiredFieldsWithAsterisk: true,
      },
    });

    const input = screen.getByLabelText('Phone number');
    expect(input).toBeVisible();
    await user.type(input, value);
    expect(input).toHaveDisplayValue(value);

    const component = form.getComponent('phoneNumber');
    expect(component.getValue()).toBe(value);
    expect(form.isValid()).toBe(true);
  });
});
