import {expect} from '@storybook/jest';
import {userEvent, within} from '@storybook/testing-library';

import {withUtrechtDocument} from 'story-utils/decorators';
import {sleep} from 'utils';

import {MultipleFormioComponents} from './story-util';

export default {
  title: 'Form.io components / Composite',
  decorators: [withUtrechtDocument],
  args: {
    components: [
      {
        type: 'textfield',
        key: 'textfield',
        label: 'Required text field',
        description: 'Text field description',
        validate: {
          required: true,
          pattern: '^\\d+',
        },
      },
      {
        type: 'radio',
        key: 'radio',
        label: 'Required radio',
        validate: {
          required: true,
        },
        values: [
          {value: 'a', label: 'Option A'},
          {value: 'b', label: 'Option B'},
        ],
      },
      {
        type: 'content',
        key: 'content',
        label: 'Content',
        html: '<p>Some WYSIWYG content</p>',
        customClass: 'info',
      },
      {
        type: 'fieldset',
        key: 'fieldset',
        label: 'Fieldset label',
        hideHeader: true,
        components: [
          {
            type: 'checkbox',
            key: 'checkbox',
            label: 'Checkbox',
          },
          {
            type: 'textfield',
            key: 'nestedTextfield',
            label: 'Nested text field',
          },
        ],
      },
      {
        type: 'textfield',
        key: 'hiddenTextfield',
        label: 'Hidden text field',
        hidden: true,
      },
      {
        label: 'Submit',
        showValidations: false,
        key: 'submit1',
        type: 'button',
        input: true,
      },
    ],
    evalContext: {},
  },
  argTypes: {
    components: {table: {disable: true}},
    evalContext: {table: {disable: true}},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

export const Pristine = {
  render: MultipleFormioComponents,

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(canvas.queryByText('Required text field')).toBeVisible();
    expect(canvas.queryByText('Hidden text field')).not.toBeInTheDocument();
  },
};

export const WithValidationErrors = {
  render: args => (
    <form onSubmit={e => e.preventDefault()}>
      <MultipleFormioComponents {...args} />
    </form>
  ),

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // just form.io things...
    await sleep(100);

    await userEvent.click(canvas.getByRole('button'));
  },
};
