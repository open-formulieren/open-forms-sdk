import type {Meta, StoryObj} from '@storybook/react-vite';
import {withRouter} from 'storybook-addon-remix-react-router';
import {expect, userEvent, within} from 'storybook/test';

import {mockAppointmentCancelErrorPost, mockAppointmentCancelPost} from '@/api-mocks/appointments';
import Card from '@/components/Card';
import {withPageWrapper} from '@/sb-decorators';

import CancelAppointment from './CancelAppointment';

export default {
  title: 'Private API / Appointments / Cancellation / Cancel',
  component: CancelAppointment,
  decorators: [withPageWrapper, withRouter],
} satisfies Meta<typeof CancelAppointment>;

type Story = StoryObj<typeof CancelAppointment>;

export const Default: Story = {
  parameters: {
    reactRouter: {
      location: {
        searchParams: {
          time: '2023-06-13T10:00:00+02:00',
          submission_uuid: '999c6769-bc2e-43d6-a2e0-5bf104f5130e',
        },
      },
    },
    msw: {
      handlers: [mockAppointmentCancelPost],
    },
  },
};

export const MissingTimeParameter: Story = {
  name: 'Missing time parameter',
  decorators: [
    Story => (
      <Card title="Error">
        <Story />{' '}
      </Card>
    ),
  ],
};

export const MissingSubmissionUUIDParameter: Story = {
  name: 'Missing submission parameter',
  decorators: [
    Story => (
      <Card title="Error">
        <Story />{' '}
      </Card>
    ),
  ],
  parameters: {
    reactRouter: {
      location: {
        searchParams: {
          time: '2023-06-13T10:00:00+02:00',
        },
      },
    },
  },
};

export const WithBackendValidationErrors: Story = {
  name: 'Backend validation errors',
  parameters: {
    reactRouter: {
      location: {
        searchParams: {
          time: '2023-06-13T10:00:00+02:00',
          submission_uuid: '999c6769-bc2e-43d6-a2e0-5bf104f5130e',
        },
      },
    },
    msw: {
      handlers: [mockAppointmentCancelErrorPost],
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button'));
    expect(await canvas.findByText('Invalid e-mail for the submission.')).toBeVisible();
  },
};
