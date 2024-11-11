import {expect, jest} from '@storybook/jest';
import {userEvent, within} from '@storybook/test';

import {withUtrechtDocument} from 'story-utils/decorators';
import {sleep} from 'utils';

import {MultipleFormioComponents, SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Select',
  decorators: [withUtrechtDocument],
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

export const WithIntegerValues = {
  render: MultipleFormioComponents,
  args: {
    onSubmit: jest.fn(),
    components: [
      {
        type: 'select',
        key: 'selectWithInt',
        label: 'Select with integer values',
        data: {
          values: [
            {
              label: 'Optie 1',
              value: '1',
            },
            {
              label: 'Optie 2',
              value: '2',
            },
          ],
        },
        validate: {
          required: true,
        },
      },
      {
        label: 'Submit',
        showValidations: true,
        key: 'submit1',
        type: 'button',
        input: false,
        action: 'submit',
      },
    ],
  },

  play: async ({canvasElement, args}) => {
    args.onSubmit.mockClear();

    const canvas = within(canvasElement);
    const select = await canvas.findByLabelText('Select with integer values');
    await userEvent.click(select);

    const option = await canvas.findByText('Optie 1');
    await userEvent.click(option);

    await userEvent.click(canvas.getByText('Submit'));

    expect(args.onSubmit).toHaveBeenCalledTimes(1);
    const submittedData = args.onSubmit.mock.calls[0][0];
    expect(submittedData.data).toEqual({selectWithInt: '1'});
  },
};
