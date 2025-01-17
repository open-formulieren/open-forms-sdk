import PropTypes from 'prop-types';
import {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAsync} from 'react-use';

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

const SubmissionSummary = ({onConfirm}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const form = useFormContext();
  const {submission, onDestroySession, removeSubmissionId} = useSubmissionContext();
  const refreshedSubmission = useRefreshSubmission(submission);

  const [submitError, setSubmitError] = useState('');

  const pageTitle = intl.formatMessage({
    description: 'Summary page title',
    defaultMessage: 'Check and confirm',
  });
  useTitle(pageTitle, form.name);

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
    let statusUrl;
    try {
      const responseData = await completeSubmission(refreshedSubmission, statementValues);
      statusUrl = responseData.statusUrl;
    } catch (e) {
      setSubmitError(e.message);
      return;
    }

    onConfirm();

    // the completion went through, proceed to redirect to the next page and set up
    // the necessary state.
    const needsPayment =
      refreshedSubmission.payment.isRequired && !refreshedSubmission.payment.hasPaid;
    const nextUrl = needsPayment ? '/betalen' : '/bevestiging';
    removeSubmissionId();
    navigate(nextUrl, {
      state: {
        submission: refreshedSubmission,
        statusUrl,
      },
    });
  };

  const getPreviousPage = () => {
    const previousStepIndex = findPreviousApplicableStep(form.steps.length, submission);
    const prevStepSlug = form.steps[previousStepIndex]?.slug;
    const navigateTo = prevStepSlug ? `/stap/${prevStepSlug}` : '/';
    return navigateTo;
  };

  const onPrevPage = event => {
    event.preventDefault();
    navigate(getPreviousPage());
  };

  const errorMessages = [location.state?.errorMessage, submitError].filter(Boolean);

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
        errors={errorMessages}
        prevPage={getPreviousPage()}
        onSubmit={onSubmit}
        onPrevPage={onPrevPage}
        onDestroySession={onDestroySession}
      />
    </LiteralsProvider>
  );
};

SubmissionSummary.propTypes = {
  onConfirm: PropTypes.func.isRequired,
};

export default SubmissionSummary;
