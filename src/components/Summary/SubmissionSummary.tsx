import type {JSONObject} from '@open-formulieren/types';
import type {FormikErrors} from 'formik';
import {useContext, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useLocation, useNavigate} from 'react-router';

import {ConfigContext} from '@/Context';
import {StepState} from '@/components/FormStep/utils';
import {LiteralsProvider} from '@/components/Literal';
import {assertSubmission, useSubmissionContext} from '@/components/SubmissionProvider';
import type {SubmissionStatementConfiguration} from '@/data/forms';
import {completeSubmission} from '@/data/submissions';
import {ValidationError} from '@/errors';
import useFormContext from '@/hooks/useFormContext';
import useRefreshSubmission from '@/hooks/useRefreshSubmission';
import useTitle from '@/hooks/useTitle';

import GenericSummary from './GenericSummary';
import ValidationErrors from './ValidationErrors';
import {useLoadSummaryData} from './hooks';

const SubmissionSummary: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const {baseUrl} = useContext(ConfigContext);
  const form = useFormContext();
  const {submission, onDestroySession, removeSubmissionId} = useSubmissionContext();
  assertSubmission(submission);
  const refreshedSubmission = useRefreshSubmission(submission);

  const [submitErrors, setSubmitErrors] = useState<string | FormikErrors<JSONObject> | null>(null);

  const pageTitle = intl.formatMessage({
    description: 'Summary page title',
    defaultMessage: 'Check and confirm',
  });
  useTitle(pageTitle, form.name);

  const paymentInfo = refreshedSubmission.payment;

  const summaryDataState = useLoadSummaryData(refreshedSubmission);
  // throw to nearest error boundary
  if (summaryDataState.error) throw summaryDataState.error;
  const summaryData = summaryDataState.value || [];

  const onSubmit = async (
    statementValues: Record<SubmissionStatementConfiguration['key'], boolean>
  ) => {
    if (refreshedSubmission.submissionAllowed !== 'yes') return;

    let statusUrl: string;
    try {
      statusUrl = (await completeSubmission(baseUrl, refreshedSubmission.id, statementValues))
        .statusUrl;
    } catch (e) {
      if (e instanceof ValidationError) {
        const {initialErrors} = e.asFormikProps();
        setSubmitErrors(initialErrors);
      } else {
        setSubmitErrors(e.message as string);
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

  const errorMessages: React.ReactNode[] = [location.state?.errorMessage, submitError].filter(
    Boolean
  );

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
        isLoading={summaryDataState.loading}
        summaryData={summaryData}
        // payment props
        {...(paymentInfo.isRequired && !paymentInfo.hasPaid
          ? {
              showPaymentInformation: true,
              amountToPay: paymentInfo.amount,
            }
          : {showPaymentInformation: false})}
        editStepText={form.literals.changeText.resolved}
        isAuthenticated={refreshedSubmission.isAuthenticated}
        errors={errorMessages}
        prevPage={StepState.getLastApplicableStepTo(form, submission)}
        onSubmit={onSubmit}
        onDestroySession={onDestroySession}
      />
    </LiteralsProvider>
  );
};

export default SubmissionSummary;
