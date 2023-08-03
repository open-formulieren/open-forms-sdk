import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import {post} from 'api';
import {LayoutColumn} from 'components/Layout';
import {LiteralsProvider} from 'components/Literal';
import {RequireSession} from 'components/Sessions';
import {SUBMISSION_ALLOWED} from 'components/constants';
import useRecycleSubmission from 'hooks/useRecycleSubmission';
import useSessionTimeout from 'hooks/useSessionTimeout';
import Types from 'types';

import GenericSummary from './GenericSummary';
import {getPrivacyPolicyInfo, loadSummaryData} from './utils';

const CosignSummary = ({
  form,
  submission,
  summaryData,
  privacyInfo,
  onSubmissionLoaded,
  onDataLoaded,
  onCosignComplete,
  onDestroySession,
}) => {
  const intl = useIntl();
  const config = useContext(ConfigContext);

  // The backend has added the submission to the session, but we need to load it
  // eslint-disable-next-line
  const [loading, setSubmissionId, removeSubmissionId] = useRecycleSubmission(
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

    let promises = [loadSummaryData(submissionUrl), getPrivacyPolicyInfo(config.baseUrl)];

    const [retrievedSummaryData, retrievedPrivacyInfo] = await Promise.all(promises);

    onDataLoaded({privacyInfo: retrievedPrivacyInfo, summaryData: retrievedSummaryData});
  }, [submission]);

  if (loadingDataError) throw loadingDataError;

  const onSubmit = async ({privacy: privacyPolicyAccepted}) => {
    const cosignEndpoint = new URL(`/api/v2/submissions/${submission.id}/cosign`, submission.url);
    const response = await post(cosignEndpoint.href, {privacyPolicyAccepted});

    removeSubmissionId();
    onCosignComplete(response.data.reportDownloadUrl);
  };

  const destroySession = async () => {
    removeSubmissionId();
    onDestroySession();
  };

  const onLogout = async event => {
    event.preventDefault();

    const confirmationMessage = intl.formatMessage({
      description: 'log out confirmation prompt on co-sign page',
      defaultMessage:
        'Are you sure that you want to logout and not co-sign the current form submission?',
    });

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    await destroySession();
  };

  // eslint-disable-next-line
  const [sessionExpired, expiryDate, resetSession] = useSessionTimeout(async () => {
    await destroySession();
  });

  if (!(loading || loadingData) && !summaryData) {
    throw new Error('Could not load the data for this submission.');
  }

  return (
    <RequireSession expired={sessionExpired} expiryDate={expiryDate}>
      <LayoutColumn modifiers={['mobile-order-2', 'mobile-padding-top']}>
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
            privacyInformation={privacyInfo}
            editStepText=""
            isLoading={loading || loadingData}
            isAuthenticated={true}
            onSubmit={onSubmit}
            onLogout={onLogout}
          />
        </LiteralsProvider>
      </LayoutColumn>
    </RequireSession>
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
  privacyInfo: PropTypes.shape({
    requiresPrivacyConsent: PropTypes.bool,
    privacyLabel: PropTypes.string,
  }).isRequired,
  onSubmissionLoaded: PropTypes.func.isRequired,
  onDataLoaded: PropTypes.func.isRequired,
  onCosignComplete: PropTypes.func.isRequired,
  onDestroySession: PropTypes.func.isRequired,
};

export default CosignSummary;
