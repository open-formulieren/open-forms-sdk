import React from 'react';
import {withRouter} from 'storybook-addon-remix-react-router';

import {PermissionDenied, ServiceUnavailable, UnprocessableEntity} from 'errors';

import ErrorBoundary from './ErrorBoundary';

const render = ({useCard, errorType, errorCode}) => {
  const error = new errorType('some error', 500, 'some error', errorCode);

  return (
    <ErrorBoundary useCard={useCard}>
      {React.createElement(() => {
        throw error;
      })}
    </ErrorBoundary>
  );
};

export default {
  title: 'Private API / ErrorBoundary',
  component: ErrorBoundary,
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
  render,
  args: {
    useCard: true,
    errorType: Error,
    errorCode: 'generic',
  },
};

export const PermissionDeniedError = {
  render,
  decorators: [withRouter],
  args: {
    useCard: true,
    errorType: PermissionDenied,
  },
};

export const UnprocessableEntityErrorInactive = {
  render,
  args: {
    useCard: true,
    errorType: UnprocessableEntity,
    errorCode: 'form-inactive',
  },
};

export const UnprocessableEntityErrorGeneric = {
  render,
  args: {
    useCard: true,
    errorType: UnprocessableEntity,
    errorCode: 'generic',
  },
};

export const ServiceUnavailableErrorMaintenance = {
  render,
  args: {
    useCard: true,
    errorType: ServiceUnavailable,
    errorCode: 'form-maintenance',
  },
};

export const ServiceUnavailableErrorMaxSubmissions = {
  render,
  args: {
    useCard: true,
    errorType: ServiceUnavailable,
    errorCode: 'form-maximum-submissions',
  },
};

export const ServiceUnavailableError = {
  render,
  args: {
    useCard: true,
    errorType: ServiceUnavailable,
    errorCode: 'service_unavailable',
  },
};

export const ServiceUnavailableErrorGeneric = {
  render,
  args: {
    useCard: true,
    errorType: ServiceUnavailable,
    errorCode: 'generic',
  },
};
