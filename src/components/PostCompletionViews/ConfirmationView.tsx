import React, {useContext} from 'react';
import {FormattedMessage, type MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {useLocation, useSearchParams} from 'react-router';

import Body from '@/components/Body';
import ErrorMessage from '@/components/Errors/ErrorMessage';
import {GovMetricSnippet} from '@/components/analytics';
import useFormContext from '@/hooks/useFormContext';
import {DEBUG} from '@/utils';

import PostCompletionView from './PostCompletionView';
import StatusUrlPoller, {SubmissionStatusContext} from './StatusUrlPoller';

type PaymentStatus = 'started' | 'processing' | 'failed' | 'completed' | 'registered';

// see openforms.payments.constants.PaymentStatus in the backend
const STATUS_MESSAGES = defineMessages<PaymentStatus, MessageDescriptor>({
  started: {
    description: 'payment started status',
    defaultMessage: "You've started the payment process.",
  },
  processing: {
    description: 'payment processing status',
    defaultMessage: 'Your payment is currently processing.',
  },
  failed: {
    description: 'payment failed status',
    defaultMessage:
      'The payment has failed. If you aborted the payment, please complete payment from the confirmation email.',
  },
  completed: {
    description: 'payment completed status',
    defaultMessage: 'Your payment has been received.',
  },
  registered: {
    description: 'payment registered status',
    defaultMessage: 'Your payment is received and processed.',
  },
});

export interface ConfirmationViewDisplayProps {
  downloadPDFText: React.ReactNode;
}

const ConfirmationViewDisplay: React.FC<ConfirmationViewDisplayProps> = ({downloadPDFText}) => {
  const intl = useIntl();
  const location = useLocation();
  const paymentStatus: PaymentStatus | undefined = location?.state?.status;

  const {
    publicReference,
    reportDownloadUrl,
    confirmationPageTitle,
    confirmationPageContent,
    mainWebsiteUrl,
  } = useContext(SubmissionStatusContext);

  if (paymentStatus && !(paymentStatus in STATUS_MESSAGES)) {
    throw new Error('Unknown payment status');
  }

  const Wrapper = paymentStatus === 'failed' ? ErrorMessage : React.Fragment;

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
      body={
        <>
          {paymentStatus && (
            <Body component="div">
              <Wrapper>{intl.formatMessage(STATUS_MESSAGES[paymentStatus])}</Wrapper>
            </Body>
          )}
          <Body
            component="div"
            modifiers={['wysiwyg']}
            dangerouslySetInnerHTML={{__html: confirmationPageContent}}
          />
        </>
      }
      mainWebsiteUrl={mainWebsiteUrl}
      reportDownloadUrl={reportDownloadUrl}
      extraBody={<GovMetricSnippet />}
    />
  );
};

export interface ConfirmationViewProps {
  /**
   * Location to navigate to on failure.
   */
  onFailureNavigateTo: string;
  /**
   * Optional callback to invoke when processing was successful.
   * @deprecated
   */
  onConfirmed?: () => void;
}

const ConfirmationView: React.FC<ConfirmationViewProps> = ({onFailureNavigateTo, onConfirmed}) => {
  const form = useFormContext();
  // TODO: take statusUrl from session storage instead of router state / query params,
  // which is the best tradeoff between security and convenience (state doesn't survive
  // hard refreshes, query params is prone to accidental information leaking)
  const location = useLocation();
  const [params] = useSearchParams();
  const statusUrl: string = params.get('statusUrl') ?? location.state?.statusUrl;

  if (DEBUG && !statusUrl) {
    throw new Error(
      'You must pass the status URL via the router state (preferably) or query params.'
    );
  }

  return (
    <StatusUrlPoller
      statusUrl={statusUrl}
      onFailureNavigateTo={onFailureNavigateTo}
      onConfirmed={onConfirmed}
    >
      <ConfirmationViewDisplay downloadPDFText={form.submissionReportDownloadLinkTitle} />
    </StatusUrlPoller>
  );
};

export {ConfirmationViewDisplay};
export default ConfirmationView;
