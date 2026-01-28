import type {Meta, StoryObj} from '@storybook/react-vite';
import {withRouter} from 'storybook-addon-remix-react-router';
import {expect, waitFor, within} from 'storybook/test';

import {BASE_URL} from '@/api-mocks';
import {mockSubmissionProcessingStatusGet} from '@/api-mocks/submissions';
import {withCard, withForm, withPageWrapper} from '@/sb-decorators';

import Confirmation from './Confirmation';

export default {
  title: 'Private API / Appointments / Steps / 5 - Confirmation',
  component: Confirmation,
  decorators: [withForm, withRouter, withPageWrapper, withCard],
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
} satisfies Meta<typeof Confirmation>;

type Story = StoryObj<typeof Confirmation>;

export const Success: Story = {
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
