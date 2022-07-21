import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import ErrorMessage from 'components/ErrorMessage';
import Card from 'components/Card';


const logError = (error, errorInfo) => {
  console.error(error, errorInfo);
};


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const Wrapper = this.props.useCard ? Card : React.Fragment;

    return (
      <Wrapper title={<FormattedMessage description="Error boundary title" defaultMessage="Oops!" />}>
        <ErrorMessage>Er ging helaas iets fout!</ErrorMessage>
      </Wrapper>
    );
  }
}

ErrorBoundary.propTypes = {
  useCard: PropTypes.bool,
};

export default ErrorBoundary;
