import {withRouter} from 'storybook-addon-react-router-v6';

import {SUBMISSION_ALLOWED} from 'components/constants';
import {FormikDecorator, LiteralDecorator} from 'story-utils/decorators';

import GenericSummary from './GenericSummary';

export default {
  title: 'Private API / GenericSummary',
  component: GenericSummary,
  decorators: [FormikDecorator, LiteralDecorator, withRouter],
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
    privacyInformation: {
      requiresPrivacyConsent: true,
      privacyLabel: 'This is a privacy policy example.',
    },
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
    },
    reactRouter: {
      routePath: '/overzicht',
    },
  },
};

export const Default = {
  render: ({
    // component props
    title,
    submissionAllowed,
    summaryData,
    showPaymentInformation,
    amountToPay,
    privacyInformation,
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
        privacyInformation={privacyInformation}
      />
    );
  },
};
