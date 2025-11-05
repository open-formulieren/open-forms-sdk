import {FormioForm} from '@open-formulieren/formio-renderer';
import type {FormStateRef} from '@open-formulieren/formio-renderer/components/FormioForm.js';
import type {JSONObject, JSONValue} from '@open-formulieren/formio-renderer/types.js';
import type {ValidatePluginCallback} from '@open-formulieren/formio-renderer/validationSchema.js';
import type {AnyComponentSchema} from '@open-formulieren/types';
import isEqual from 'fast-deep-equal';
import {useFormikContext} from 'formik';
import {useCallback, useContext, useRef, useState} from 'react';
import {useNavigate, useNavigation} from 'react-router';

import {ConfigContext} from '@/Context';
import {get} from '@/api';
import {useDebugContext} from '@/components/AppDebug';
import Card, {CardTitle} from '@/components/Card';
import {getCosignStatus as getCosignStatus_} from '@/components/CoSign';
import FormNavigation, {StepSubmitButton} from '@/components/FormNavigation';
import type {FormNavigationProps} from '@/components/FormNavigation/FormNavigation';
import {LiteralsProvider} from '@/components/Literal';
import Loader from '@/components/Loader';
import {getLoginUrl} from '@/components/LoginOptions/utils';
import PreviousLink from '@/components/PreviousLink';
import {assertSubmission, useSubmissionContext} from '@/components/SubmissionProvider';
import FormStepSaveModal from '@/components/modals/FormStepSaveModal';
import {autoCompleteAddress} from '@/data/geo';
import {type SubmissionStep, saveStepData} from '@/data/submission-steps';
import type {Submission} from '@/data/submissions';
import {validateValue} from '@/data/validation';
import {ValidationError} from '@/errors';
import useFormContext from '@/hooks/useFormContext';

import Progress from './Progress';
import {useCheckStepLogic, useLoadStep, useResolveStepUrl} from './hooks';
import {StepState} from './utils';

/**
 * Route component for a single step in the form.
 *
 * The core functionality is:
 *   - rendering the Formio definition specified from the backend
 *   - reacting to user input changes by firing backend logic check calls
 *   - submitting the user input to the server and proceed to the next step
 */
