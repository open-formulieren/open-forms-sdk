import React from 'react';

import ErrorMessage from 'components/ErrorMessage';


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
    return (
      <ErrorMessage>Er ging helaas iets fout!</ErrorMessage>
    );
  }
}

export default ErrorBoundary;
