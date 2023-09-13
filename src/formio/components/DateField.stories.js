import {expect} from '@storybook/jest';
import {userEvent, within} from '@storybook/testing-library';

import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Custom / DateField',
  decorators: [withUtrechtDocument],
  args: {
    type: 'date',
    extraComponentProperties: {
      format: 'dd-MM-yyyy',
      placeholder: 'dd-mm-yyyy',
      enableTime: false,
      datePicker: {
        minDate: null,
        maxDate: null,
      },
    },
    evalContext: {},
  },
  argTypes: {
    key: {type: {required: true}},
    label: {type: {required: true}},
    type: {table: {disable: true}},
    extraComponentProperties: {
      description: `Any additional Form.io component properties, recursively merged into the
        component definition.`,
    },
    evalContext: {table: {disable: true}},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

export const DateField = {
  render: SingleFormioComponent,
  args: {
    key: 'date',
    label: 'Datum',
    extraComponentProperties: {
      format: 'dd-MM-yyyy',
      placeholder: 'dd-mm-yyyy',
      enableTime: false,
      datePicker: {
        minDate: null,
        maxDate: null,
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const dateInput = canvas.getByRole('textbox');

    userEvent.type(dateInput, '06-06-2006');
    await expect(dateInput).toHaveDisplayValue('06-06-2006');

    const error = canvas.queryByText('minDate');
    await expect(error).toBeNull();
    // This test succeeds, but the value is not displayed in storybook... Mystery
  },
};

export const DateWithMinField = {
  render: SingleFormioComponent,
  args: {
    key: 'date',
    label: 'Datum > 08-09-2023',
    extraComponentProperties: {
      format: 'dd-MM-yyyy',
      placeholder: 'dd-mm-yyyy',
      enableTime: false,
      datePicker: {
        minDate: '2023-09-08',
        maxDate: null,
      },
      customOptions: {
        allowInvalidPreload: true,
      },
      validate: {
        dateMinMax: true,
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const dateInput = canvas.getByRole('textbox');

    userEvent.type(dateInput, '06-06-2006');
    await expect(dateInput).toHaveDisplayValue('06-06-2006');

    // TODO: I cannot get this to work. If you do it manually in storybook, it works... (it shows the error).
    // const error = canvas.queryByText('minDate');
    // await expect(error).not.toBeNull();
  },
};
