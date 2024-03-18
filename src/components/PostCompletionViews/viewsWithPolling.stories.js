import {expect} from '@storybook/test';
import {waitFor, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {BASE_URL} from 'api-mocks';
import {
  mockSubmissionProcessingStatusGet,
  mockSubmissionProcessingStatusPendingGet,
} from 'api-mocks/submissions';
import {withSubmissionPollInfo} from 'story-utils/decorators';

import ConfirmationView from './ConfirmationView';

export default {
  title: 'Private API / Post completion views / With Polling',
  component: ConfirmationView,
  decorators: [withSubmissionPollInfo, withRouter],
  argTypes: {
    statusUrl: {control: false},
  },
  args: {
    statusUrl: `${BASE_URL}submissions/4b0e86a8-dc5f-41cc-b812-c89857b9355b/-token-/status`,
  },
  parameters: {
    msw: {
      handlers: [mockSubmissionProcessingStatusGet],
    },
    reactRouter: {
      location: {state: {}},
    },
  },
};

export const withoutPayment = {
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await waitFor(
      async () => {
        expect(canvas.getByRole('button', {name: 'Terug naar de website'})).toBeVisible();
      },
      {
        timeout: 2000,
        interval: 100,
      }
    );
    expect(canvas.getByText(/OF-L337/)).toBeVisible();
    expect(args.onConfirmed).toBeCalledTimes(1);
  },
};

export const withPayment = {
  parameters: {
    reactRouter: {
      location: {
        state: {status: 'completed', userAction: 'accept'},
      },
    },
  },
};

export const Pending = {
  parameters: {
    msw: {
      handlers: [mockSubmissionProcessingStatusPendingGet],
    },
  },
};
