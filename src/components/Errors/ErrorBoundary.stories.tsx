import {Meta, StoryObj} from '@storybook/react';
import {MemoryRouter} from 'react-router';

import {PermissionDenied, ServiceUnavailable, UnprocessableEntity} from '@/errors';

import ErrorBoundary from './ErrorBoundary';

// in JS, you actually *can* throw anything
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Throw: React.FC<{error: any}> = ({error}) => {
  throw error;
};

export default {
  title: 'Private API / ErrorBoundary',
  component: ErrorBoundary,
  args: {
    children: <Throw error={new Error('nope')} />,
    useCard: true,
  },
  argTypes: {
    children: {table: {disable: true}},
  },
} satisfies Meta<typeof ErrorBoundary>;

type Story = StoryObj<typeof ErrorBoundary>;

export const GenericStringError: Story = {
  args: {
    children: <Throw error={'an error string'} />,
  },
};

export const GenericErrorInstance: Story = {
  args: {
    children: <Throw error={new Error(`it's bwoken`)} />,
  },
};

export const GenericObjectError: Story = {
  args: {
    children: <Throw error={{bwoken: 'it is'}} />,
  },
};

export const PermissionDeniedError: Story = {
  decorators: [
    // can't use withRouter due to some weird navigation infinite re-rendering issue
    Story => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    children: (
      <Throw
        error={
          new PermissionDenied(
            'not logged in',
            403,
            'You are not authenticated',
            'permission_denied'
          )
        }
      />
    ),
  },
};

export const UnprocessableEntityErrorInactive = {
  args: {
    children: (
      <Throw
        error={
          new UnprocessableEntity(
            'Unprocessable Entity',
            422,
            'This form is currently not available.',
            'form-inactive'
          )
        }
      />
    ),
  },
};

export const UnprocessableEntityErrorGeneric = {
  args: {
    children: (
      <Throw
        error={new UnprocessableEntity('Unprocessable Entity', 422, 'Generic error.', 'generic')}
      />
    ),
  },
};

export const ServiceUnavailableErrorMaintenance: Story = {
  args: {
    children: (
      <Throw
        error={
          new ServiceUnavailable(
            'Service Unavailable',
            503,
            'This form is currently in maintenance.',
            'form-maintenance'
          )
        }
      />
    ),
  },
};

export const ServiceUnavailableErrorMaxSubmissions: Story = {
  args: {
    children: (
      <Throw
        error={
          new ServiceUnavailable(
            'Service Unavailable',
            503,
            'This form has reached its submission limit.',
            'form-maximum-submissions'
          )
        }
      />
    ),
  },
};

export const ServiceUnavailableError: Story = {
  args: {
    children: (
      <Throw
        error={
          new ServiceUnavailable(
            'Service Unavailable',
            503,
            'The service temporarily unavailable.',
            'service_unavailable'
          )
        }
      />
    ),
  },
};

export const ServiceUnavailableErrorGeneric: Story = {
  args: {
    children: (
      <Throw
        error={
          new ServiceUnavailable('Service Unavailable', 503, 'Temporarily unavailable.', 'generic')
        }
      />
    ),
  },
};
