import {BASE_URL} from 'api-mocks';
import {
  mockSubmissionPaymentStartGet,
  mockSubmissionProcessingStatusGet,
} from 'api-mocks/submissions';
import {withSubmissionPollInfo} from 'story-utils/decorators';

import {StartPaymentViewDisplay} from './StartPaymentView';

export default {
  title: 'Private API / Post completion views / Start payment',
  component: StartPaymentViewDisplay,
  decorators: [withSubmissionPollInfo],
  args: {
    paymentUrl: `${BASE_URL}payment/4b0e86a8-dc5f-41cc-b812-c89857b9355b/demo/start`,
  },
  argTypes: {
    paymentUrl: {control: false},
  },
  parameters: {
    msw: {
      handlers: [mockSubmissionProcessingStatusGet, mockSubmissionPaymentStartGet],
    },
  },
};

export const Default = {
  args: {
    publicReference: 'OF-1234',
    reportDownloadUrl: '#',
    confirmationPageContent: 'This is some confirmation text.',
    mainWebsiteUrl: '#',
    downloadPDFText: 'Download a PDF of your submitted answers',
  },
};
