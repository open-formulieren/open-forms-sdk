import {userEvent, within} from '@storybook/test';

import {sleep} from 'utils';

import {MultipleFormioComponents, SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Select',
  args: {
    type: 'select',
    extraComponentProperties: {
      data: {
        values: [
          {
            label: 'Optie A',
            value: 'radioA',
          },
          {
            label: 'Optie B',
            value: 'radioB',
          },
          {
            label: 'Optie C',
            value: 'radioC',
          },
        ],
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

export const Select = {
  render: SingleFormioComponent,
  args: {
    key: 'select',
    label: 'Welke optie is het meest onduidelijk?',
  },
};

export const RequiredWithValidationError = {
  render: MultipleFormioComponents,
  args: {
    components: [
      {
        type: 'select',
        key: 'selectRequired',
        label: 'Required select',
        data: {
          values: [
            {
              label: 'Optie A',
              value: 'radioA',
            },
            {
              label: 'Optie B',
              value: 'radioB',
            },
            {
              label: 'Optie C',
              value: 'radioC',
            },
          ],
        },
        validate: {
          required: true,
        },
      },
      {
        label: 'Check validations',
        showValidations: true,
        key: 'submit1',
        type: 'button',
        input: true,
        action: 'notSubmit',
      },
    ],
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // just form.io things...
    await sleep(100);

    await userEvent.click(canvas.getByRole('button'));
  },
};

export const MultilineOptions = {
  render: SingleFormioComponent,
  args: {
    type: 'select',
    key: 'select',
    extraComponentProperties: {
      data: {
        values: [
          {
            label: 'A really really really really really long label for the first option A',
            value: 'radioA',
          },
          {
            label: 'Another really really really really really long label for option B',
            value: 'radioB',
          },
          {
            label: 'ThisIsAStringWithoutAnyWhitespacesButItShouldBeSplitAnyway',
            value: 'radioC',
          },
        ],
      },
      multiple: true,
    },
    submissionData: {
      select: ['radioA', 'radioB', 'radioC'],
    },
  },
};
