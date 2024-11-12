import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {FormattedMessage, defineMessage, useIntl} from 'react-intl';
import {useLocation} from 'react-router-dom';

import Body from 'components/Body';
import ErrorMessage from 'components/Errors/ErrorMessage';
import {GovMetricSnippet} from 'components/analytics';

import PostCompletionView from './PostCompletionView';
import StatusUrlPoller, {SubmissionStatusContext} from './StatusUrlPoller';

// see openforms.payments.constants.UserAction in the backend
const USER_ACTIONS = ['accept', 'exception', 'cancel', 'unknown'];

// see openforms.payments.constants.PaymentStatus in the backend
const STATUS_MESSAGES = {
  started: defineMessage({
    description: 'payment started status',
    defaultMessage: "You've started the payment process.",
  }),
  processing: defineMessage({
    description: 'payment processing status',
    defaultMessage: 'Your payment is currently processing.',
  }),
  failed: defineMessage({
    description: 'payment failed status',
    defaultMessage:
      'The payment has failed. If you aborted the payment, please complete payment from the confirmation email.',
  }),
  completed: defineMessage({
    description: 'payment completed status',
    defaultMessage: 'Your payment has been received.',
  }),
  registered: defineMessage({
    description: 'payment registered status',
    defaultMessage: 'Your payment is received and processed.',
  }),
};

const ConfirmationViewDisplay = ({downloadPDFText}) => {
  const intl = useIntl();
  const location = useLocation();
  const paymentStatus = location?.state?.status;
  const userAction = location?.state?.userAction;

  const {
    publicReference,
    reportDownloadUrl,
    confirmationPageTitle,
    confirmationPageContent,
    mainWebsiteUrl,
  } = useContext(SubmissionStatusContext);

  const paymentStatusMessage = STATUS_MESSAGES[paymentStatus];
  let Wrapper = React.Fragment;
  if (paymentStatus) {
    if (!USER_ACTIONS.includes(userAction)) throw new Error('Unknown payment user action');

    if (!paymentStatusMessage) throw new Error('Unknown payment status');

    if (paymentStatus === 'failed') Wrapper = ErrorMessage;
  }

  const body = (
    <>
      {paymentStatus && (
        <Body component="div">
          <Wrapper>{intl.formatMessage(paymentStatusMessage)}</Wrapper>
        </Body>
      )}
      <Body
        component="div"
        modifiers={['wysiwyg']}
        dangerouslySetInnerHTML={{__html: confirmationPageContent}}
      />
    </>
  );

  return (
    <PostCompletionView
      downloadPDFText={downloadPDFText}
      pageTitle={intl.formatMessage({
        description: 'Confirmation page title',
        defaultMessage: 'Confirmation',
      })}
      header={
        confirmationPageTitle || (
          <FormattedMessage
            description="Confirmation page title"
            defaultMessage="Confirmation: {reference}"
            values={{reference: publicReference}}
          />
        )
      }
      body={body}
      mainWebsiteUrl={mainWebsiteUrl}
      reportDownloadUrl={reportDownloadUrl}
      extraBody={<GovMetricSnippet />}
    />
  );
};

ConfirmationViewDisplay.propTypes = {
  downloadPDFText: PropTypes.node,
};

const ConfirmationView = ({statusUrl, onFailure, onConfirmed, downloadPDFText}) => {
  return (
    <StatusUrlPoller statusUrl={statusUrl} onFailure={onFailure} onConfirmed={onConfirmed}>
      <ConfirmationViewDisplay downloadPDFText={downloadPDFText} />
    </StatusUrlPoller>
  );
};

ConfirmationView.propTypes = {
  statusUrl: PropTypes.string,
  onFailure: PropTypes.func,
  onConfirmed: PropTypes.func,
  downloadPDFText: PropTypes.node,
};

export {ConfirmationViewDisplay};
export default ConfirmationView;
