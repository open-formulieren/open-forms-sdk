import {NumberField} from '@open-formulieren/formio-renderer';
import {expect, userEvent, within} from '@storybook/test';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

export default {
  title: 'Pure React Components / Forms / NumberField',
  component: NumberField,
  decorators: [FormikDecorator],
  parameters: {
    formik: {
      initialValues: {
        amount: 4,
      },
    },
  },
};

export const Default = {
  args: {
    name: 'amount',
    label: 'Amount',
    description: 'This is a custom description for the amount field',
    isRequired: false,
  },
  parameters: {
    formik: {
      initialValues: {amount: ''},
    },
  },
};

export const ReadOnly = {
  args: {
    name: 'amount',
    label: 'Amount',
    description: 'This is a custom description for the amount field',
    isRequired: false,
    isReadonly: true,
  },
  parameters: {
    formik: {
      initialValues: {amount: ''},
    },
  },
};

export const LocalisedWithDecimals = {
  name: 'Small localised numbers with decimals',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Amount');

    // Assert that you're not able to type letters
    await userEvent.click(input);
    await userEvent.type(input, 'abc');
    await expect(input).toHaveDisplayValue('4');
    // Assert that clicking on the label focuses the input
    const label = canvas.getByText('Amount');
    await userEvent.click(label);
    await expect(canvas.getByRole('textbox')).toHaveFocus();

    // Assert that you're able to provide a negative number
    await userEvent.clear(input);
    await userEvent.type(input, '-1');
    await expect(input).toHaveDisplayValue('-1');

    // Assert that you're able to provide a decimal number
    await userEvent.clear(input);
    await userEvent.type(input, '1.5');
    await expect(input).toHaveDisplayValue('1,5');

    // Assert that you're able to provide a decimal number with comma
    await userEvent.clear(input);
    await userEvent.type(input, '-2,3');
    await expect(input).toHaveDisplayValue('-2,3');
  },
  args: {
    name: 'amount',
    label: 'Amount',
    description: 'This is a custom description for the amount field',
    isRequired: true,
    isReadonly: false,
    allowNegative: true,
  },
};

export const LocalisedWithThousandSeparator = {
  name: 'Large localised numbers with thousand separator',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Amount');

    // Assert that you're not able to type letters
    await userEvent.click(input);
    await userEvent.type(input, 'abc');
    await expect(input).toHaveDisplayValue('4');

    // Assert that you're able to provide a large number, formatted with thousand separator
    await userEvent.clear(input);
    await userEvent.type(input, '10000');
    await expect(input).toHaveDisplayValue('10.000');
  },
  args: {
    name: 'amount',
    label: 'Amount',
    description: 'This is a custom description for the amount field',
    isRequired: true,
    isReadonly: false,
    useThousandSeparator: true,
  },
};

export const ValidationError = {
  name: 'Validation error',
  parameters: {
    formik: {
      initialValues: {
        amount: 42,
      },
      initialErrors: {
        amount: 'invalid',
      },
      initialTouched: {
        amount: true,
      },
    },
  },
  args: {
    name: 'amount',
    label: 'Amount',
    description: 'Description above the errors',
    isRequired: true,
    isReadonly: false,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('invalid')).toBeVisible();
  },
};

export const NoAsterisks = {
  name: 'No asterisk for required',
  decorators: [ConfigDecorator],
  parameters: {
    config: {
      requiredFieldsWithAsterisk: false,
    },
  },
  args: {
    name: 'amount',
    label: 'Default required',
    isRequired: true,
    isReadonly: false,
  },
};
