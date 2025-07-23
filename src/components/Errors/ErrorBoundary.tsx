import * as Sentry from '@sentry/react';
import React from 'react';

import {getEnv} from '@/env';
import {DEBUG} from '@/utils';

import ErrorDisplay from './ErrorDisplay';
import type {AnyError} from './types';

const logError = (error: Error, errorInfo: React.ErrorInfo): void => {
  if (DEBUG) {
    const muteConsole = getEnv('MUTE_ERROR_BOUNDARY_LOG');
    if (!muteConsole) console.error(error, errorInfo);
  } else {
    Sentry.captureException(error);
  }
};

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

export type ErrorBoundaryState = StateWithError | StateWithoutError;

class ErrorBoundary extends React.Component<Props, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
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
    return <ErrorDisplay useCard={useCard} error={error} />;
  }
}

export {logError};
export default ErrorBoundary;
