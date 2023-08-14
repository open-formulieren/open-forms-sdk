import {expect} from '@storybook/jest';
import {userEvent, waitFor, within} from '@storybook/testing-library';
import {getWorker} from 'msw-storybook-addon';
import {withRouter} from 'storybook-addon-react-router-v6';

import {mockStatementsConfigGet} from 'components/SummaryConfirmation/mocks';
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
    amountToPay: 54.05,
    showPreviousPageLink: true,
    isLoading: false,
    isAuthenticated: true,
    errors: [],
    submissionAllowed: SUBMISSION_ALLOWED.yes,
    editStepText: 'Change',
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

const worker = getWorker();

export const Default = {
  render: ({
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
    onSubmit,
    onLogout,
    onPrevPage,
    // story args
    showPreviousPageLink,
  }) => {
    worker.use(mockStatementsConfigGet());

    return (
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
        onSubmit={event => {
          event.preventDefault();
          onSubmit(event);
        }}
        onLogout={onLogout}
        onPrevPage={showPreviousPageLink ? onPrevPage : null}
      />
    );
  },
};

export const MultipleRequiredStatements = {
  render: ({
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
    onSubmit,
    onLogout,
    onPrevPage,
    // story args
    showPreviousPageLink,
  }) => {
    const multipleRequiredStatements = [
      {
        key: 'privacyPolicyAccepted',
        type: 'checkbox',
        validate: {required: true},
        label: 'I accept the privacy policy and consent to the processing of my personal data.',
      },
      {
        key: 'truthStatementAccepted',
        type: 'checkbox',
        validate: {required: true},
        label: 'I responded very honestly.',
      },
    ];
    worker.use(mockStatementsConfigGet(multipleRequiredStatements));

    return (
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
        onSubmit={event => {
          event.preventDefault();
          onSubmit(event);
        }}
        onLogout={onLogout}
        onPrevPage={showPreviousPageLink ? onPrevPage : null}
      />
    );
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Wait for the statements to load', async () => {
      await waitFor(
        async () =>
          await expect(
            await canvas.getByLabelText(
              /I accept the privacy policy and consent to the processing of my personal data/
            )
          )
      );
    });

    await step(
      'Verify that warnings appear if trying to submit without accepting statements',
      async () => {
        const submitButton = canvas.getByRole('button', {name: 'Confirm'});
        await waitFor(async () => {
          expect(submitButton).toHaveAttribute('aria-disabled', 'true');
        });

        // Clicking 'submit' without checking the statements results in all the warnings being
        // displayed
        await userEvent.click(submitButton);
        await waitFor(async () => {
          const warnings = canvas.queryAllByText(
            'Please check the above declaration before submitting'
          );
          expect(warnings).toHaveLength(2);
        });

        // Accepting the privacy policy makes one warning disappear
        const checkboxPrivacy = canvas.getByLabelText(
          /I accept the privacy policy and consent to the processing of my personal data/
        );
        await userEvent.click(checkboxPrivacy);
        await waitFor(async () => {
          const warnings = canvas.queryAllByText(
            'Please check the above declaration before submitting'
          );
          expect(warnings).toHaveLength(1);
        });

        // Accepting the truth declaration makes the second warning disappear and the 'submit'
        // button is no longer disabled
        const checkboxTruth = canvas.getByLabelText('I responded very honestly.');
        await userEvent.click(checkboxTruth);
        await waitFor(async () => {
          const warnings = canvas.queryAllByText(
            'Please check the above declaration before submitting'
          );
          expect(warnings).toHaveLength(0);
        });
        await waitFor(async () => {
          expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
        });
      }
    );
  },
};

export const OnlyOneRequiredStatement = {
  render: ({
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
    onSubmit,
    onLogout,
    onPrevPage,
    // story args
    showPreviousPageLink,
  }) => {
    const multipleRequiredStatements = [
      {
        key: 'privacyPolicyAccepted',
        type: 'checkbox',
        validate: {required: true},
        label: 'I accept the privacy policy and consent to the processing of my personal data.',
      },
      {
        key: 'truthStatementAccepted',
        type: 'checkbox',
        validate: {required: false},
        label: 'I responded very honestly.',
      },
    ];
    worker.use(mockStatementsConfigGet(multipleRequiredStatements));

    return (
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
        onSubmit={event => {
          event.preventDefault();
          onSubmit(event);
        }}
        onLogout={onLogout}
        onPrevPage={showPreviousPageLink ? onPrevPage : null}
      />
    );
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Wait for the statements to load', async () => {
      await waitFor(
        async () =>
          await expect(
            await canvas.getByLabelText(
              /I accept the privacy policy and consent to the processing of my personal data/
            )
          )
      );
    });

    await step('Verify that only one checkbox is visible', async () => {
      await waitFor(async () => {
        const checkboxTruth = canvas.queryByLabelText('I responded very honestly.');
        expect(checkboxTruth).toBeNull();
      });
    });
  },
};
