import {expect} from '@storybook/jest';
import {userEvent, waitFor, within} from '@storybook/testing-library';

import {withUtrechtDocument} from 'story-utils/decorators';
import {ConfigDecorator} from 'story-utils/decorators';
import {sleep} from 'utils';

import {
  mockBRKZaakgerechtigdeInvalidPost,
  mockBRKZaakgerechtigdeValidPost,
} from './AddressNL.mocks';
import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Custom / Address NL',
  decorators: [withUtrechtDocument, ConfigDecorator],
  args: {
    type: 'addressNL',
    key: 'addressNL',
    label: 'Address NL',
    extraComponentProperties: {
      validate: {
        required: true,
      },
    },
    evalContext: {},
  },
  argTypes: {
    key: {type: {required: true}},
    label: {type: {required: true}},
    type: {table: {disable: true}},
  },
};

export const Default = {
  render: SingleFormioComponent,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const postcodeInput = await canvas.findByRole('textbox', {name: 'Postcode'});
    userEvent.type(postcodeInput, '1234AB');

    const houseNumberInput = await canvas.findByRole('textbox', {name: 'Huis nummer'});
    userEvent.type(houseNumberInput, '1');
    userEvent.tab();

    // No errors if the two required fields are filled:
    let error = canvas.queryByText('Required');
    await expect(error).toBeNull();

    userEvent.clear(postcodeInput);
    await sleep(300);
    userEvent.tab();
    await sleep(300);

    // Error if postcode not filled:
    error = await canvas.findByText('Required');
    await expect(error).not.toBeNull();
  },
};

export const NotRequired = {
  args: {
    extraComponentProperties: {
      validate: {
        required: false,
      },
    },
  },
  render: SingleFormioComponent,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const postcodeInput = await canvas.findByRole('textbox', {name: 'Postcode'});
    await userEvent.type(postcodeInput, '1234AB');
    await userEvent.tab();
    await userEvent.tab();
    await sleep(300);

    let error = canvas.queryByText('You must provide a house number.');
    await expect(error).not.toBeNull();

    const houseNumberInput = await canvas.findByRole('textbox', {name: 'Huis nummer'});
    await userEvent.type(houseNumberInput, '1');
    await userEvent.clear(postcodeInput);
  },
};

export const WithBRKValidation = {
  render: SingleFormioComponent,
  parameters: {
    msw: {
      handlers: [mockBRKZaakgerechtigdeValidPost],
    },
  },
  args: {
    extraComponentProperties: {
      validate: {
        required: false,
        plugins: ['brk-Zaakgerechtigde'],
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const postcodeInput = await canvas.findByRole('textbox', {name: 'Postcode'});
    await userEvent.type(postcodeInput, '1234AB');

    const houseNumberInput = await canvas.findByRole('textbox', {name: 'Huis nummer'});
    await userEvent.type(houseNumberInput, '1');

    await sleep(300);
    await userEvent.tab();
    await sleep(300);

    await waitFor(async () => {
      expect(await canvas.queryByText('User is not a zaakgerechtigde for property.')).toBeNull();
    });
  },
};

export const WithFailedBRKValidation = {
  render: SingleFormioComponent,
  parameters: {
    msw: {
      handlers: [mockBRKZaakgerechtigdeInvalidPost],
    },
  },
  args: {
    extraComponentProperties: {
      validate: {
        required: false,
        plugins: ['brk-Zaakgerechtigde'],
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const postcodeInput = await canvas.findByRole('textbox', {name: 'Postcode'});
    await userEvent.type(postcodeInput, '1234AB');

    const houseNumberInput = await canvas.findByRole('textbox', {name: 'Huis nummer'});
    await userEvent.type(houseNumberInput, '1');

    await sleep(300);
    await userEvent.tab();
    await sleep(300);

    await waitFor(async () => {
      expect(await canvas.findByText('User is not a zaakgerechtigde for property.')).not.toBeNull();
    });
  },
};
