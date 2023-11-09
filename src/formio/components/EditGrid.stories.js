import {withUtrechtDocument} from 'story-utils/decorators';

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
