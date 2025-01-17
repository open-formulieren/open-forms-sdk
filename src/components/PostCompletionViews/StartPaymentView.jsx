import PropTypes from 'prop-types';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useLocation, useNavigate} from 'react-router-dom';

import Body from 'components/Body';
import ErrorBoundary from 'components/Errors/ErrorBoundary';
import useFormContext from 'hooks/useFormContext';
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

const StartPaymentView = ({returnTo}) => {
  const form = useFormContext();
  const navigate = useNavigate();
  const {statusUrl} = useLocation().state || {};
  if (DEBUG && !statusUrl) throw new Error('You must pass the status URL via the route state.');
  return (
    <StatusUrlPoller
      statusUrl={statusUrl}
      onFailure={error => {
        if (returnTo) {
          const newState = {...(location.state || {}), errorMessage: error};
          navigate(returnTo, {state: newState});
        }
      }}
    >
      <StartPaymentViewDisplay downloadPDFText={form.submissionReportDownloadLinkTitle} />
    </StatusUrlPoller>
  );
};

StartPaymentView.propTypes = {
  /**
   * Location to navigate to on failure.
   */
  returnTo: PropTypes.string,
};

export default StartPaymentView;
export {StartPaymentViewDisplay};
