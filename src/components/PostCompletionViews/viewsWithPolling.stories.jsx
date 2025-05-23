import {expect, fn, waitForElementToBeRemoved, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {BASE_URL, buildSubmission} from 'api-mocks';
import {
  mockSubmissionProcessingStatusGet,
  mockSubmissionProcessingStatusPendingGet,
} from 'api-mocks/submissions';
import {withSubmissionPollInfo} from 'story-utils/decorators';

import ConfirmationView from './ConfirmationView';

export default {
  title: 'Views / Post completion views / With Polling',
  component: ConfirmationView,
  decorators: [withSubmissionPollInfo, withRouter],
  argTypes: {
    statusUrl: {control: false},
  },
  args: {
    onConfirmed: fn(),
  },
  parameters: {
    msw: {
      handlers: [mockSubmissionProcessingStatusGet],
    },
    reactRouter: {
      location: {
        state: {
          statusUrl: `${BASE_URL}submissions/4b0e86a8-dc5f-41cc-b812-c89857b9355b/-token-/status`,
          submission: buildSubmission(),
        },
      },
    },
  },
};

export const WithoutPayment = {
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const loader = await canvas.findByRole('status');
    await waitForElementToBeRemoved(loader, {timeout: 2000, interval: 100});

    expect(canvas.getByRole('link', {name: 'Terug naar de website'})).toBeVisible();
    expect(canvas.getByText(/OF-L337/)).toBeVisible();
    expect(args.onConfirmed).toBeCalledTimes(1);
  },
};

export const WithPayment = {
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
