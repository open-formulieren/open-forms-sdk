import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useLocation} from 'react-router';

import Body from '@/components/Body';
import ErrorBoundary from '@/components/Errors/ErrorBoundary';
import useFormContext from '@/hooks/useFormContext';
import {DEBUG} from '@/utils';

import PostCompletionView from './PostCompletionView';
import {StartPayment} from './StartPayment';
import StatusUrlPoller, {SubmissionStatusContext} from './StatusUrlPoller';

export interface StartPaymentViewDisplayProps {
  downloadPDFText: React.ReactNode;
}

const StartPaymentViewDisplay: React.FC<StartPaymentViewDisplayProps> = ({downloadPDFText}) => {
  const intl = useIntl();
  const {publicReference, paymentUrl, reportDownloadUrl} = useContext(SubmissionStatusContext);
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
      body={
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
      }
      reportDownloadUrl={reportDownloadUrl}
    />
  );
};

export interface StartPaymentViewProps {
  /**
   * Location to navigate to on failure.
   */
  onFailureNavigateTo: string;
}

const StartPaymentView: React.FC<StartPaymentViewProps> = ({onFailureNavigateTo}) => {
  const form = useFormContext();
  const {statusUrl} = useLocation().state || {};
  if (DEBUG && !statusUrl) throw new Error('You must pass the status URL via the route state.');
  return (
    <StatusUrlPoller statusUrl={statusUrl} onFailureNavigateTo={onFailureNavigateTo}>
      <StartPaymentViewDisplay downloadPDFText={form.submissionReportDownloadLinkTitle} />
    </StatusUrlPoller>
  );
};

export {StartPaymentViewDisplay};
export default StartPaymentView;
