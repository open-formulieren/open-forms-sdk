import {expect} from '@storybook/test';
import {userEvent, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import Card from 'components/Card';
import {ConfigDecorator, LayoutDecorator} from 'story-utils/decorators';

import {mockAppointmentCancelErrorPost, mockAppointmentCancelPost} from '../mocks';
import CancelAppointment from './CancelAppointment';

export default {
  title: 'Private API / Appointments / Cancellation / Cancel',
  component: CancelAppointment,
  decorators: [LayoutDecorator, withRouter, ConfigDecorator],
};

export const Default = {
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

export const MissingTimeParameter = {
  name: 'Missing time parameter',
  render: () => (
    <Card title="Error">
      <CancelAppointment />
    </Card>
  ),
};

export const MissingSubmissionUUIDParameter = {
  name: 'Missing submission parameter',
  render: () => (
    <Card title="Error">
      <CancelAppointment />
    </Card>
  ),
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

export const WithBackendValidationErrors = {
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
