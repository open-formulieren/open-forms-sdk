import {expect, userEvent, waitFor, within} from 'storybook/test';

import {sleep} from 'utils';

import {mockAddressAutoCompleteGet} from './TextField.mocks';
import {MultipleFormioComponents, SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / TextField',
  args: {
    type: 'textfield',
    extraComponentProperties: {},
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
    msw: {handlers: [mockAddressAutoCompleteGet('Keizersgracht', 'Amsterdam')]},
  },
};

export const TextField = {
  render: SingleFormioComponent,
  args: {
    key: 'textfield',
    label: 'Onderwerp',
  },
};

export const TextFieldsWithLocation = {
  render: MultipleFormioComponents,
  args: {
    components: [
      {
        type: 'textfield',
        key: 'postcode',
        label: 'Postcode',
        inputMask: '9999 AA',
      },
      {
        type: 'textfield',
        key: 'houseNumber',
        label: 'Number',
      },
      {
        type: 'textfield',
        key: 'streetname',
        label: 'Street',
        deriveStreetName: true,
        derivePostcode: 'postcode',
        deriveHouseNumber: 'houseNumber',
      },
      {
        type: 'textfield',
        key: 'streetname',
        label: 'City',
        deriveCity: true,
        derivePostcode: 'postcode',
        deriveHouseNumber: 'houseNumber',
      },
    ],
    evalContext: {},
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    // formio... :thisisfine:
    await sleep(100);

    await step('Fill out postcode and number', async () => {
      await userEvent.type(canvas.getByLabelText('Postcode'), '1015 CJ');
      await userEvent.type(canvas.getByLabelText('Number'), '117');
    });

    await step('Check that street and city are autofilled', async () => {
      await waitFor(async () => {
        expect(canvas.getByLabelText('Street')).toHaveDisplayValue('Keizersgracht');
      });
      await waitFor(async () => {
        expect(canvas.getByLabelText('City')).toHaveDisplayValue('Amsterdam');
      });
    });
  },
};

export const TextFieldsWithLocationInEditGrid = {
  render: SingleFormioComponent,
  args: {
    type: 'editgrid',
    key: 'addresses',
    label: 'Addresses',
    groupLabel: '',
    maxLength: null,
    extraComponentProperties: {
      hideLabel: false,
      components: [
        {
          type: 'textfield',
          key: 'postcode',
          label: 'Postcode',
          inputMask: '9999 AA',
        },
        {
          type: 'textfield',
          key: 'houseNumber',
          label: 'Number',
        },
        {
          type: 'textfield',
          key: 'streetname',
          label: 'Street',
          deriveStreetName: true,
          derivePostcode: 'postcode',
          deriveHouseNumber: 'houseNumber',
        },
        {
          type: 'textfield',
          key: 'streetname',
          label: 'City',
          deriveCity: true,
          derivePostcode: 'postcode',
          deriveHouseNumber: 'houseNumber',
        },
      ],
      inlineEdit: false,
      description: '',
      disableAddingRemovingRows: false,
      addAnother: 'Add another',
      saveRow: 'Confirm',
      removeRow: 'Delete',
    },
    evalContext: {},
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    // formio... :thisisfine:
    await sleep(200);

    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));

    await step('Fill out postcode and number', async () => {
      await userEvent.type(canvas.getByLabelText('Postcode'), '1015 CJ');
      await userEvent.type(canvas.getByLabelText('Number'), '117');
    });

    await step('Check that street and city are autofilled', async () => {
      await waitFor(async () => {
        expect(canvas.getByLabelText('Street')).toHaveDisplayValue('Keizersgracht');
      });
      await waitFor(async () => {
        expect(canvas.getByLabelText('City')).toHaveDisplayValue('Amsterdam');
      });
    });
  },
};
