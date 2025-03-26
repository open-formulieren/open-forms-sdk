import {MemoryRouter} from 'react-router';

import {PermissionDenied, ServiceUnavailable, UnprocessableEntity} from '@/errors';

import ErrorBoundary from './ErrorBoundary';

const Nested = ({error}) => {
  throw error;
};

const render = ({useCard, errorType, errorCode}) => {
  const error = new errorType('some error', 500, 'some error', errorCode);
  return (
    <ErrorBoundary useCard={useCard}>
      <Nested error={error} />
    </ErrorBoundary>
  );
};

export default {
  title: 'Private API / ErrorBoundary',
  component: ErrorBoundary,
  render,
  argTypes: {
    useCard: {control: {type: 'boolean'}},
    errorType: {
      table: {
        options: [PermissionDenied, ServiceUnavailable, UnprocessableEntity],
        control: {type: 'radio'},
      },
    },
  },
};

export const GenericError = {
  args: {
    useCard: true,
    errorType: Error,
    errorCode: 'generic',
  },
};

export const PermissionDeniedError = {
  decorators: [
    Story => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    useCard: true,
    errorType: PermissionDenied,
  },
};

export const UnprocessableEntityErrorInactive = {
  args: {
    useCard: true,
    errorType: UnprocessableEntity,
    errorCode: 'form-inactive',
  },
};

export const UnprocessableEntityErrorGeneric = {
  args: {
    useCard: true,
    errorType: UnprocessableEntity,
    errorCode: 'generic',
  },
};

export const ServiceUnavailableErrorMaintenance = {
  args: {
    useCard: true,
    errorType: ServiceUnavailable,
    errorCode: 'form-maintenance',
  },
};

export const ServiceUnavailableErrorMaxSubmissions = {
  args: {
    useCard: true,
    errorType: ServiceUnavailable,
    errorCode: 'form-maximum-submissions',
  },
};

export const ServiceUnavailableError = {
  args: {
    useCard: true,
    errorType: ServiceUnavailable,
    errorCode: 'service_unavailable',
  },
};

export const ServiceUnavailableErrorGeneric = {
  args: {
    useCard: true,
    errorType: ServiceUnavailable,
    errorCode: 'generic',
  },
};
