import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {useAsync} from 'react-use';

import {post} from 'api';
import {LiteralsProvider} from 'components/Literal';
import {SessionTrackerModal} from 'components/Sessions';
import {SUBMISSION_ALLOWED} from 'components/constants';
import useRecycleSubmission from 'hooks/useRecycleSubmission';
import useSessionTimeout from 'hooks/useSessionTimeout';
import Types from 'types';

import GenericSummary from './GenericSummary';
import {loadSummaryData} from './utils';

const CosignSummary = ({
  form,
  submission,
  summaryData,
  onSubmissionLoaded,
  onDataLoaded,
  onCosignComplete,
  onDestroySession,
}) => {
  // The backend has added the submission to the session, but we need to load it
  const [loading, , removeSubmissionId] = useRecycleSubmission(
    form,
    submission,
    onSubmissionLoaded,
    error => {
      throw error;
    }
  );

  const {loading: loadingData, error: loadingDataError} = useAsync(async () => {
    if (!submission) return;
    const submissionUrl = new URL(submission.url);
    const retrievedSummaryData = await loadSummaryData(submissionUrl);
    onDataLoaded({summaryData: retrievedSummaryData});
  }, [submission]);

  if (loadingDataError) throw loadingDataError;

  const onSubmit = async statementValues => {
    const cosignEndpoint = new URL(`/api/v2/submissions/${submission.id}/cosign`, submission.url);
    const response = await post(cosignEndpoint.href, statementValues);

    removeSubmissionId();
    onCosignComplete(response.data.reportDownloadUrl);
  };

  const destroySession = async () => {
    removeSubmissionId();
    onDestroySession();
  };

  const [, expiryDate] = useSessionTimeout(async () => {
    await destroySession();
  });

  if (!(loading || loadingData) && !summaryData) {
    throw new Error('Could not load the data for this submission.');
  }

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
          submissionAllowed={SUBMISSION_ALLOWED.yes}
          summaryData={summaryData}
          showPaymentInformation={false}
          editStepText=""
          isLoading={loading || loadingData}
          isAuthenticated={true}
          onSubmit={onSubmit}
          onDestroySession={onDestroySession}
        />
      </LiteralsProvider>
    </SessionTrackerModal>
  );
};

CosignSummary.propTypes = {
  form: Types.Form.isRequired,
  submission: Types.Submission,
  summaryData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.object),
    })
  ).isRequired,
  onSubmissionLoaded: PropTypes.func.isRequired,
  onDataLoaded: PropTypes.func.isRequired,
  onCosignComplete: PropTypes.func.isRequired,
  onDestroySession: PropTypes.func.isRequired,
};

export default CosignSummary;
