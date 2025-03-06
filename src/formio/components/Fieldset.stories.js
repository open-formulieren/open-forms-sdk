import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Fieldset',
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
