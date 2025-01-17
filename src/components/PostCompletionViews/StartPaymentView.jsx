import PropTypes from 'prop-types';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useLocation} from 'react-router-dom';

import Body from 'components/Body';
import ErrorBoundary from 'components/Errors/ErrorBoundary';
import {DEBUG} from 'utils';

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

      <Body component="div">
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

const StartPaymentView = ({onFailure, onConfirmed, downloadPDFText}) => {
  const {statusUrl, submission} = useLocation().state || {};
  if (DEBUG) {
    if (!statusUrl) throw new Error('You must pass the status URL via the route state.');
    if (!submission) {
      throw new Error('You must pass the submitted submission via the router state.');
    }
  }
  return (
    <StatusUrlPoller
      statusUrl={statusUrl}
      onFailure={error => onFailure(submission, error)}
      onConfirmed={onConfirmed}
    >
      <StartPaymentViewDisplay downloadPDFText={downloadPDFText} />
    </StatusUrlPoller>
  );
};

StartPaymentView.propTypes = {
  onFailure: PropTypes.func,
  onConfirmed: PropTypes.func,
  downloadPDFText: PropTypes.node,
};

export default StartPaymentView;
export {StartPaymentViewDisplay};
