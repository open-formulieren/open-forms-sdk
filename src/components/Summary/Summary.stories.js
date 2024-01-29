import {expect} from '@storybook/jest';
import {userEvent, within} from '@storybook/testing-library';
import cloneDeep from 'lodash/cloneDeep';
import {withRouter} from 'storybook-addon-react-router-v6';

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
    ],
    showPaymentInformation: true,
    showExtraToolbar: true,
    amountToPay: 54.05,
    showPreviousPageLink: true,
    isLoading: false,
    isAuthenticated: true,
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
      routePath: '/overzicht',
    },
  },
};

const render = ({
  // component props
  title,
  submissionAllowed,
  summaryData,
  showPaymentInformation,
  showExtraToolbar,
  amountToPay,
  editStepText,
  isLoading,
  isAuthenticated,
  errors,
  prevPage,
  onSubmit,
  onLogout,
  onPrevPage,
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
        showExtraToolbar={showExtraToolbar}
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
        onLogout={onLogout}
        onPrevPage={showPreviousPageLink ? onPrevPage : null}
      />
    </FormContext.Provider>
  );
};

export const Default = {
  render,
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

        // Clicking 'submit' without checking the statements results in all the warnings being
        // displayed
        await userEvent.click(submitButton);
        expect(
          await canvas.findByText('U moet akkoord gaan met het privacybeleid om door te gaan')
        ).toBeVisible();
        expect(
          await canvas.findByText(
            'U moet verklaren dat het formulier naar waarheid ingevuld is om door te gaan'
          )
        ).toBeVisible();

        // Accepting the privacy policy makes one warning disappear
        const checkboxPrivacy = canvas.getByLabelText(
          /I accept the privacy policy and consent to the processing of my personal data/
        );
        await userEvent.click(checkboxPrivacy);
        await canvas.findByText(
          'U moet verklaren dat het formulier naar waarheid ingevuld is om door te gaan'
        );
        expect(
          canvas.queryByText('U moet akkoord gaan met het privacybeleid om door te gaan')
        ).toBeNull();

        // Accepting the truth declaration makes the second warning disappear and the 'submit'
        // button is no longer disabled
        const checkboxTruth = canvas.getByLabelText('I responded very honestly.');
        await userEvent.click(checkboxTruth);
        expect(
          canvas.queryByText('U moet akkoord gaan met het privacybeleid om door te gaan')
        ).toBeNull();
        expect(
          canvas.queryByText('U moet akkoord gaan met het privacybeleid om door te gaan')
        ).toBeNull();

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
  play: async ({canvasElement, step}) => {
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
            },
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
    await expect(canvas.getByRole('definition')).toHaveTextContent('1234 AB 1A Add');
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
