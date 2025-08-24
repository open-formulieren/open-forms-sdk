import {FormioForm} from '@open-formulieren/formio-renderer';
import type {FormStateRef} from '@open-formulieren/formio-renderer/components/FormioForm.js';
import {useId, useRef} from 'react';
import {useNavigate, useNavigation, useParams} from 'react-router';
import useAsync, {AsyncState} from 'react-use/esm/useAsync';

import {LiteralsProvider} from 'components/Literal';
import SummaryProgress from 'components/SummaryProgress';
import {findNextApplicableStep, findPreviousApplicableStep, isLastStep} from 'components/utils';

import {get} from '@/api';
import Card, {CardTitle} from '@/components/Card';
import FormNavigation, {StepSubmitButton} from '@/components/FormNavigation';
import Loader from '@/components/Loader';
import PreviousLink from '@/components/PreviousLink';
import {assertSubmission, useSubmissionContext} from '@/components/SubmissionProvider';
import type {Form, MinimalFormStep} from '@/data/forms';
import {type SubmissionStep, saveStepData} from '@/data/submission-steps';
import type {NestedSubmissionStep, Submission} from '@/data/submissions';
import {ValidationError} from '@/errors';
import useFormContext from '@/hooks/useFormContext';

interface ResolvedStep {
  /**
   * The step definition from the form containing metadata.
   */
  formStep: MinimalFormStep;
  /**
   * A minimal representation of the form step in the context of the current submission.
   */
  submissionStep: NestedSubmissionStep;
}

const useResolveStepUrl = (form: Form, submission: Submission): ResolvedStep => {
  const {step: slug} = useParams();
  // look up the form step via slug so that we can obtain the submission step
  const formStep = form.steps.find(s => s.slug === slug);
  if (!formStep) throw new Error(`No step with slug ${slug} found in form!`);
  const submissionStep = submission.steps.find(s => s.formStep === formStep.url);
  // the backend ensures there's always a matching submission step for a form step
  return {
    formStep,
    submissionStep: submissionStep!,
  };
};

/**
 * Retrieve the submission step from the backend.
 *
 * Any non-success HTTP status codes throw - these are available in the `error` property
 * of the return state.
 */
const useLoadStep = (resourceUrl: string): AsyncState<SubmissionStep> => {
  const state = useAsync(async () => {
    const data = await get<SubmissionStep>(resourceUrl);
    window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
    return data!;
  }, [resourceUrl]);
  return state;
};

const FormStepNewRenderer: React.FC = () => {
  const formId = useId();
  const {state: navigationState} = useNavigation();
  const navigate = useNavigate();
  const form = useFormContext();
  const {submission, onSubmissionObtained, onDestroySession} = useSubmissionContext();
  assertSubmission(submission);

  const formRef = useRef<FormStateRef>(null);

  const {formStep, submissionStep: sparseStep} = useResolveStepUrl(form, submission);
  const state = useLoadStep(sparseStep.url);
  if (state.error) throw state.error;
  const step = state.value;

  const isLoading = state.loading || navigationState !== 'idle';

  // check our current position in the form
  // TODO: this can probably be calculated once and have an object return all the
  // necessary information
  const previousTo = getPreviousTo(form, submission, formStep);
  const currentStepIndex = form.steps.indexOf(formStep);
  const currentStepIsLastStep = isLastStep(currentStepIndex, submission);

  return (
    <LiteralsProvider literals={formStep.literals}>
      <Card title={form.name} mobileHeaderHidden>
        <PreviousLink to={previousTo} position="start" />
        <Progress form={form} submission={submission} currentStep={sparseStep} />
        <CardTitle title={sparseStep.name} headingType="subtitle" padded />

        {isLoading && <Loader modifiers={['centered']} />}

        {!isLoading && (
          <>
            <FormioForm
              ref={formRef}
              components={step!.formStep.configuration.components}
              onSubmit={async values => {
                try {
                  // XXX: do we still need the validate endpoint? Perhaps this could use
                  // a header for the PUT endpoint instead?
                  await saveStepData(sparseStep.url, values, {skipValidation: false});
                } catch (error: unknown) {
                  // rethrow what we can't handle
                  if (!(error instanceof ValidationError)) {
                    throw error;
                  }

                  const {initialErrors: serverErrors} = error.asFormikProps();
                  formRef.current?.updateErrors(serverErrors);
                  return;
                }

                // refresh the submission
                const updatedSubmission = (await get<Submission>(submission.url))!;
                onSubmissionObtained(updatedSubmission);

                // navigate to the next page (either the next step or the overview)
                // it's possible the `nextStepIndex` goes out of bounds, in that case
                // we must navigate to the overview page.
                // FIXME: this looks inconsistent with `currentStepIsLastStep`, something
                // is off here...
                const nextStepIndex = findNextApplicableStep(currentStepIndex, updatedSubmission);
                const nextStepSlug = form.steps[nextStepIndex]?.slug;
                navigate(nextStepSlug ? `/stap/${nextStepSlug}` : '/overzicht');
              }}
              requiredFieldsWithAsterisk={form.requiredFieldsWithAsterisk}
              id={formId}
            />
            <FormNavigation
              submitButton={
                <StepSubmitButton
                  form={formId}
                  canSubmitForm={submission.submissionAllowed}
                  canSubmitStep
                  isLastStep={currentStepIsLastStep}
                  isCheckingLogic={false}
                />
              }
              previousPage={previousTo}
              isAuthenticated={submission.isAuthenticated}
              onDestroySession={onDestroySession}
            />
          </>
        )}
      </Card>
    </LiteralsProvider>
  );
};

interface ProgressProps {
  form: Form;
  submission: Submission;
  currentStep: NestedSubmissionStep;
}

const Progress: React.FC<ProgressProps> = ({form, submission, currentStep}) => {
  if (!form.showSummaryProgress) return null;
  const applicableSteps = submission.steps.filter(step => step.isApplicable === true);
  const currentSubmissionStepIndex = applicableSteps.indexOf(currentStep);
  return (
    <SummaryProgress current={currentSubmissionStepIndex + 1} total={applicableSteps.length} />
  );
};

const getPreviousTo = (
  form: Form,
  submission: Submission,
  currentStep: MinimalFormStep
): string => {
  const currentStepIndex = form.steps.indexOf(currentStep);
  const previousStepIndex = findPreviousApplicableStep(currentStepIndex, submission);

  const prevStepSlug = form.steps[previousStepIndex]?.slug;
  return prevStepSlug ? `/stap/${prevStepSlug}` : '/';
};

export default FormStepNewRenderer;
