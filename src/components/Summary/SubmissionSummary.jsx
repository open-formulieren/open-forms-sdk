import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';
import {useNavigate} from 'react-router-dom';
import {useAsync} from 'react-use';
import {useImmerReducer} from 'use-immer';

import {post} from 'api';
import {useSubmissionContext} from 'components/Form';
import {LiteralsProvider} from 'components/Literal';
import {SUBMISSION_ALLOWED} from 'components/constants';
import {findPreviousApplicableStep} from 'components/utils';
import useFormContext from 'hooks/useFormContext';
import useRefreshSubmission from 'hooks/useRefreshSubmission';
import useTitle from 'hooks/useTitle';

import GenericSummary from './GenericSummary';
import {loadSummaryData} from './utils';

const initialState = {
  error: '',
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

const SubmissionSummary = ({processingError = '', onConfirm, onClearProcessingErrors}) => {
  const form = useFormContext();
  const {submission, onDestroySession} = useSubmissionContext();

  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const navigate = useNavigate();
  const intl = useIntl();

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
  // throw to nearest error boundary
  if (error) throw error;

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

  const pageTitle = intl.formatMessage({
    description: 'Summary page title',
    defaultMessage: 'Check and confirm',
  });
  useTitle(pageTitle, form.name);

  const getErrors = () => {
    let errors = [];
    if (processingError) errors.push(processingError);
    if (state.error) errors.push(state.error);
    return errors;
  };

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
  processingError: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onClearProcessingErrors: PropTypes.func.isRequired,
};

export default SubmissionSummary;
