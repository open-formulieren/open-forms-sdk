import {expect, userEvent, waitFor, within} from '@storybook/test';

import {ConfigDecorator, withUtrechtDocument} from 'story-utils/decorators';
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
        expect(canvas.getByLabelText('Plaats')).toHaveDisplayValue('Amsterdam');
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
        expect(canvas.getByLabelText('Plaats')).toHaveDisplayValue('');
      });
    });

    await sleep(100);

    const saveButton = await canvas.findByRole('button', {name: 'Opslaan'});
    await userEvent.click(saveButton);
  },
};

export const WithLayoutComponents = {
  render,
  args: {
    key: 'editgrid',
    label: 'Nested layout components',
    extraComponentProperties: {
      hideLabel: false,
      components: [
        {
          type: 'textfield',
          key: 'text',
          label: 'A text field',
        },
        {
          type: 'content',
          key: 'test1',
          input: false,
          label: 'WYSIWYG content',
          html: '<p>Bonjour</p>',
        },
        {
          type: 'fieldset',
          key: 'level2Group',
          label: 'Nested fieldset',
          hideHeader: true,
          components: [
            {
              type: 'textfield',
              key: 'nestedText',
              label: 'Nested text',
            },
          ],
        },
        {
          type: 'columns',
          key: 'columns',
          label: 'Nested columns',
          columns: [
            {
              size: 6,
              components: [{type: 'number', key: 'number1', label: 'Number 1'}],
            },
            {
              size: 6,
              components: [{type: 'number', key: 'number2', label: 'Number 2'}],
            },
          ],
        },
      ],
      inlineEdit: false,
      disableAddingRemovingRows: false,
      addAnother: 'Nog één toevoegen',
      saveRow: 'Bevestigen',
      removeRow: 'Verwijderen',
    },

    data: [
      {
        text: 'Some text field value',
        nestedText: 'Nested text field value',
        number1: 42,
        number2: 420,
      },
    ],
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // we expect the input element labels and values to be displayed
    expect(await canvas.findByText('A text field')).toBeVisible();
    expect(await canvas.findByText('Some text field value')).toBeVisible();

    expect(await canvas.findByText('Nested text')).toBeVisible();
    expect(await canvas.findByText('Nested text field value')).toBeVisible();

    expect(await canvas.findByText('Number 1')).toBeVisible();
    expect(await canvas.findByText('42', {exact: true})).toBeVisible();

    expect(await canvas.findByText('Number 2')).toBeVisible();
    expect(await canvas.findByText('420', {exact: true})).toBeVisible();

    await step('Layout component labels not shown', () => {
      expect(canvas.queryByText('WYSIWYG content')).not.toBeInTheDocument();
      expect(canvas.queryByText('Nested fieldset')).not.toBeInTheDocument();
      expect(canvas.queryByText('Nested columns')).not.toBeInTheDocument();
    });
  },
};
