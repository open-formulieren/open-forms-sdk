import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useLocation, useNavigate} from 'react-router-dom';

import Body from 'components/Body';
import Card from 'components/Card';
import Loader from 'components/Loader';
import usePoll from 'hooks/usePoll';

const RESULT_FAILED = 'failed';
const RESULT_SUCCESS = 'success';

const SubmissionStatusContext = React.createContext({
  publicReference: '',
  paymentUrl: '',
  reportDownloadUrl: '',
  confirmationPageTitle: '',
  confirmationPageContent: '',
  mainWebsiteUrl: '',
});
SubmissionStatusContext.displayName = 'SubmissionStatusContext';

const StatusUrlPoller = ({statusUrl, onFailureNavigateTo, onConfirmed, children}) => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const genericErrorMessage = intl.formatMessage({
    description: 'Generic submission error',
    defaultMessage: 'Something went wrong while submitting the form.',
  });

  const {
    loading,
    error,
    response: statusResponse,
  } = usePoll(
    statusUrl,
    1000,
    response => response.status === 'done',
    response => {
      if (response.result === RESULT_FAILED) {
        const errorMessage = response.errorMessage || genericErrorMessage;
        const newState = {...(location.state || {}), errorMessage};
        navigate(onFailureNavigateTo, {state: newState});
      } else if (response.result === RESULT_SUCCESS) {
        onConfirmed?.();
      }
    }
  );
  if (error) throw error;

  if (loading) {
    return (
      <Card
        title={
          <FormattedMessage
            description="Checking background processing status title"
            defaultMessage="Processing..."
          />
        }
      >
        <Loader modifiers={['centered']} />
        <Body>
          <FormattedMessage
            description="Checking background processing status body"
            defaultMessage="Please hold on while we're processing your submission."
          />
        </Body>
      </Card>
    );
  }

  // FIXME: https://github.com/open-formulieren/open-forms/issues/3255
  // errors (bad gateway 502, for example) appear to result in infinite loading
  // spinners. Throwing during rendering will at least make it bubble up to the nearest
  // error boundary.
  if (error) throw error;

  const {
    result,
    paymentUrl,
    publicReference,
    reportDownloadUrl,
    confirmationPageTitle,
    confirmationPageContent,
    mainWebsiteUrl,
  } = statusResponse;

  if (result === RESULT_FAILED) {
    throw new Error('Failure should have been handled in the onFailure prop.');
  }

  return (
    <SubmissionStatusContext.Provider
      value={{
        publicReference,
        paymentUrl,
        reportDownloadUrl,
        confirmationPageTitle,
        confirmationPageContent,
        mainWebsiteUrl,
      }}
    >
      {children}
    </SubmissionStatusContext.Provider>
  );
};

StatusUrlPoller.propTypes = {
  /**
   * Backend status URL to poll for status checks.
   */
  statusUrl: PropTypes.string.isRequired,
  /**
   * Route to navigate to if the status check reports failure.
   *
   * The route state will be extended with `errorMessage` property retrieved from the
   * backend processing.
   */
  onFailureNavigateTo: PropTypes.string.isRequired,
  onConfirmed: PropTypes.func,
  children: PropTypes.node,
};

export {SubmissionStatusContext};
export default StatusUrlPoller;
