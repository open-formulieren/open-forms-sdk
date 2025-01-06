import {expect, fn, userEvent, within} from '@storybook/test';
import cloneDeep from 'lodash/cloneDeep';
import {withRouter} from 'storybook-addon-remix-react-router';

import {FormContext} from 'Context';
import {buildForm} from 'api-mocks';
import {
  PRIVACY_POLICY_ACCEPTED,
  STATEMENT_OF_TRUTH_ACCEPTED,
} from 'components/SummaryConfirmation/mocks';
import {SUBMISSION_ALLOWED} from 'components/constants';
import {ConfigDecorator, FormikDecorator, LiteralDecorator} from 'story-utils/decorators';

import GenericSummary from './GenericSummary';

export default {
  title: 'Private API / GenericSummary',
  component: GenericSummary,
  decorators: [FormikDecorator, LiteralDecorator, withRouter, ConfigDecorator],
  args: {
    title: 'Generic Summary',
    summaryData: [
      {
        slug: 'uw-gegevens',
        name: 'Uw gegevens',
        data: [
          {
            name: '',
            value: 'In this section you can enter your personal details.',
            component: {
              type: 'content',
              label: 'Content',
              key: 'content',
              html: '<i>In this section you can enter your personal details.</i>',
            },
          },
          {
            name: 'Voornaam',
            value: 'John',
            component: {
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
              type: 'fieldset',
              key: 'fieldset1',
              label: 'Partner details',
              hideLabel: false,
              components: [
                {
                  key: 'voornaam2',
                  type: 'textfield',
                  label: 'Voornaam',
                  hidden: false,
                },
                {
                  key: 'achternaam2',
                  type: 'textfield',
                  label: 'Achternaam',
                  hidden: false,
                },
                {
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
              type: 'fieldset',
              key: 'fieldset2',
              label: 'Pet details',
              hideLabel: true,
              components: [
                {
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
              key: 'huisdierNaam',
              type: 'textfield',
              label: 'Huisdier naam',
              hidden: false,
            },
          },
        ],
      },
    ],
    showPaymentInformation: true,
    amountToPay: 54.05,
    showPreviousPageLink: true,
    isLoading: false,
    isAuthenticated: false,
    errors: [],
    submissionAllowed: SUBMISSION_ALLOWED.yes,
    editStepText: 'Change',
    prevPage: 'some-previous-page',
    // formContext args
    askPrivacyConsent: true,
    askStatementOfTruth: false,
    // LiteralDecorator args
    confirmText: 'Confirm',
    previousText: 'Previous',
    onSubmit: fn(),
    onDestroySession: fn(),
    onPrevPage: fn(),
  },
  argTypes: {
    submissionAllowed: {
      options: [SUBMISSION_ALLOWED.yes, SUBMISSION_ALLOWED.noWithOverview],
      control: {
        type: 'radio',
        labels: {
          [SUBMISSION_ALLOWED.yes]: 'Yes',
          [SUBMISSION_ALLOWED.noWithOverview]: 'No, with overview',
        },
      },
    },
  },
  parameters: {
    formik: {
      initialValues: {privacy: false},
      wrapForm: false,
    },
    reactRouter: {
      routing: '/overzicht',
    },
  },
};

const render = ({
  // component props
  title,
  submissionAllowed,
  summaryData,
  showPaymentInformation,
  amountToPay,
  editStepText,
  isLoading,
  isAuthenticated,
  errors,
  prevPage,
  onSubmit,
  onPrevPage,
  onDestroySession,
  // story args
  showPreviousPageLink,
  askPrivacyConsent,
  askStatementOfTruth,
}) => {
  const configuration = [];
  if (askPrivacyConsent !== null) {
    const privacyPolicyStatement = cloneDeep(PRIVACY_POLICY_ACCEPTED);
    privacyPolicyStatement.validate.required = askPrivacyConsent;
    configuration.push(privacyPolicyStatement);
  }
  if (askStatementOfTruth !== null) {
    const truthStatement = cloneDeep(STATEMENT_OF_TRUTH_ACCEPTED);
    truthStatement.validate.required = askStatementOfTruth;
    configuration.push(truthStatement);
  }
  const form = buildForm({submissionStatementsConfiguration: configuration});
  return (
    <FormContext.Provider value={form}>
      <GenericSummary
        title={title}
        submissionAllowed={submissionAllowed}
        summaryData={summaryData}
        showPaymentInformation={showPaymentInformation}
        amountToPay={amountToPay}
        editStepText={editStepText}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        errors={errors}
        prevPage={prevPage}
        onSubmit={event => {
          event.preventDefault();
          onSubmit(event);
        }}
        onPrevPage={showPreviousPageLink ? onPrevPage : null}
        onDestroySession={onDestroySession}
      />
    </FormContext.Provider>
  );
};

export const Default = {
  render,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const contentNodes = canvas.getAllByText((content, element) => {
      return element.className.split(' ').includes('utrecht-data-list__item--openforms-content');
    });

    await expect(contentNodes.length).toEqual(1);

    const contentNode = contentNodes[0];

    await expect(contentNode.firstChild.textContent).toEqual('');

    const fieldsetNodes = canvas.getAllByText((content, element) => {
      return element.className.split(' ').includes('utrecht-data-list__item--openforms-fieldset');
    });

    // The fieldset with hidden label is not rendered
    await expect(fieldsetNodes.length).toEqual(1);

    const fieldsetPartnerNode = fieldsetNodes[0];

    await expect(fieldsetPartnerNode.firstChild.textContent).toEqual('Partner details');

    const abortButton = await canvas.findByRole('button', {name: 'Annuleren'});
    await expect(abortButton).toBeVisible();
  },
};

export const Authenticated = {
  render,
  args: {
    isAuthenticated: true,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Uitloggen'});
    await expect(abortButton).toBeVisible();
  },
};

export const MultipleRequiredStatements = {
  render,
  args: {
    askPrivacyConsent: true,
    askStatementOfTruth: true,
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

export const OnlyOneRequiredStatement = {
  render,
  args: {
    askPrivacyConsent: true,
    askStatementOfTruth: false,
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

export const Loading = {
  render,
  parameters: {
    // loader keeps spinning indefinitely
    chromatic: {disableSnapshot: true},
  },
  args: {
    isLoading: true,
  },
};

export const AddressNLSummary = {
  render,
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
              key: 'addressNL',
              type: 'addressNL',
              label: 'Address NL',
              hidden: false,
            },
          },
        ],
      },
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('definition')).toHaveTextContent('1234 AB 1');
  },
};

export const AddressNLSummaryWithoutCityFound = {
  render,
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
              key: 'addressNL',
              type: 'addressNL',
              label: 'Address NL',
              hidden: false,
              deriveAddress: true,
            },
          },
        ],
      },
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('definition')).toHaveTextContent('1234 AB 1');
  },
};

export const AddressNLSummaryFull = {
  render,
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
              key: 'addressNL',
              type: 'addressNL',
              label: 'Address NL',
              hidden: false,
              deriveAddress: true,
            },
          },
        ],
      },
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('definition')).toHaveTextContent(
      'Keizersgracht 1A Add1234 AB Amsterdam'
    );
  },
};

export const AddressNLSummaryEmpty = {
  render,
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
              key: 'addressNL',
              type: 'addressNL',
              label: 'Address NL',
              hidden: false,
            },
          },
        ],
      },
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('definition')).toHaveTextContent('');
  },
};

export const MapSummary = {
  render,
  args: {
    summaryData: [
      {
        slug: 'maps',
        name: 'Maps',
        data: [
          {
            name: 'Map with default tile layer',
            value: [52.1326332, 5.291266],
            component: {
              key: 'map',
              type: 'map',
              label: 'Map with default tile layer',
            },
          },
          {
            name: 'Map with custom tile layer',
            value: [52.1326332, 5.291266],
            component: {
              key: 'map',
              type: 'map',
              label: 'Map with custom tile layer',
              tileLayerUrl:
                'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_orthoHR/EPSG:28992/{z}/{x}/{y}.png',
            },
          },
        ],
      },
    ],
  },
};
