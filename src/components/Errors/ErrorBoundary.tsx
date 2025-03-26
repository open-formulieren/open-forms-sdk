import * as Sentry from '@sentry/react';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import FormMaximumSubmissions from 'components/FormMaximumSubmissions';
import Link from 'components/Link';
import MaintenanceMode from 'components/MaintenanceMode';

import Body from '@/components/Body';
import Card from '@/components/Card';
import {getEnv} from '@/env';
import {APIError, PermissionDenied, ServiceUnavailable, UnprocessableEntity} from '@/errors';
import {DEBUG} from '@/utils';

import ErrorMessage from './ErrorMessage';
import FormUnavailable from './FormUnavailable';
import type {WrapperProps} from './types';

const logError = (error: Error, errorInfo: React.ErrorInfo): void => {
  if (DEBUG) {
    const muteConsole = getEnv('MUTE_ERROR_BOUNDARY_LOG');
    if (!muteConsole) console.error(error, errorInfo);
  } else {
    Sentry.captureException(error);
  }
};

// you can pretty much throw anything in JS
type AnyError = Error | APIError | string | object;

interface Props {
  children: React.ReactNode;
  useCard?: boolean;
}

interface StateWithoutError {
  hasError: false;
  error: null;
}

interface StateWithError {
  hasError: true;
  error: AnyError;
}

type State = StateWithError | StateWithoutError;

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, errorInfo);
  }

  public render(): React.ReactNode {
    const {useCard, children} = this.props;
    const {hasError, error} = this.state;
    if (!hasError) {
      return children;
    }

    return <DisplayError useCard={useCard} error={error} />;
  }
}

export interface DisplayErrorProps {
  error: AnyError;
  useCard?: boolean;
}

const DisplayError: React.FC<DisplayErrorProps> = ({error, useCard = false}) => {
  const errorCls = error.constructor.name;
  const ErrorComponent = ERROR_TYPE_MAP[errorCls] || GenericError;
  const Wrapper = useCard ? Card : 'div';
  return <ErrorComponent wrapper={Wrapper} error={error} />;
};

interface ErrorDetailProps {
  error: AnyError;
}

const ErrorDetail: React.FC<ErrorDetailProps> = ({error}) => {
  if (typeof error !== 'object') return null;
  if (!('detail' in error)) return null;
  return <Body>{error.detail}</Body>;
};

export interface ErrorProps<T extends AnyError = AnyError> {
  wrapper: React.ComponentType<WrapperProps>;
  error: T;
}

const GenericError: React.FC<ErrorProps> = ({wrapper: Wrapper, error}) => {
  const intl = useIntl();
  // Wrapper may be a DOM element, which can't handle <FormattedMessage />
  const title = intl.formatMessage({
    description: 'Error boundary title',
    defaultMessage: 'Oops!',
  });
  return (
    <Wrapper title={title}>
      <ErrorMessage>
        <FormattedMessage
          description="Generic error message"
          defaultMessage="Unfortunately something went wrong!"
        />
      </ErrorMessage>
      <ErrorDetail error={error} />
    </Wrapper>
  );
};

const PermissionDeniedError: React.FC<ErrorProps> = ({wrapper: Wrapper, error}) => {
  const intl = useIntl();
  return (
    <Wrapper
      title={intl.formatMessage({
        description: "'Permission denied' error title",
        defaultMessage: 'Authentication problem',
      })}
    >
      <ErrorMessage>
        <FormattedMessage
          description="Authentication error message"
          defaultMessage="There was an authentication and/or permission problem."
        />
      </ErrorMessage>

      {'detail' in error && <Body>{error.detail}</Body>}

      {/* @ts-expect-error need to convert it to TS yet */}
      <Link to="/">
        <FormattedMessage
          description="return to form start link after 403"
          defaultMessage="Back to form start"
        />
      </Link>
    </Wrapper>
  );
};

const UnprocessableEntityError: React.FC<ErrorProps> = ({wrapper: Wrapper, error}) => {
  const intl = useIntl();

  if (!('code' in error) || error.code !== 'form-inactive') {
    return <GenericError wrapper={Wrapper} error={error} />;
  }

  // handle deactivated forms
  return (
    <Wrapper
      title={intl.formatMessage({
        description: "'Deactivated form' error title",
        defaultMessage: 'Sorry - this form is no longer available',
      })}
    >
      <ErrorMessage>
        <FormattedMessage
          description="Deactivated form error message"
          defaultMessage="Unfortunately, this form is no longer in use. We apologise for any inconveniences."
        />
      </ErrorMessage>
    </Wrapper>
  );
};

const ServiceUnavailableError: React.FC<ErrorProps<APIError>> = ({wrapper: Wrapper, error}) => {
  const defaultComponent = <GenericError wrapper={Wrapper} error={error} />;
  // TODO: strict definition of possible error codes?
  const componentMapping: Record<string, React.ReactNode> = {
    'form-maintenance': (
      <MaintenanceMode
        title={
          <FormattedMessage
            description="'Maintenance mode form' error title"
            defaultMessage="Form temporarily unavailable"
          />
        }
      />
    ),
    'form-maximum-submissions': <FormMaximumSubmissions />,
    service_unavailable: <FormUnavailable wrapper={Wrapper} />,
  };

  return componentMapping[error.code] || defaultComponent;
};

// map the error class to the component to render it
const ERROR_TYPE_MAP: Record<string, React.FC<ErrorProps>> = {
  [PermissionDenied.name]: PermissionDeniedError,
  [UnprocessableEntity.name]: UnprocessableEntityError,
  [ServiceUnavailable.name]: ServiceUnavailableError,
};

export {logError, DisplayError};
export default ErrorBoundary;
