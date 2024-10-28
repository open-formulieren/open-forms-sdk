import {expect, userEvent, waitFor, within} from '@storybook/test';

import {withUtrechtDocument} from 'story-utils/decorators';
import {sleep} from 'utils';

import {UPLOAD_URL, mockFileUploadDelete, mockFileUploadPost} from './FileField.mocks';
import {MultipleFormioComponents} from './story-util';

export default {
  title: 'Form.io components / Custom / SoftRequiredErrors',
  decorators: [withUtrechtDocument],
  render: MultipleFormioComponents,
  args: {
    components: [
      {
        type: 'file',
        key: 'file',
        storage: 'url',
        url: UPLOAD_URL,
        label: 'Soft required file',
        multiple: false,
        openForms: {softRequired: true},
      },
      {
        type: 'textfield',
        key: 'textfield',
        label: 'Soft required text',
        openForms: {softRequired: true},
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

  argTypes: {
    components: {table: {disable: true}},
    evalContext: {table: {disable: true}},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
    msw: {
      handlers: [mockFileUploadPost, mockFileUploadDelete],
    },
  },
};

export const EmptyFields = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Not all required fields are filled out. That can get expensive!');
    const list = await canvas.findByRole('list', {name: 'Empty fields'});
    const listItems = within(list).getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    const content = listItems.map(item => item.textContent);
    expect(content).toEqual(['Soft required file', 'Soft required text']);
  },
};

export const FillField = {
  args: {
    components: [
      {
        type: 'textfield',
        key: 'textfield',
        label: 'Soft required text',
        openForms: {softRequired: true},
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
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    // formio... :thisisfine:
    await sleep(100);

    const ERROR_TEXT = 'Not all required fields are filled out. That can get expensive!';

    await step('Initial state', async () => {
      expect(await canvas.findByText(ERROR_TEXT)).toBeVisible();
      const list = await canvas.findByRole('list', {name: 'Empty fields'});
      const listItems = within(list).getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
    });

    await step('Fill out field and remove error', async () => {
      const input = canvas.getByLabelText('Soft required text');
      await userEvent.type(input, 'Not empty');
      await waitFor(() => {
        expect(canvas.queryByText(ERROR_TEXT)).toBeNull();
      });
    });
  },
};
