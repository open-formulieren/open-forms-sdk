import {expect, waitFor, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {BASE_URL} from 'api-mocks';
import {mockSubmissionProcessingStatusGet} from 'api-mocks/submissions';
import {LayoutDecorator, withCard, withForm} from 'story-utils/decorators';

import Confirmation from './Confirmation';

export default {
  title: 'Private API / Appointments / Steps / 5 - Confirmation',
  component: Confirmation,
  decorators: [withForm, withRouter, LayoutDecorator, withCard],
  parameters: {
    controls: {hideNoControlsWarning: true},
    msw: {
      handlers: [mockSubmissionProcessingStatusGet],
    },
    reactRouter: {
      location: {
        searchParams: {
          statusUrl: `${BASE_URL}submissions/4b0e86a8-dc5f-41cc-b812-c89857b9355b/-token-/status`,
        },
      },
    },
  },
};

export const Success = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await waitFor(
      async () => {
        expect(canvas.getByText('Bevestiging: OF-L337')).toBeVisible();
      },
      {
        timeout: 2000,
        interval: 100,
      }
    );
  },
};
