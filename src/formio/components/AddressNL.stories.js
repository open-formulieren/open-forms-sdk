import {expect} from '@storybook/jest';
import {userEvent, waitFor, within} from '@storybook/testing-library';

import {withUtrechtDocument} from 'story-utils/decorators';
import {ConfigDecorator} from 'story-utils/decorators';

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

export const Pristine = {
  render: SingleFormioComponent,
};

export const ClientSideValidation = {
  render: SingleFormioComponent,
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const postcodeInput = await canvas.findByLabelText('Postcode');
    const houseNumberInput = await canvas.findByLabelText('Huis nummer');
    const houseLetter = await canvas.findByLabelText('Huis letter');
    const houseNumberAddition = await canvas.findByLabelText('Huis nummer toevoeging');

    await step('Fill only postcode - client side validation error', async () => {
      userEvent.type(postcodeInput, '1234AB');
      expect(await canvas.findByText('Required')).toBeVisible();
    });

    await step('Fill house number field', async () => {
      userEvent.type(houseNumberInput, '1');

      // ensure remaining fields are touched to reveal potential validation errors
      userEvent.click(houseLetter);
      houseLetter.blur();
      userEvent.click(houseNumberAddition);
      houseNumberAddition.blur();

      await waitFor(() => {
        expect(houseNumberAddition).not.toHaveFocus();
        expect(canvas.queryByText('Required')).not.toBeInTheDocument();
      });
    });

    await step('Clear postcode field, keep house number field', async () => {
      userEvent.clear(postcodeInput);
      expect(await canvas.findByText('Required')).toBeVisible();
    });
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
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const postcodeInput = await canvas.findByLabelText('Postcode');
    const houseNumberInput = await canvas.findByLabelText('Huis nummer');

    await step('Enter only postcode, without house number', async () => {
      userEvent.type(postcodeInput, '1234AB');
      expect(await canvas.findByText('You must provide a house number.')).toBeVisible();
    });

    await step('Enter only house number, without postcode', async () => {
      userEvent.clear(postcodeInput);
      userEvent.type(houseNumberInput, '1');
      expect(await canvas.findByText('You must provide a postcode.')).toBeVisible();
    });
  },
};

const EXPECTED_VALIDATION_ERROR = 'User is not a zaakgerechtigde for property.';

export const WithPassingBRKValidation = {
  render: SingleFormioComponent,
  parameters: {
    msw: {
      handlers: [mockBRKZaakgerechtigdeValidPost],
    },
  },
  args: {
    type: 'addressNL',
    key: 'addressNL',
    label: 'Address NL',
    extraComponentProperties: {
      validate: {
        required: false,
        plugins: ['brk-Zaakgerechtigde'],
      },
    },
  },
  play: async ({canvasElement, args, step}) => {
    const canvas = within(canvasElement);

    const postcodeInput = await canvas.findByLabelText('Postcode');
    userEvent.type(postcodeInput, '1234AB');

    const houseNumberInput = await canvas.findByLabelText('Huis nummer');
    userEvent.type(houseNumberInput, '1');

    // this assertion is not worth much due to the async nature of the validators...
    expect(canvas.queryByText(EXPECTED_VALIDATION_ERROR)).not.toBeInTheDocument();
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
    type: 'addressNL',
    key: 'addressNL',
    label: 'Address NL',
    extraComponentProperties: {
      validate: {
        required: false,
        plugins: ['brk-Zaakgerechtigde'],
      },
    },
  },
  play: async ({canvasElement, args, step}) => {
    const canvas = within(canvasElement);

    const postcodeInput = await canvas.findByLabelText('Postcode');
    userEvent.type(postcodeInput, '1234AB');

    const houseNumberInput = await canvas.findByLabelText('Huis nummer');
    userEvent.type(houseNumberInput, '1');
    houseNumberInput.blur();
    expect(await canvas.findByText(EXPECTED_VALIDATION_ERROR)).toBeVisible();
  },
};
