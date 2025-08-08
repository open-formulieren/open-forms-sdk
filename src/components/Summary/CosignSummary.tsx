import {useContext} from 'react';
import {FormattedMessage} from 'react-intl';
import {Location} from 'react-router';

import {LiteralsProvider} from 'components/Literal';
import {SessionTrackerModal} from 'components/Sessions';
import useRecycleSubmission from 'hooks/useRecycleSubmission';
import useSessionTimeout from 'hooks/useSessionTimeout';

import {ConfigContext} from '@/Context';
import type {Form} from '@/data/forms';
import {type CosignConfirmBody, type Submission, confirmCosign} from '@/data/submissions';

import GenericSummary from './GenericSummary';
import {useLoadSummaryData} from './hooks';

export interface CosignSummaryProps {
  form: Form;
  submission: Submission | null;
  onSubmissionLoaded: (submission: Submission, location: Location) => void;
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
    // @ts-expect-error hook is not TS aware yet
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
    // @ts-expect-error incorrect inference from JS
    removeSubmissionId();
    onCosignComplete(reportDownloadUrl);
  };

  // FIXME: the callback onTimeout is not a stable reference, breaking memoization
  const [, expiryDate] = useSessionTimeout(() => {
    // @ts-expect-error incorrect inference from JS
    removeSubmissionId();
    onDestroySession();
  });

  return (
    // @ts-expect-error expiryDate inference is not accurate
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
