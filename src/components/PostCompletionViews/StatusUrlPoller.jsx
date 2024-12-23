import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useLocation} from 'react-router-dom';

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

const StatusUrlPoller = ({statusUrl, onFailure, onConfirmed, children}) => {
  const intl = useIntl();
  const location = useLocation();

  const genericErrorMessage = intl.formatMessage({
    description: 'Generic submission error',
    defaultMessage: 'Something went wrong while submitting the form.',
  });

  const {
    loading,
    error,
    response: statusResponse,
  } = usePoll(
    statusUrl || location?.state?.statusUrl,
    1000,
    response => response.status === 'done',
    response => {
      if (response.result === RESULT_FAILED) {
        const errorMessage = response.errorMessage || genericErrorMessage;
        onFailure && onFailure(errorMessage);
      } else if (response.result === RESULT_SUCCESS) {
        onConfirmed && onConfirmed();
      }
    }
  );

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
  // spinners
  if (error) {
    console.error(error);
  }

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
  statusUrl: PropTypes.string,
  onFailure: PropTypes.func,
  onConfirmed: PropTypes.func,
  children: PropTypes.node,
};

export {SubmissionStatusContext};
export default StatusUrlPoller;
