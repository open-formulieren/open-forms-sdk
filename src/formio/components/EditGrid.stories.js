import {expect, userEvent, waitFor, within} from '@storybook/test';

import {withUtrechtDocument} from 'story-utils/decorators';
import {ConfigDecorator} from 'story-utils/decorators';
import {sleep} from 'utils';

import {mockBAGDataGet, mockBAGNoDataGet} from './AddressNL.mocks';
import {SingleFormioComponent} from './story-util';

const defaultNested = [
  {
    key: 'kleur',
    type: 'textfield',
    input: true,
    label: 'Kleur',
    registration: {
      attribute: '',
    },
    showInSummary: true,
    isSensitiveData: false,
    deriveStreetName: false,
  },
  {
    key: 'bedrag',
    type: 'currency',
    input: true,
    label: 'Waarde',
    currency: 'EUR',
    delimiter: true,
    allowNegative: false,
  },
  {
    key: 'content',
    html: '<p>This is some nice content without a label</p>',
    type: 'content',
    input: false,
    label: '',
    tableView: false,
  },
];

export default {
  title: 'Form.io components / Vanilla / EditGrid (Repeating group)',
  decorators: [withUtrechtDocument],
  args: {
    type: 'editgrid',
    groupLabel: '',
    maxLength: null,
    extraComponentProperties: {
      hideLabel: false,
      components: defaultNested,
      inlineEdit: false,
      description: 'Herhalende groep voor data',
      disableAddingRemovingRows: false,
      addAnother: 'Nog één toevoegen',
      saveRow: 'Bevestigen',
      removeRow: 'Verwijderen',
    },
    evalContext: {},
  },
  argTypes: {
    key: {type: {required: true}},
    label: {type: {required: true}},
    maxLength: {
      type: {name: 'number', required: false},
    },
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

const render = ({
  key: formioKey,
  groupLabel,
  maxLength,
  extraComponentProperties = {},
  data = [],
  ...args
}) => (
  <SingleFormioComponent
    formioKey={formioKey}
    {...args}
    extraComponentProperties={{
      ...extraComponentProperties,
      groupLabel,
      validate: {maxLength},
    }}
    submissionData={{[formioKey]: data}}
  />
);

export const Default = {
  render,
  args: {
    key: 'editgrid',
    label: "Auto's",
    groupLabel: 'Auto',
  },
};

export const WithData = {
  name: 'With data',
  render,
  args: {
    key: 'editgrid',
    label: "Auto's",
    groupLabel: 'Auto',
    data: [
      {
        kleur: 'Red',
        bedrag: '15000000',
      },
    ],
  },
};

export const AddressNLWithData = {
  render: SingleFormioComponent,
  decorators: [ConfigDecorator],
  parameters: {
    msw: {
      handlers: [mockBAGDataGet],
    },
  },
  args: {
    type: 'editgrid',
    groupLabel: '',
    maxLength: null,
    extraComponentProperties: {
      hideLabel: false,
      components: [
        {
          type: 'addressNL',
          key: 'addressNL',
          label: 'Address NL',
          validate: {
            required: false,
          },
          deriveAddress: true,
        },
      ],
      inlineEdit: false,
      description: 'Repeating group for Address NL component',
      disableAddingRemovingRows: false,
      addAnother: 'Nog één toevoegen',
      saveRow: 'Opslaan',
      removeRow: 'Annuleren',
    },
    evalContext: {},
  },
  argTypes: {
    key: {type: {required: true}},
    label: {type: {required: true}},
    type: {table: {disable: true}},
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // needed for formio
    await sleep(100);

    const addButton = await canvas.findByRole('button', {name: 'Nog één toevoegen'});
    await userEvent.click(addButton);

    await step('Fill out postcode and number', async () => {
      const postcodeInput = await canvas.findByLabelText('Postcode');
      await userEvent.type(postcodeInput, '1234AB');
      const houseNumberInput = await canvas.findByLabelText('Huisnummer');
      await userEvent.type(houseNumberInput, '1');
    });

    userEvent.tab();

    await step('Check that street and city are autofilled', async () => {
      await waitFor(async () => {
        expect(canvas.getByLabelText('Straatnaam')).toHaveDisplayValue('Keizersgracht');
      });
      await waitFor(async () => {
        expect(canvas.getByLabelText('Stad')).toHaveDisplayValue('Amsterdam');
      });
    });

    await sleep(100);

    const saveButton = await canvas.findByRole('button', {name: 'Opslaan'});
    await userEvent.click(saveButton);
  },
};

export const AddressNLWithNoData = {
  render: SingleFormioComponent,
  decorators: [ConfigDecorator],
  parameters: {
    msw: {
      handlers: [mockBAGNoDataGet],
    },
  },
  args: {
    type: 'editgrid',
    groupLabel: '',
    maxLength: null,
    extraComponentProperties: {
      hideLabel: false,
      components: [
        {
          type: 'addressNL',
          key: 'addressNL',
          label: 'Address NL',
          validate: {
            required: false,
          },
          deriveAddress: true,
        },
      ],
      inlineEdit: false,
      description: 'Repeating group for Address NL component',
      disableAddingRemovingRows: false,
      addAnother: 'Nog één toevoegen',
      saveRow: 'Opslaan',
      removeRow: 'Annuleren',
    },
    evalContext: {},
  },
  argTypes: {
    key: {type: {required: true}},
    label: {type: {required: true}},
    type: {table: {disable: true}},
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // needed for formio
    await sleep(100);

    const addButton = await canvas.findByRole('button', {name: 'Nog één toevoegen'});
    await userEvent.click(addButton);

    await step('Fill out postcode and number', async () => {
      const postcodeInput = await canvas.findByLabelText('Postcode');
      await userEvent.type(postcodeInput, '1234AB');
      const houseNumberInput = await canvas.findByLabelText('Huisnummer');
      await userEvent.type(houseNumberInput, '1');
    });

    userEvent.tab();

    await step('Check that no street and city are present', async () => {
      await waitFor(async () => {
        expect(canvas.getByLabelText('Straatnaam')).toHaveDisplayValue('');
      });
      await waitFor(async () => {
        expect(canvas.getByLabelText('Stad')).toHaveDisplayValue('');
      });
    });

    await sleep(100);

    const saveButton = await canvas.findByRole('button', {name: 'Opslaan'});
    await userEvent.click(saveButton);
  },
};
