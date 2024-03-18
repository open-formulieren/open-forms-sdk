import {expect} from '@storybook/test';
import {within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {AnalyticsToolsDecorator, withForm, withSubmissionPollInfo} from 'story-utils/decorators';

import {ConfirmationViewDisplay} from './ConfirmationView';

export default {
  title: 'Private API / Post completion views / Confirmation view',
  component: ConfirmationViewDisplay,
  decorators: [withForm, AnalyticsToolsDecorator, withSubmissionPollInfo, withRouter],
  argTypes: {
    paymentUrl: {control: false},
  },
  parameters: {
    reactRouter: {
      location: {state: {}},
    },
  },
};

export const WithoutPayment = {
  args: {
    paymentUrl: '',
    publicReference: 'OF-1234',
    reportDownloadUrl: '#',
    confirmationPageContent: 'Your answers are submitted. Hurray!',
    mainWebsiteUrl: '#',
    downloadPDFText: 'Download a PDF of your submitted answers',
  },
};

export const WithSuccessfulPayment = {
  args: {
    publicReference: 'OF-1234',
    reportDownloadUrl: '#',
    confirmationPageContent: 'Your answers are submitted. Hurray!',
    mainWebsiteUrl: '#',
    downloadPDFText: 'Download a PDF of your submitted answers',
  },
  parameters: {
    reactRouter: {
      location: {
        state: {
          status: 'completed',
          userAction: 'accept',
        },
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Bevestiging: OF-1234')).toBeVisible();
    expect(canvas.getByText('Uw betaling is ontvangen.')).toBeVisible();
  },
};

export const WithFailedPayment = {
  args: {
    publicReference: 'OF-1234',
    reportDownloadUrl: '#',
    confirmationPageContent: 'Your answers are submitted. Hurray!',
    mainWebsiteUrl: '#',
    downloadPDFText: 'Download a PDF of your submitted answers',
  },
  parameters: {
    reactRouter: {
      location: {
        state: {
          status: 'failed',
          userAction: 'exception',
        },
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Bevestiging: OF-1234')).toBeVisible();

    const errorNode = canvas.queryByText(/^De betaling is mislukt./i);
    expect(errorNode).not.toBeNull();
    expect(errorNode).toHaveClass('utrecht-alert__message');
  },
};

export const WithGovMetric = {
  name: 'With GovMetric',
  args: {
    paymentUrl: '',
    publicReference: 'OF-1234',
    reportDownloadUrl: '#',
    confirmationPageContent: 'Your answers are submitted. Hurray!',
    mainWebsiteUrl: '#',
    downloadPDFText: 'Download a PDF of your submitted answers',
    form: {
      slug: 'a-test-form',
    },
  },
  parameters: {
    analyticsToolsParams: {
      govmetricSourceId: '1234',
      govmetricSecureGuid: '',
      enableGovmetricAnalytics: true,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const feedbackLink = await canvas.findByRole('link', {name: 'Geef feedback'});
    await expect(feedbackLink).toBeVisible();
    await expect(feedbackLink.href).toEqual(
      'https://websurveys2.govmetric.com/theme/kf/1234?Q_Formid=a-test-form'
    );
  },
};
