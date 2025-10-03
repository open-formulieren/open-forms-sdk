import type {Meta, StoryObj} from '@storybook/react';
import {expect, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {withForm, withSubmissionPollInfo} from 'story-utils/decorators';

import {buildForm} from '@/api-mocks';
import type {Form} from '@/data/forms';

import {ConfirmationViewDisplay} from './ConfirmationView';

export type SubmissionPollInfoArgs = {
  publicReference: string;
  paymentUrl: string;
  reportDownloadUrl: string;
  confirmationPageTitle: string;
  confirmationPageContent: string;
  mainWebsiteUrl: string;
};

type FormArgs = {
  form?: Form;
};

export type Args = React.ComponentProps<typeof ConfirmationViewDisplay> &
  FormArgs &
  SubmissionPollInfoArgs;

export default {
  title: 'Views / Post completion views / Confirmation view',
  component: ConfirmationViewDisplay,
  decorators: [withForm, withSubmissionPollInfo, withRouter],
  argTypes: {
    paymentUrl: {control: false},
  },
  parameters: {
    reactRouter: {
      location: {state: {}},
    },
  },
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const WithoutPayment: Story = {
  args: {
    paymentUrl: '',
    publicReference: 'OF-1234',
    reportDownloadUrl: '#',
    confirmationPageContent: 'Your answers are submitted. Hurray!',
    mainWebsiteUrl: '#',
    downloadPDFText: 'Download a PDF of your submitted answers',
  },
};

export const WithSuccessfulPayment: Story = {
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
    expect(canvas.getByText('De betaling is ontvangen.')).toBeVisible();
  },
};

export const WithFailedPayment: Story = {
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

export const WithGovMetric: Story = {
  name: 'With GovMetric',
  args: {
    paymentUrl: '',
    publicReference: 'OF-1234',
    reportDownloadUrl: '#',
    confirmationPageContent: 'Your answers are submitted. Hurray!',
    mainWebsiteUrl: '#',
    downloadPDFText: 'Download a PDF of your submitted answers',
    form: buildForm({
      slug: 'a-test-form',
    }),
  },
  parameters: {
    analyticsToolsParams: {
      govmetricSourceIdFormFinished: '1234',
      govmetricSecureGuid: '',
      enableGovmetricAnalytics: true,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const lists = canvas.getAllByRole('list');
    const facesList = lists[0]; // The buttons toolbar is also a list

    const faces = within(facesList).getAllByRole<HTMLAnchorElement>('link');

    await expect(faces.length).toEqual(3);
    await expect(faces[0].href).toEqual(
      'https://websurveys2.govmetric.com/theme/kf/1234?Q_Formid=a-test-form&Q_RATINGID=3'
    );
  },
};
