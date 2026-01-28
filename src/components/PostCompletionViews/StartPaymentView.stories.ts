import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, within} from 'storybook/test';

import {BASE_URL} from '@/api-mocks';
import {
  mockSubmissionPaymentStartPost,
  mockSubmissionProcessingStatusGet,
} from '@/api-mocks/submissions';
import {withSubmissionPollInfo} from '@/sb-decorators';
import type {SubmissionPollInfoArgs} from '@/sb-decorators';

import {StartPaymentViewDisplay} from './StartPaymentView';

type Args = React.ComponentProps<typeof StartPaymentViewDisplay> & SubmissionPollInfoArgs;

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
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    publicReference: 'OF-1234',
    reportDownloadUrl: '#',
    confirmationPageContent: 'This is some confirmation text.',
    mainWebsiteUrl: '#',
    downloadPDFText: 'Download a PDF of your submitted answers',
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const startPaymentButton = await canvas.findByRole('button', {name: 'Nu betalen'});
    expect(startPaymentButton).toBeVisible();
    expect(canvas.queryByRole('link', {name: 'Terug naar de website'})).not.toBeInTheDocument();
  },
};
