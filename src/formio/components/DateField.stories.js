import {expect, userEvent, within} from '@storybook/test';

import {withUtrechtDocument} from 'story-utils/decorators';
import {sleep} from 'utils';

import {SingleFormioComponent} from './story-util';

/**
 * Flatpickr/formio take some time to initialize, so wait until the DOM node is
 * injected into the document.
 *
 * We can't use `expect(...).toBeInTheDocument()` because we can't make a query
 * understood by testing-library, and passing DOM nodes (or null in this case) throws
 * errors that are not suppressed by waitFor
 */
const waitForFlatpickr = async node => {
  let calendarNode;
  for (let i = 0; i < 20; i++) {
    calendarNode = node.querySelector('.flatpickr-calendar');
    if (calendarNode !== null) return;
    await sleep(100);
  }
};

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
    await waitForFlatpickr(canvasElement);

    const dateInput = canvas.getByRole('textbox');

    await userEvent.type(dateInput, '06-06-2006');
    expect(dateInput).toHaveDisplayValue('06-06-2006');
    dateInput.blur();

    const error = canvas.queryByText('minDate');
    await expect(error).toBeNull();
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
    await waitForFlatpickr(canvasElement);

    const dateInput = canvas.getByRole('textbox');

    await userEvent.type(dateInput, '06-06-2006');
    expect(dateInput).toHaveDisplayValue('06-06-2006');
    dateInput.blur();

    expect(await canvas.findByText('minDate')).toBeVisible();
  },
};

export const DateWithMaxField = {
  render: SingleFormioComponent,
  args: {
    key: 'date',
    label: 'Datum <= 18-12-2023',
    extraComponentProperties: {
      format: 'dd-MM-yyyy',
      placeholder: 'dd-mm-yyyy',
      enableTime: false,
      datePicker: {
        minDate: null,
        maxDate: '2023-12-18T00:00:00+01:00',
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
    await waitForFlatpickr(canvasElement);

    const dateInput = canvas.getByRole('textbox');

    await userEvent.type(dateInput, '19-12-2023');
    expect(dateInput).toHaveDisplayValue('19-12-2023');
    dateInput.blur();

    expect(await canvas.findByText('maxDate')).toBeVisible();
  },
};
