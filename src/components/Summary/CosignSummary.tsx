import {useContext} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from '@/Context';
import {LiteralsProvider} from '@/components/Literal';
import {SessionTrackerModal} from '@/components/Sessions';
import type {Form} from '@/data/forms';
import {type CosignConfirmBody, type Submission, confirmCosign} from '@/data/submissions';
import useRecycleSubmission from '@/hooks/useRecycleSubmission';
import useSessionTimeout from '@/hooks/useSessionTimeout';

import GenericSummary from './GenericSummary';
import {useLoadSummaryData} from './hooks';

export interface CosignSummaryProps {
  form: Form;
  submission: Submission | null;
  onSubmissionLoaded: (submission: Submission) => void;
  onCosignComplete: (pdfDownloadUrl: string) => void;
  onDestroySession: () => Promise<void>;
}

const CosignSummary: React.FC<CosignSummaryProps> = ({
  form,
  submission,
  onSubmissionLoaded,
  onCosignComplete,
  onDestroySession,
}) => {
  const {baseUrl} = useContext(ConfigContext);
  // The backend has added the submission to the session, but we need to load it. Once
  // loaded, it will be passed in as a prop again.
  // TODO: can we lift this up and simplify?
  const [loading, , removeSubmissionId] = useRecycleSubmission(
    form,
    submission,
    onSubmissionLoaded,
    (error: Error) => {
      throw error;
    }
  );

  const summaryDataState = useLoadSummaryData(submission);
  if (summaryDataState.error) throw summaryDataState.error;
  const loadingData = summaryDataState.loading;

  const anythingLoading = Boolean(loading || loadingData || summaryDataState.value === null);
  const summaryData = summaryDataState.value ?? [];

  const onSubmit = async (statementValues: CosignConfirmBody) => {
    const {reportDownloadUrl} = await confirmCosign(baseUrl, submission!.id, statementValues);
    removeSubmissionId();
    onCosignComplete(reportDownloadUrl);
  };

  // FIXME: the callback onTimeout is not a stable reference, breaking memoization
  const [, expiryDate] = useSessionTimeout(() => {
    removeSubmissionId();
    onDestroySession();
  });

  return (
    <SessionTrackerModal expiryDate={expiryDate}>
      <LiteralsProvider literals={form.literals}>
        <GenericSummary
          title={
            <FormattedMessage
              description="Check overview and co-sign"
              defaultMessage="Check and co-sign submission"
            />
          }
          submissionAllowed="yes"
          summaryData={summaryData}
          blockEdit
          isLoading={anythingLoading}
          isAuthenticated
          onSubmit={onSubmit}
          onDestroySession={onDestroySession}
        />
      </LiteralsProvider>
    </SessionTrackerModal>
  );
};

export default CosignSummary;
