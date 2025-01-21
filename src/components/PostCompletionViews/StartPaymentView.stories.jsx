import {expect, waitFor, within} from '@storybook/test';

import {BASE_URL} from 'api-mocks';
import {
  mockSubmissionPaymentStartPost,
  mockSubmissionProcessingStatusGet,
} from 'api-mocks/submissions';
import {withSubmissionPollInfo} from 'story-utils/decorators';

import {StartPaymentViewDisplay} from './StartPaymentView';

export default {
  title: 'Views / Post completion views / Start payment',
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
      handlers: [mockSubmissionProcessingStatusGet, mockSubmissionPaymentStartPost()],
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
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await waitFor(
      async () => {
        expect(
          canvas.queryByRole('button', {name: 'Terug naar de website'})
        ).not.toBeInTheDocument();
      },
      {
        timeout: 2000,
        interval: 100,
      }
    );
  },
};
