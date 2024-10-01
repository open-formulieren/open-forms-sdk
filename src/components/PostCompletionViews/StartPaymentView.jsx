import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import Body from 'components/Body';
import ErrorBoundary from 'components/Errors/ErrorBoundary';

import PostCompletionView from './PostCompletionView';
import {StartPayment} from './StartPayment';
import StatusUrlPoller, {SubmissionStatusContext} from './StatusUrlPoller';

const StartPaymentViewDisplay = ({downloadPDFText}) => {
  const intl = useIntl();
  const {publicReference, paymentUrl, reportDownloadUrl} = useContext(SubmissionStatusContext);

  const body = (
    <>
      <Body>
        <FormattedMessage
          description="Submission reference text"
          defaultMessage="Your reference number is: {reference}"
          values={{reference: publicReference}}
        />
      </Body>

      <Body>
        <FormattedMessage
          description="Payment request text"
          defaultMessage="A payment is required for this product."
        />

        <ErrorBoundary>
          <StartPayment startUrl={paymentUrl} />
        </ErrorBoundary>
      </Body>
    </>
  );
  return (
    <PostCompletionView
      downloadPDFText={downloadPDFText}
      pageTitle={intl.formatMessage({
        description: 'Payment page title',
        defaultMessage: 'Payment',
      })}
      header={
        <FormattedMessage
          description="On succesful completion title but payment required"
          defaultMessage="Betalen"
        />
      }
      body={body}
      reportDownloadUrl={reportDownloadUrl}
    />
  );
};

StartPaymentViewDisplay.propTypes = {
  downloadPDFText: PropTypes.node,
};

const StartPaymentView = ({statusUrl, onFailure, onConfirmed, downloadPDFText}) => {
  return (
    <StatusUrlPoller statusUrl={statusUrl} onFailure={onFailure} onConfirmed={onConfirmed}>
      <StartPaymentViewDisplay downloadPDFText={downloadPDFText} />
    </StatusUrlPoller>
  );
};

StartPaymentView.propTypes = {
  statusUrl: PropTypes.string,
  onFailure: PropTypes.func,
  onConfirmed: PropTypes.func,
  downloadPDFText: PropTypes.node,
};

export default StartPaymentView;
export {StartPaymentViewDisplay};
