import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import { Link } from 'react-router-dom';

import Anchor from 'components/Anchor';
import Body from 'components/Body';
import Card from 'components/Card';
import ErrorMessage from 'components/ErrorMessage';


const logError = (error, errorInfo) => {
  console.error(error, errorInfo);
};


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
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
    const { useCard, children } = this.props;
    const { hasError, error } = this.state;
    if (!hasError) {
      return children;
    }

    const ErrorComponent = ERROR_TYPE_MAP[error.name] || GenericError;
    const Wrapper = useCard ? Card : React.Fragment;
    return (
      <ErrorComponent wrapper={Wrapper} error={error} />
    );
  }
}

ErrorBoundary.propTypes = {
  useCard: PropTypes.bool,
};


const GenericError = ({ wrapper: Wrapper, error }) => (
  <Wrapper title={<FormattedMessage description="Error boundary title" defaultMessage="Oops!" />}>
    <ErrorMessage>
      <FormattedMessage
        description="Generic error message"
        defaultMessage="Unfortunately something went wrong!"
      />
    </ErrorMessage>
    {error.detail && <Body>{error.detail}</Body>}
  </Wrapper>
);

GenericError.propTypes = {
  wrapper: PropTypes.elementType.isRequired,
  error: PropTypes.object, // exception instance
};


const PermissionDeniedError = ({ wrapper: Wrapper, error }) => {
  return (
    <Wrapper title={<FormattedMessage
        description="'Permission denied' error title"
        defaultMessage="Authentication problem" />}>
      <ErrorMessage>
        <FormattedMessage
          description="Authentication error message"
          defaultMessage="There was an authentication and/or permission problem."
        />
      </ErrorMessage>

      {error.detail && <Body>{error.detail}</Body>}

      <Link to="/" component={Anchor}>
        <FormattedMessage
          description="return to form start link after 403"
          defaultMessage="Back to form start"
        />
      </Link>

    </Wrapper>
  );
};

PermissionDeniedError.propTypes = {
  wrapper: PropTypes.elementType.isRequired,
  error: PropTypes.object, // exception instance
};


// map the type of error to the component to render
const ERROR_TYPE_MAP = {
  'PermissionDenied': PermissionDeniedError,
};

export default ErrorBoundary;
