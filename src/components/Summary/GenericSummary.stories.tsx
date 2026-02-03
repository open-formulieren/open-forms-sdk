import type {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {buildForm} from '@/api-mocks';
import {
  PRIVACY_POLICY_ACCEPTED,
  STATEMENT_OF_TRUTH_ACCEPTED,
} from '@/components/SummaryConfirmation/mocks';
import {withForm, withLiterals} from '@/sb-decorators';

import GenericSummary from './GenericSummary';

export default {
  title: 'Private API / GenericSummary',
  component: GenericSummary,
  decorators: [withLiterals, withRouter, withForm],
  args: {
    title: 'Generic Summary',
    submissionAllowed: 'yes',
    summaryData: [
      {
        slug: 'uw-gegevens',
        name: 'Uw gegevens',
        data: [
          {
            name: '',
            value: 'In this section you can enter your personal details.',
            component: {
              id: 'content',
              type: 'content',
              key: 'content',
              html: '<i>In this section you can enter your personal details.</i>',
            },
          },
          {
            name: 'Voornaam',
            value: 'John',
            component: {
              id: 'voornaam',
              key: 'voornaam',
              type: 'textfield',
              label: 'Voornaam',
              hidden: false,
            },
          },
          {
            name: 'Achternaam',
            value: 'Doe',
            component: {
              id: 'achternaam',
              key: 'achternaam',
              type: 'textfield',
              label: 'Achternaam',
              hidden: false,
            },
          },
          {
            name: 'Email adres',
            value: 'john@test.nl',
            component: {
              id: 'emailAdres',
              key: 'emailAdres',
              type: 'email',
              label: 'Email adres',
              hidden: false,
            },
          },
        ],
      },
      {
        slug: 'uw-partner',
        name: 'Uw partner',
        data: [
          {
            name: 'Partner details',
            value: null,
            component: {
              id: 'fieldset1',
              type: 'fieldset',
              key: 'fieldset1',
              label: 'Partner details',
              hideHeader: false,
              components: [
                {
                  id: 'voornaam2',
                  key: 'voornaam2',
                  type: 'textfield',
                  label: 'Voornaam',
                  hidden: false,
                },
                {
                  id: 'achternaam2',
                  key: 'achternaam2',
                  type: 'textfield',
                  label: 'Achternaam',
                  hidden: false,
                },
                {
                  id: 'emailAdres2',
                  key: 'emailAdres2',
                  type: 'email',
                  label: 'Email adres',
                  hidden: false,
                },
              ],
            },
          },
          {
            name: 'Voornaam',
            value: 'Carl',
            component: {
              id: 'voornaam2',
              key: 'voornaam2',
              type: 'textfield',
              label: 'Voornaam',
              hidden: false,
            },
          },
          {
            name: 'Achternaam',
            value: 'Doe',
            component: {
              id: 'achternaam2',
              key: 'achternaam2',
              type: 'textfield',
              label: 'Achternaam',
              hidden: false,
            },
          },
          {
            name: 'Email adres',
            value: 'carl@test.nl',
            component: {
              id: 'emailAdres2',
              key: 'emailAdres2',
              type: 'email',
              label: 'Email adres',
              hidden: false,
            },
          },
        ],
      },
      {
        slug: 'uw-huisdier',
        name: 'Uw huisdier',
        data: [
          {
            name: '',
            value: null,
            component: {
              id: 'fieldset2',
              type: 'fieldset',
              key: 'fieldset2',
              label: 'Pet details',
              hideHeader: true,
              components: [
                {
                  id: 'huisdierNaam',
                  key: 'huisdierNaam',
                  type: 'textfield',
                  label: 'Huisdier naam',
                  hidden: false,
                },
              ],
            },
          },
          {
            name: 'Huisdier Naam',
            value: 'Nemo',
            component: {
              id: 'huisdierNaam',
              key: 'huisdierNaam',
              type: 'textfield',
              label: 'Huisdier naam',
              hidden: false,
            },
          },
        ],
      },
    ],
    isLoading: false,
    isAuthenticated: false,
    prevPage: 'some-previous-page',
    errors: [],
    onSubmit: fn(),
    onDestroySession: fn(),
    // payment information
    showPaymentInformation: true,
    amountToPay: 54.05,
    // editable steps or not
    blockEdit: false,
    editStepText: 'Change',
  },
  argTypes: {
    submissionAllowed: {
      options: ['yes', 'no_with_overview'],
      control: {
        type: 'radio',
        labels: {
          yes: 'Yes',
          no_with_overview: 'No, with overview',
        },
      },
    },
  },
  parameters: {
    reactRouter: {
      routing: '/overzicht',
    },
    formContext: {
      form: buildForm({
        submissionStatementsConfiguration: [PRIVACY_POLICY_ACCEPTED],
      }),
    },
  },
} satisfies Meta<typeof GenericSummary>;

type Story = StoryObj<typeof GenericSummary>;

export const Default: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const contentNodes = canvas.getAllByText<HTMLDivElement>((_, element) => {
      return element!.className.split(' ').includes('utrecht-data-list__item--openforms-content');
    });

    expect(contentNodes.length).toEqual(1);

    const contentNode = contentNodes[0];

    expect(contentNode.firstChild!.textContent).toEqual('');

    const fieldsetNodes = canvas.getAllByText((_, element) => {
      return element!.className.split(' ').includes('utrecht-data-list__item--openforms-fieldset');
    });

    // The fieldset with hidden label is not rendered
    expect(fieldsetNodes.length).toEqual(1);

    const fieldsetPartnerNode = fieldsetNodes[0];

    expect(fieldsetPartnerNode.firstChild!.textContent).toEqual('Partner details');

    const abortButton = await canvas.findByRole('button', {name: 'Annuleren'});
    expect(abortButton).toBeVisible();
  },
};