const FormStepNewRenderer: React.FC = () => {
  const {state: navigationState} = useNavigation();
  const navigate = useNavigate();
  const {baseUrl} = useContext(ConfigContext);
  const form = useFormContext();
  const {setStepValues: setDebugStepValues} = useDebugContext();
  const {submission, onSubmissionObtained, onDestroySession} = useSubmissionContext();
  assertSubmission(submission);

  const [stepSaveModalOpen, setStepSaveModalOpen] = useState<boolean>(false);

  const [components, setComponents] = useState<AnyComponentSchema[]>([]);
  const formRef = useRef<FormStateRef>(null);
  // keep track of the current values in a mutable ref to avoid re-renders when values
  // change, which take time and can produce 'lag'. We typically only need to read the
  // values in callbacks at this component level (in the tree), while the `FormioForm`
  // component itself is responsible for managing the state.
  const valuesRef = useRef<JSONObject | null>(null);
  const onStepLoaded = useCallback(
    (step: SubmissionStep) => {
      valuesRef.current = step.data;
      setComponents(step.formStep.configuration.components);
      setDebugStepValues(step.data, true);
    },
    [setDebugStepValues]
  );

  const {formStep, submissionStep: sparseStep} = useResolveStepUrl(form, submission);
  const state = useLoadStep(sparseStep.url, onStepLoaded);

  const {id: submissionId} = submission;
  const validatePluginCallback = useCallback(
    async (plugin: string, value: JSONValue) => {
      const {isValid, messages} = await validateValue(baseUrl, plugin, submissionId, value);
      const result: Awaited<ReturnType<ValidatePluginCallback>> = isValid
        ? {valid: true}
        : {valid: false, messages};
      return result;
    },
    [baseUrl, submissionId]
  );
  const addressAutoComplete = useCallback(
    async (postcode: string, houseNumber: string) =>
      await autoCompleteAddress(baseUrl, postcode, houseNumber),
    [baseUrl]
  );
  const getCosignStatus = useCallback(
    async () => await getCosignStatus_(baseUrl, submissionId),
    [baseUrl, submissionId]
  );
  const getLoginOption = useCallback(
    async (authPlugin: string) => {
      const loginOption = form.loginOptions.find(opt => opt.identifier === authPlugin);

      if (!loginOption) return null;
      loginOption.url = getLoginUrl(loginOption, {coSignSubmission: submissionId});
      return loginOption;
    },
    [form, submissionId]
  );

  /**
   * Process the logic check result.
   *
   * The updated components from the logic check result (new) form configuration is
   * compared (deep-equality) against the current components/form definition in the
   * state. Only if there are differences is the state updated, which drives updating
   * the rendered form via `FormioForm`.
   *
   * Similarly, the backend replies only with a diff of data to update, so we only need
   * to update the values if there's actually any work to do.
   */
  const onLogicCheckResult = (updatedSubmission: Submission, updatedStep: SubmissionStep) => {
    onSubmissionObtained(updatedSubmission);
    // update the components that may be updated by backend logic
    const newComponents = updatedStep.formStep.configuration.components;
    if (!isEqual(newComponents, components)) {
      setComponents(updatedStep.formStep.configuration.components);
    }

    const updatedValues = updatedStep.data;
    if (updatedValues && Object.keys(updatedValues).length) {
      formRef.current?.updateValues(updatedValues);
    }
  };
  const {scheduleLogicCheck, inProgress: logicCheckInProgress} = useCheckStepLogic(
    sparseStep.url,
    valuesRef,
    onLogicCheckResult
  );

  if (state.error) throw state.error;
  const step = state.value;

  const isLoading = state.loading || navigationState !== 'idle';

  // check our current position in the form
  const stepState = new StepState(form, submission, formStep);
  const {previousTo, isLastStep} = stepState;

  return (
    <LiteralsProvider literals={formStep.literals}>
      <Card title={form.name} mobileHeaderHidden>
        <PreviousLink to={previousTo} position="start" />
        <Progress form={form} submission={submission} currentStep={sparseStep} />
        <CardTitle title={sparseStep.name} headingType="subtitle" padded />

        {isLoading && <Loader modifiers={['centered']} />}

        {!isLoading && (
          <FormioForm
            ref={formRef}
            components={components}
            values={step!.data ?? undefined}
            onChange={values => {
              valuesRef.current = values;
              scheduleLogicCheck();
              setDebugStepValues(values, false);
            }}
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

              // we must use the refreshed submission to get the update applicable states
              const {nextTo} = new StepState(form, updatedSubmission, formStep);
              navigate(nextTo);
            }}
            requiredFieldsWithAsterisk={form.requiredFieldsWithAsterisk}
            validatePluginCallback={validatePluginCallback}
            componentParameters={{
              addressNL: {addressAutoComplete},
              coSign: {getCosignStatus, getLoginOption},
            }}
          >
            <FormStepNavigation
              submissionAllowed={submission.submissionAllowed}
              isLastStep={isLastStep}
              isCheckingLogic={logicCheckInProgress}
              onFormSave={
                form.suspensionAllowed
                  ? event => {
                      event.preventDefault();
                      setStepSaveModalOpen(true);
                    }
                  : undefined
              }
              previousPage={previousTo}
              isAuthenticated={submission.isAuthenticated}
              onDestroySession={onDestroySession}
            />
          </FormioForm>
        )}
      </Card>

      <FormStepSaveModal
        isOpen={stepSaveModalOpen}
        closeModal={() => setStepSaveModalOpen(false)}
        onSaveConfirm={async () => {
          const values = valuesRef.current;
          if (values === null) throw new Error('Cannot save non-existent values');
          // XXX: check what happens if invalidly shaped data is submitted during save!
          await saveStepData(sparseStep.url, values, {skipValidation: true});
        }}
        onSessionDestroyed={onDestroySession}
        suspendFormUrl={`${submission.url}/_suspend`}
        suspendFormUrlLifetime={form.resumeLinkLifetime}
      />
    </LiteralsProvider>
  );
};

interface FormStepNavigationProps
  extends Pick<
    FormNavigationProps,
    'onFormSave' | 'previousPage' | 'isAuthenticated' | 'onDestroySession'
  > {
  submissionAllowed: Submission['submissionAllowed'];
  isLastStep: boolean;
  isCheckingLogic: boolean;
}

const FormStepNavigation: React.FC<FormStepNavigationProps> = ({
  submissionAllowed,
  isLastStep,
  isCheckingLogic,
  onFormSave,
  previousPage,
  isAuthenticated,
  onDestroySession,
}) => {
  const {isValid, isValidating, isSubmitting} = useFormikContext<JSONObject>();
  return (
    <FormNavigation
      submitButton={
        <StepSubmitButton
          canSubmitForm={submissionAllowed}
          canSubmitStep={isValid && !isValidating && !isSubmitting}
          isLastStep={isLastStep}
          isCheckingLogic={isCheckingLogic || isSubmitting}
        />
      }
      onFormSave={onFormSave}
      previousPage={previousPage}
      isAuthenticated={isAuthenticated}
      onDestroySession={onDestroySession}
    />
  );
};

export default FormStepNewRenderer;
