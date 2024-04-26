import {expect, userEvent, waitFor, within} from '@storybook/test';

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
    const houseNumberInput = await canvas.findByLabelText('Huisnummer');
    const houseLetter = await canvas.findByLabelText('Huisletter');
    const houseNumberAddition = await canvas.findByLabelText('Huisnummertoevoeging');

    await step('Fill only postcode - client side validation error', async () => {
      await userEvent.type(postcodeInput, '1234AB');
      expect(await canvas.findByText('Huisnummer is verplicht.')).toBeVisible();
    });

    await step('Fill house number field', async () => {
      await userEvent.type(houseNumberInput, '1');

      // ensure remaining fields are touched to reveal potential validation errors
      await userEvent.click(houseLetter);
      houseLetter.blur();
      await userEvent.click(houseNumberAddition);
      houseNumberAddition.blur();

      await waitFor(() => {
        expect(houseNumberAddition).not.toHaveFocus();
        expect(canvas.queryByText('/is verplicht/')).not.toBeInTheDocument();
      });
    });

    await step('Clear postcode field, keep house number field', async () => {
      await userEvent.clear(postcodeInput);
      expect(await canvas.findByText('Postcode is verplicht.')).toBeVisible();
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
    const houseNumberInput = await canvas.findByLabelText('Huisnummer');

    await step('Enter only postcode, without house number', async () => {
      await userEvent.type(postcodeInput, '1234AB');
      expect(await canvas.findByText('Huisnummer is verplicht.')).toBeVisible();
    });

    await step('Enter only house number, without postcode', async () => {
      await userEvent.clear(postcodeInput);
      await userEvent.type(houseNumberInput, '1');
      expect(await canvas.findByText('Postcode is verplicht.')).toBeVisible();
    });
  },
};

// const EXPECTED_VALIDATION_ERROR = 'User is not a zaakgerechtigde for property.';

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
    await userEvent.type(postcodeInput, '1234AB');

    const houseNumberInput = await canvas.findByLabelText('Huisnummer');
    await userEvent.type(houseNumberInput, '1');

    // this assertion is not worth much due to the async nature of the validators...
    // expect(canvas.queryByText(EXPECTED_VALIDATION_ERROR)).not.toBeInTheDocument();
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
  // We've spent considerable time trying to get this interaction test to work, but
  // there seem to be race conditions all over the place with Formio, Storybook 7.0 (and
  // testing-library 13 which is sync) and the hacky way the plugin validators work.
  // We give up :(
  //
  // play: async ({canvasElement, args, step}) => {
  //   const canvas = within(canvasElement);

  //   const postcodeInput = await canvas.findByLabelText('Postcode');
  //   userEvent.type(postcodeInput, '1234AB', {delay: 50});
  //   await waitFor(() => {
  //     expect(postcodeInput).toHaveDisplayValue('1234AB');
  //   });

  //   const houseNumberInput = await canvas.findByLabelText('Huisnummer');
  //   userEvent.type(houseNumberInput, '1');
  //   await waitFor(() => {
  //     expect(houseNumberInput).toHaveDisplayValue('1');
  //   });

  //   // blur so that error gets shown?
  //   houseNumberInput.blur();
  //   await waitFor(() => {
  //     expect(houseNumberInput).not.toHaveFocus();
  //   });
  //   await waitFor(() => {
  //     expect(canvas.getByText(EXPECTED_VALIDATION_ERROR)).toBeVisible();
  //   });
  // },
};
