import {withRouter} from 'storybook-addon-react-router-v6';

import {withSubmissionPollInfo} from 'story-utils/decorators';

import {ConfirmationViewDisplay} from './ConfirmationView';

export default {
  title: 'Private API / Post completion views / Confirmation view',
  component: ConfirmationViewDisplay,
  decorators: [withSubmissionPollInfo, withRouter],
  argTypes: {
    paymentUrl: {control: false},
  },
  parameters: {
    reactRouter: {
      routeState: {},
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

export const WithPayment = {
  args: {
    publicReference: 'OF-1234',
    reportDownloadUrl: '#',
    confirmationPageContent: 'Your answers are submitted. Hurray!',
    mainWebsiteUrl: '#',
    downloadPDFText: 'Download a PDF of your submitted answers',
  },
  parameters: {
    reactRouter: {
      routeState: {
        status: 'completed',
      },
    },
  },
};
