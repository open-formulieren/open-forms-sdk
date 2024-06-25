import {expect, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {AnalyticsToolsDecorator, withForm, withSubmissionPollInfo} from 'story-utils/decorators';

import {mockExpointsGetLoaderScript} from '../analytics/mocks';
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
      govmetricSourceIdFormFinished: '1234',
      govmetricSecureGuid: '',
      enableGovmetricAnalytics: true,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const lists = await canvas.getAllByRole('list');
    const facesList = lists[0]; // The buttons toolbar is also a list

    const faces = within(facesList).getAllByRole('link');

    await expect(faces.length).toEqual(3);
    await expect(faces[0].href).toEqual(
      'https://websurveys2.govmetric.com/theme/kf/1234?Q_Formid=a-test-form&Q_RATINGID=3'
    );
  },
};

export const WithExpoints = {
  name: 'With Expoints',
  args: {
    paymentUrl: '',
    publicReference: 'OF-4356',
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
      expointsOrganizationName: 'demodam',
      expointsConfigUuid: '9a48a874-d1a2-4162-875d-4f6338e1e1e0',
      enableExpointsAnalytics: true,
    },
    msw: {
      handlers: [mockExpointsGetLoaderScript('demodam')],
    },
  },
  play: async ({canvasElement}) => {
    const scripts = document.querySelectorAll('script#expoints');

    await expect(scripts.length).toEqual(1);

    const script = scripts[0];

    await expect(script.async).toEqual(true);
    await expect(script.src).toEqual(
      'https://demodam.expoints.nl/m/Scripts/dist/expoints-external-loader.min.js'
    );
  },
};

export const WithoutExpoints = {
  name: 'Without Expoints',
  args: {
    paymentUrl: '',
    publicReference: 'OF-4356',
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
      enableExpointsAnalytics: false,
    },
    msw: {
      handlers: [mockExpointsGetLoaderScript('demodam')],
    },
  },
  play: async ({canvasElement}) => {
    const scripts = document.querySelectorAll('script#expoints');

    await expect(scripts.length).toEqual(0);
  },
};
