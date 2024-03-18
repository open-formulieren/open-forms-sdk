import {expect} from '@storybook/test';
import {userEvent, within} from '@storybook/test';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import NumberField from './NumberField';

export default {
  title: 'Pure React Components / Forms / NumberField',
  component: NumberField,
  decorators: [FormikDecorator],
  parameters: {
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
    formik: {
      initialValues: {
        amount: '4',
      },
    },
  },
};

export const SmallNumbers = {
  name: 'Small numbers with incr/decr buttons',
  args: {
    name: 'amount',
    id: 'amount-type-number',
    label: 'Amount',
    description: 'HTML type=number, still allows typing invalid values.',
    useNumberType: true,
    disabled: false,
    isRequired: false,
    readOnly: false,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Amount');

    // assert that we can still type 'large' numbers
    await userEvent.clear(input);
    await userEvent.type(input, '1000');
    await expect(input).toHaveDisplayValue('1000');

    // assert that we can type floats without localisation
    await userEvent.clear(input);
    await userEvent.type(input, '1.5');
    await expect(input).toHaveDisplayValue('1.5');
  },
};

export const Default = {
  args: {
    name: 'amount',
    id: 'amount',
    label: 'Amount',
    description: 'This is a custom description for the amount field',
    disabled: false,
    isRequired: false,
    useNumberType: false,
    min: undefined,
    step: undefined,
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
    id: 'amount',
    label: 'Amount',
    description: 'This is a custom description for the amount field',
    disabled: false,
    isRequired: false,
    readOnly: true,
    useNumberType: false,
    min: undefined,
    step: undefined,
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
    id: 'amount',
    label: 'Amount',
    description: 'This is a custom description for the amount field',
    disabled: false,
    isRequired: true,
    readOnly: false,
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
    id: 'amount',
    label: 'Amount',
    description: 'This is a custom description for the amount field',
    disabled: false,
    isRequired: true,
    readOnly: false,
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
    disabled: false,
    isRequired: true,
    readOnly: false,
    useNumberType: false,
    min: undefined,
    step: undefined,
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
    useNumberType: false,
    disabled: false,
    isRequired: true,
    readOnly: false,
  },
};
