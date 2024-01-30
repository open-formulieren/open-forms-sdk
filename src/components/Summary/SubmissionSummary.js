import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useNavigate} from 'react-router-dom';
import {useAsync} from 'react-use';
import {useImmerReducer} from 'use-immer';

import {AnalyticsToolsConfigContext} from 'Context';
import {post} from 'api';
import {LiteralsProvider} from 'components/Literal';
import {SUBMISSION_ALLOWED} from 'components/constants';
import {findPreviousApplicableStep} from 'components/utils';
import useRefreshSubmission from 'hooks/useRefreshSubmission';
import useTitle from 'hooks/useTitle';
import Types from 'types';

import GenericSummary from './GenericSummary';
import {loadSummaryData} from './utils';

const initialState = {
  error: '',
};

const reducer = (draft, action) => {
  switch (action.type) {
    case 'ERROR': {
      draft.error = action.payload;
      break;
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
};

const SubmissionSummary = ({
  form,
  submission,
  processingError = '',
  onConfirm,
  onClearProcessingErrors,
  onDestroySession,
}) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const navigate = useNavigate();
  const intl = useIntl();
  const analyticsToolsConfig = useContext(AnalyticsToolsConfigContext);

  const refreshedSubmission = useRefreshSubmission(submission);

  const paymentInfo = refreshedSubmission.payment;

  const {
    loading,
    value: summaryData,
    error,
  } = useAsync(async () => {
    const submissionUrl = new URL(refreshedSubmission.url);
    return await loadSummaryData(submissionUrl);
  }, [refreshedSubmission.url]);

  if (error) {
    console.error(error);
  }

  const onSubmit = async statementValues => {
    if (refreshedSubmission.submissionAllowed !== SUBMISSION_ALLOWED.yes) return;
    try {
      const {statusUrl} = await completeSubmission(refreshedSubmission, statementValues);
      onConfirm(statusUrl);
    } catch (e) {
      dispatch({type: 'ERROR', payload: e.message});
    }
  };

  const getPreviousPage = () => {
    const previousStepIndex = findPreviousApplicableStep(form.steps.length, submission);
    const prevStepSlug = form.steps[previousStepIndex]?.slug;
    const navigateTo = prevStepSlug ? `/stap/${prevStepSlug}` : '/';
    return navigateTo;
  };

  const onPrevPage = event => {
    event.preventDefault();
    onClearProcessingErrors();

    navigate(getPreviousPage());
  };

  const completeSubmission = async (submission, statementValues) => {
    const response = await post(`${submission.url}/_complete`, statementValues);
    if (!response.ok) {
      console.error(response.data);
      // TODO Specific error for each type of invalid data?
      throw new Error('InvalidSubmissionData');
    } else {
      return response.data;
    }
  };

  const pageTitle = intl.formatMessage({
    description: 'Summary page title',
    defaultMessage: 'Check and confirm',
  });
  useTitle(pageTitle);

  const getErrors = () => {
    let errors = [];
    if (processingError) errors.push(processingError);
    if (state.error) errors.push(state.error);
    return errors;
  };

  const showExtraToolbar =
    refreshedSubmission.isAuthenticated || analyticsToolsConfig.enableGovmetricAnalytics;

  return (
    <LiteralsProvider literals={form.literals}>
      <GenericSummary
        title={
          <FormattedMessage
            description="Check overview and confirm"
            defaultMessage="Check and confirm"
          />
        }
        submissionAllowed={refreshedSubmission.submissionAllowed}
        summaryData={summaryData}
        showPaymentInformation={paymentInfo.isRequired && !paymentInfo.hasPaid}
        showExtraToolbar={showExtraToolbar}
        amountToPay={paymentInfo.amount}
        editStepText={form.literals.changeText.resolved}
        isLoading={loading}
        isAuthenticated={refreshedSubmission.isAuthenticated}
        errors={getErrors()}
        prevPage={getPreviousPage()}
        onSubmit={onSubmit}
        onPrevPage={onPrevPage}
        onDestroySession={onDestroySession}
      />
    </LiteralsProvider>
  );
};

SubmissionSummary.propTypes = {
  form: Types.Form.isRequired,
  submission: Types.Submission.isRequired,
  processingError: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onClearProcessingErrors: PropTypes.func.isRequired,
  onDestroySession: PropTypes.func.isRequired,
};

export default SubmissionSummary;
