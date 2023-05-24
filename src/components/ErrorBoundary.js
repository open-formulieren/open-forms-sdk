import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import Body from 'components/Body';
import Card from 'components/Card';
import ErrorMessage from 'components/ErrorMessage';
import Link from 'components/Link';
import MaintenanceMode from 'components/MaintenanceMode';
import {DEBUG} from 'utils';

const logError = (error, errorInfo) => {
  DEBUG && console.error(error, errorInfo);
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    // TODO: depending on the error type, send to sentry?
    logError(error, errorInfo);
  }

  render() {
    const {useCard, children} = this.props;
    const {hasError, error} = this.state;
    if (!hasError) {
      return children;
    }

    const ErrorComponent = ERROR_TYPE_MAP[error.name] || GenericError;
    const Wrapper = useCard ? Card : 'div';
    return <ErrorComponent wrapper={Wrapper} error={error} />;
  }
}

ErrorBoundary.propTypes = {
  useCard: PropTypes.bool,
};

const GenericError = ({wrapper: Wrapper, error}) => {
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
      {error.detail && <Body>{error.detail}</Body>}
    </Wrapper>
  );
};

GenericError.propTypes = {
  wrapper: PropTypes.elementType.isRequired,
  error: PropTypes.object, // exception instance
};

const PermissionDeniedError = ({wrapper: Wrapper, error}) => {
  return (
    <Wrapper
      title={
        <FormattedMessage
          description="'Permission denied' error title"
          defaultMessage="Authentication problem"
        />
      }
    >
      <ErrorMessage>
        <FormattedMessage
          description="Authentication error message"
          defaultMessage="There was an authentication and/or permission problem."
        />
      </ErrorMessage>

      {error.detail && <Body>{error.detail}</Body>}

      <Link to="/">
        <FormattedMessage
          description="return to form start link after 403"
          defaultMessage="Back to form start"
        />
      </Link>
    </Wrapper>
  );
};

PermissionDeniedError.propTypes = GenericError.propTypes;

const UnprocessableEntityError = ({wrapper: Wrapper, error}) => {
  if (error.code !== 'form-inactive') {
    return <GenericError wrapper={Wrapper} error={error} />;
  }
  // handle deactivated forms
  return (
    <Wrapper
      title={
        <FormattedMessage
          description="'Deactivated form' error title"
          defaultMessage="Sorry - this form is no longer available"
        />
      }
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

UnprocessableEntityError.propTypes = GenericError.propTypes;

const ServiceUnavailableError = ({wrapper: Wrapper, error}) => {
  if (error.code !== 'form-maintenance') {
    return <GenericError wrapper={Wrapper} error={error} />;
  }

  // handle maintenance mode forms
  return (
    <MaintenanceMode
      title={
        <FormattedMessage
          description="'Maintenance mode form' error title"
          defaultMessage="Form temporarily unavailable"
        />
      }
    />
  );
};

// map the type of error to the component to render
const ERROR_TYPE_MAP = {
  PermissionDenied: PermissionDeniedError,
  UnprocessableEntity: UnprocessableEntityError,
  ServiceUnavailable: ServiceUnavailableError,
};

export {logError};
export default ErrorBoundary;
