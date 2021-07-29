import React from 'react';

import Body from 'components/Body';
import FAIcon from 'components/FAIcon';
import {getBEMClassName} from 'utils';


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
      <div className={getBEMClassName('alert', ['error'])}>
        <span className={getBEMClassName('alert__icon', ['wide'])}>
          <FAIcon icon="exclamation-circle" />
        </span>
        <Body>
          Er ging helaas iets fout!
        </Body>
      </div>
    );
  }
}

export default ErrorBoundary;