export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Uitloggen'});
    expect(abortButton).toBeVisible();
  },
};

export const MultipleRequiredStatements: Story = {
  parameters: {
    formContext: {
      form: {
        submissionStatementsConfiguration: [PRIVACY_POLICY_ACCEPTED, STATEMENT_OF_TRUTH_ACCEPTED],
      },
    },
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await canvas.findByLabelText(
      /I accept the privacy policy and consent to the processing of my personal data/
    );

    await step(
      'Verify that warnings appear if trying to submit without accepting statements',
      async () => {
        const submitButton = canvas.getByRole('button', {name: 'Confirm'});
        expect(submitButton).toHaveAttribute('aria-disabled', 'true');

        // Accepting the privacy policy makes one warning disappear
        const checkboxPrivacy = canvas.getByLabelText(
          /I accept the privacy policy and consent to the processing of my personal data/
        );
        await userEvent.click(checkboxPrivacy);

        // Accepting the truth declaration makes the second warning disappear and the 'submit'
        // button is no longer disabled
        const checkboxTruth = canvas.getByLabelText('I responded very honestly.');
        await userEvent.click(checkboxTruth);

        expect(submitButton).toHaveAttribute('aria-disabled', 'false');
      }
    );
  },
};

export const OnlyOneRequiredStatement: Story = {
  parameters: {
    formContext: {
      form: {
        submissionStatementsConfiguration: [PRIVACY_POLICY_ACCEPTED],
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await canvas.findByLabelText(
      /I accept the privacy policy and consent to the processing of my personal data/
    );

    const checkboxTruth = canvas.queryByLabelText('I responded very honestly.');
    expect(checkboxTruth).toBeNull();
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
  parameters: {
    // loader keeps spinning indefinitely
    chromatic: {disableSnapshot: true},
  },
};

export const AddressNLSummary: Story = {
  args: {
    summaryData: [
      {
        slug: 'address-nl',
        name: 'Address NL',
        data: [
          {
            name: 'Address NL',
            value: {postcode: '1234 AB', houseNumber: '1'},
            component: {
              id: 'addressNL',
              key: 'addressNL',
              type: 'addressNL',
              label: 'Address NL',
              hidden: false,
              deriveAddress: false,
              layout: 'singleColumn',
            },
          },
        ],
      },
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('definition')).toHaveTextContent('1234 AB 1');
  },
};

export const AddressNLSummaryWithoutCityFound: Story = {
  args: {
    summaryData: [
      {
        slug: 'address-nl',
        name: 'Address NL',
        data: [
          {
            name: 'Address NL',
            value: {postcode: '1234 AB', houseNumber: '1'},
            component: {
              id: 'addressNL',
              key: 'addressNL',
              type: 'addressNL',
              label: 'Address NL',
              hidden: false,
              deriveAddress: true,
              layout: 'singleColumn',
            },
          },
        ],
      },
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('definition')).toHaveTextContent('1234 AB 1');
  },
};

export const AddressNLSummaryFull: Story = {
  args: {
    summaryData: [
      {
        slug: 'address-nl',
        name: 'Address NL',
        data: [
          {
            name: 'Address NL',
            value: {
              postcode: '1234 AB',
              houseNumber: '1',
              houseLetter: 'A',
              houseNumberAddition: 'Add',
              city: 'Amsterdam',
              streetName: 'Keizersgracht',
            },
            component: {
              id: 'addressNL',
              key: 'addressNL',
              type: 'addressNL',
              label: 'Address NL',
              hidden: false,
              deriveAddress: true,
              layout: 'singleColumn',
            },
          },
        ],
      },
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('definition')).toHaveTextContent(
      'Keizersgracht 1A Add1234 AB Amsterdam'
    );
  },
};

export const AddressNLSummaryEmpty: Story = {
  args: {
    summaryData: [
      {
        slug: 'address-nl',
        name: 'Address NL',
        data: [
          {
            name: 'Address NL',
            value: {},
            component: {
              id: 'addressNL',
              key: 'addressNL',
              type: 'addressNL',
              label: 'Address NL',
              hidden: false,
              deriveAddress: false,
              layout: 'singleColumn',
            },
          },
        ],
      },
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('definition')).toHaveTextContent('');
  },
};

export const MapSummary: Story = {
  args: {
    summaryData: [
      {
        slug: 'maps',
        name: 'Maps',
        data: [
          {
            name: 'Map with default tile layer',
            value: {
              type: 'Point',
              coordinates: [5.291266, 52.1326332],
            },
            component: {
              id: 'map',
              key: 'map',
              type: 'map',
              label: 'Map with default tile layer',
            },
          },
          {
            name: 'Map with custom tile layer',
            value: {
              type: 'Point',
              coordinates: [5.291266, 52.1326332],
            },
            component: {
              id: 'map',
              key: 'map',
              type: 'map',
              label: 'Map with custom tile layer',
              tileLayerUrl:
                'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_orthoHR/EPSG:28992/{z}/{x}/{y}.png',
            },
          },
          {
            name: 'Map with overlays',
            value: {
              type: 'Point',
              coordinates: [5.215246, 52.136559],
            },
            component: {
              id: 'map',
              key: 'map',
              type: 'map',
              label: 'Map with overlay',
              overlays: [
                {
                  uuid: '931f18f0-cedc-453b-a2d5-a2c1ff9df523',
                  url: 'https://service.pdok.nl/lv/bag/wms/v2_0?request=getCapabilities&service=WMS',
                  label: 'BAG Pand and Verblijfsobject layer',
                  type: 'wms',
                  layers: ['pand', 'verblijfsobject'],
                },
              ],
            },
          },
          {
            name: 'Map with overlays and custom tile layer',
            value: {
              type: 'Point',
              coordinates: [5.215246, 52.136559],
            },
            component: {
              id: 'map',
              key: 'map',
              type: 'map',
              label: 'Map with overlay and custom tile layer',
              tileLayerUrl:
                'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_orthoHR/EPSG:28992/{z}/{x}/{y}.png',
              overlays: [
                {
                  uuid: '931f18f0-cedc-453b-a2d5-a2c1ff9df523',
                  url: 'https://service.pdok.nl/lv/bag/wms/v2_0?request=getCapabilities&service=WMS',
                  label: 'BAG Pand and Verblijfsobject layer',
                  type: 'wms',
                  layers: ['pand', 'verblijfsobject'],
                },
              ],
            },
          },
        ],
      },
    ],
  },
};
