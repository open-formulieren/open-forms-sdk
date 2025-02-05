import {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useLocation, useNavigate} from 'react-router';
import {useAsync} from 'react-use';

import {post} from 'api';
import {LiteralsProvider} from 'components/Literal';
import {useSubmissionContext} from 'components/SubmissionProvider';
import {SUBMISSION_ALLOWED} from 'components/constants';
import {findPreviousApplicableStep} from 'components/utils';
import {ValidationError} from 'errors';
import useFormContext from 'hooks/useFormContext';
import useRefreshSubmission from 'hooks/useRefreshSubmission';
import useTitle from 'hooks/useTitle';

import GenericSummary from './GenericSummary';
import ValidationErrors from './ValidationErrors';
import {loadSummaryData} from './data';

const completeSubmission = async (submission, statementValues) => {
  const response = await post(`${submission.url}/_complete`, statementValues);
  const {statusUrl} = response.data;
  return statusUrl;
};

const SubmissionSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const form = useFormContext();
  const {submission, onDestroySession, removeSubmissionId} = useSubmissionContext();
  const refreshedSubmission = useRefreshSubmission(submission);

  const [submitErrors, setSubmitErrors] = useState(null);

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
      statusUrl = await completeSubmission(refreshedSubmission, statementValues);
    } catch (e) {
      if (e instanceof ValidationError) {
        const {initialErrors} = e.asFormikProps();
        setSubmitErrors(initialErrors);
      } else {
        setSubmitErrors(e.message);
      }
      return;
    }

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

  const submitError =
    submitErrors &&
    (typeof submitErrors === 'string' ? (
      submitErrors
    ) : (
      <>
        <FormattedMessage
          description="Summary page generic validation error message"
          defaultMessage="There are problems with the submitted data."
        />
        <ValidationErrors errors={submitErrors} summaryData={summaryData} />
      </>
    ));

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

SubmissionSummary.propTypes = {};

export default SubmissionSummary;
