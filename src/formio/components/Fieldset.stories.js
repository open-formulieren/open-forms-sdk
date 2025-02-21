import {expect, within} from '@storybook/test';

import {withUtrechtDocument} from 'story-utils/decorators';
import {sleep} from 'utils';

import {MultipleFormioComponents, SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Fieldset',
  decorators: [withUtrechtDocument],
  args: {
    type: 'fieldset',
    extraComponentProperties: {
      components: [
        {
          key: 'given-name',
          type: 'textfield',
          input: true,
          label: 'Given name',
          description: 'Given name as in your passport/identity card.',
          placeholder: 'Ada',
        },
        {
          key: 'family-name',
          type: 'textfield',
          input: true,
          label: 'Given name',
          description: 'Family name as in your passport/identity card.',
          placeholder: 'Lovelace',
        },
        {
          key: 'AcceptPrivacyPolicy',
          type: 'checkbox',
          input: true,
          label: 'I have read and agree to the Privacy Policy',
          description: 'privacy-check',
          defaultValue: true,
        },
      ],
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

export const Fieldset = {
  render: ({hideHeader, ...args}) =>
    SingleFormioComponent({
      ...args,
      extraComponentProperties: {
        ...args.extraComponentProperties,
        hideHeader,
      },
    }),
  args: {
    key: 'fieldset',
    label: 'The group of fields',
    hideHeader: false,
  },
};

export const WithSoftRequiredComponent = {
  name: 'With soft required component',
  render: MultipleFormioComponents,
  args: {
    components: [
      {
        type: 'fieldset',
        key: 'fieldset',
        label: "Auto's",
        groupLabel: 'Auto',
        components: [
          {
            type: 'file',
            key: 'file',
            label: 'Soft required upload',
            openForms: {softRequired: true},
          },
        ],
      },

      {
        type: 'softRequiredErrors',
        html: `
        <p>Not all required fields are filled out. That can get expensive!</p>

        {{ missingFields }}

        <p>Are you sure you want to continue?</p>
          `,
      },
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // needed for formio
    await sleep(100);

    expect(await canvas.findByText("Auto's")).toBeVisible();

    await canvas.findByText('Not all required fields are filled out. That can get expensive!');
    const list = await canvas.findByRole('list', {name: 'Empty fields'});
    const listItem = within(list).getByRole('listitem');
    expect(listItem.textContent).toEqual('Soft required upload');
  },
};

export const WithSoftRequiredComponentHiddenParent = {
  name: 'With soft required component hidden parent',
  render: MultipleFormioComponents,
  args: {
    components: [
      {
        type: 'fieldset',
        key: 'fieldset',
        label: "Auto's",
        groupLabel: 'Auto',
        hidden: true,
        components: [
          {
            type: 'file',
            key: 'file',
            label: 'Soft required upload',
            openForms: {softRequired: true},
          },
        ],
      },

      {
        type: 'softRequiredErrors',
        html: `
        <p>Not all required fields are filled out. That can get expensive!</p>

        {{ missingFields }}

        <p>Are you sure you want to continue?</p>
          `,
      },
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // needed for formio
    await sleep(100);

    await expect(canvas.queryByText("Auto's")).not.toBeInTheDocument();
    await expect(
      canvas.queryByText('Not all required fields are filled out. That can get expensive!')
    ).not.toBeInTheDocument();
  },
};
