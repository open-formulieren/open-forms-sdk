import {FormioForm, LoadingIndicator} from '@open-formulieren/formio-renderer';
import type {FormStateRef} from '@open-formulieren/formio-renderer/components/FormioForm.js';
import type {JSONObject} from '@open-formulieren/types';
import type {FormikErrors, FormikValues} from 'formik';
import {useQueryState} from 'nuqs';
import {useContext, useRef, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {useLocation, useNavigate, useNavigation} from 'react-router';
import {useAsync} from 'react-use';

import {ConfigContext} from '@/Context';
import {destroy, get} from '@/api';
import {useDebugContext} from '@/components/AppDebug';
import Body from '@/components/Body';
import Card, {CardTitle} from '@/components/Card';
import ErrorMessage from '@/components/Errors/ErrorMessage';
import FormMaximumSubmissionsError from '@/components/Errors/FormMaximumSubmissionsError';
import FormStepNavigation from '@/components/FormStep/FormStepNavigation';
import {LiteralsProvider} from '@/components/Literal';
import StatementCheckbox from '@/components/StatementCheckboxes/StatementCheckbox';
import {assertSubmission} from '@/components/SubmissionProvider';
import ValidationErrors from '@/components/Summary/ValidationErrors';
import {INITIAL_DATA_PARAM} from '@/components/constants';
import type {FormStep} from '@/data/forms';
import {saveStepData} from '@/data/submission-steps';
import {
  type Submission,
  type SubmissionCompleteBody,
  completeSubmission,
  createSubmission,
} from '@/data/submissions';
import {ValidationError} from '@/errors';
import useFormContext from '@/hooks/useFormContext';

/**
 * Route component for the step in a single step form.
 *
 * The core functionality is:
 *   - render the Formio definition specified from the backend
 *   - render the statement checkboxes (privacy policy and statement of truth)
 *   - validate user input
 *   - submitting the user input to the server
 *   - create submission and submission step
 *   - proceed to the final step (confirmation page)
 */
const SingleFormStepNewRenderer: React.FC = () => {
  const formRef = useRef<FormStateRef>(null);
  // keep track of the current values in a mutable ref to avoid re-renders when values
  // change, which take time and can produce 'lag'. We typically only need to read the
  // values in callbacks at this component level (in the tree), while the `FormioForm`
  // component itself is responsible for managing the state.
  const valuesRef = useRef<JSONObject | null>(null);

  const {state: navigationState} = useNavigation();
  const location = useLocation();
  const navigate = useNavigate();
  const form = useFormContext();
  const {setStepValues: setDebugStepValues} = useDebugContext();
  const [initialDataReference] = useQueryState(INITIAL_DATA_PARAM);
  const {baseUrl, clientBaseUrl} = useContext(ConfigContext);
  const [submissionState, setSubmissionState] = useState<Submission | null>(null);
  const [submitErrors, setSubmitErrors] = useState<string | FormikErrors<JSONObject> | null>(null);
  const [showStatementWarnings, setShowStatementWarnings] = useState<boolean>(false);
  const [stepCanBesubmitted, setStepCanBesubmitted] = useState<boolean>(false);
  const [statementValues, setStatementValues] = useState<SubmissionCompleteBody>({
    privacyPolicyAccepted: false,
    statementOfTruthAccepted: false,
  });

  // single page forms have exactly one step
  const formStep = form.steps[0];
  const formStepUrl = formStep.url;

  // retrieve the form step in order to obtain the components
  const {
    loading: formStepLoading,
    value: formStepData,
    error,
  } = useAsync(async () => await get<FormStep>(formStepUrl), [formStepUrl]);

  if (error) {
    throw error;
  }

  const isLoading = formStepLoading || navigationState !== 'idle';
  const components = formStepData?.configuration.components ?? [];

  const validateStatementsInStep = (values: SubmissionCompleteBody) => {
    const hasInvalidRequired = form.submissionStatementsConfiguration.some(
      info => info.validate?.required && values[info.key] === false
    );

    setStepCanBesubmitted(!hasInvalidRequired);
  };

  const onSubmitHandler = async (values: FormikValues) => {
    // single step form should be anonymous
    if (form.loginOptions.length !== 0) {
      throw new Error('Login on single step forms is not supported.');
    }

    let currentSubmission = submissionState;
    // create the submission if it doesn't exist
    if (currentSubmission === null) {
      const newSubmission = await createSubmission(
        baseUrl,
        form,
        clientBaseUrl,
        null,
        initialDataReference ?? '',
        true
      );

      assertSubmission(newSubmission);
      setSubmissionState(newSubmission);
      currentSubmission = newSubmission;
    }

    // the submission exists, move to the next steps
    // create the submission step
    try {
      await saveStepData(currentSubmission.steps[0].url, values);
    } catch (error: unknown) {
      // rethrow what we can't handle
      if (!(error instanceof ValidationError)) {
        throw error;
      }
      const {initialErrors: serverErrors} = error.asFormikProps();
      formRef.current?.updateErrors(serverErrors);
    }

    // complete the submission
    let statusUrl = undefined;
    try {
      statusUrl = (await completeSubmission(baseUrl, currentSubmission.id, statementValues))
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

    // navigate to the confirmation page
    if (statusUrl) {
      navigate('/bevestiging', {
        state: {statusUrl: statusUrl, submission: currentSubmission},
      });
    }
  };

  const onDestroySession = async () => {
    if (!submissionState) return;
    await destroy(`${baseUrl}authentication/${submissionState.id}/session`);

    setSubmissionState(null);
    navigate('/sp');
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
        <ValidationErrors errors={submitErrors} summaryData={[]} />
      </>
    ));

  const errorMessages: React.ReactNode[] = [location.state?.errorMessage, submitError].filter(
    Boolean
  );

  return (
    <LiteralsProvider literals={formStep.literals}>
      <Card title={form.name} mobileHeaderHidden>
        {form.submissionLimitReached && <FormMaximumSubmissionsError />}
        {form.explanationTemplate && (
          <Body
            component="div"
            modifiers={['wysiwyg']}
            dangerouslySetInnerHTML={{__html: form.explanationTemplate}}
          />
        )}
        <CardTitle title={formStepData?.name || ''} headingType="subtitle" padded />
        {isLoading && <LoadingIndicator position="center" />}

        {errorMessages.map((error, index) => (
          <div className="openforms-card__alert" key={`error-${index}`}>
            <ErrorMessage>{error}</ErrorMessage>
          </div>
        ))}

        {!isLoading && (
          <FormioForm
            ref={formRef}
            components={components}
            values={{privacyPolicyAccepted: false, statementOfTruthAccepted: false}}
            onChange={values => {
              const updatedStatementValues = {
                privacyPolicyAccepted: values.privacyPolicyAccepted as boolean,
                statementOfTruthAccepted: values.statementOfTruthAccepted as boolean,
              };

              valuesRef.current = {
                ...values,
                ...updatedStatementValues,
              };

              setStatementValues(updatedStatementValues);
              validateStatementsInStep(updatedStatementValues);
              setDebugStepValues(values, false);
            }}
            onSubmit={async values => {
              setShowStatementWarnings(true);
              onSubmitHandler(values);
            }}
            requiredFieldsWithAsterisk={form.requiredFieldsWithAsterisk}
          >
            <div className="openforms-statement-checkboxes openforms-statement-checkboxes--single-step-form">
              {form.submissionStatementsConfiguration.map((info, index) => (
                <StatementCheckbox
                  key={`${index}-${info.key}`}
                  configuration={info}
                  showWarning={
                    showStatementWarnings && info.validate?.required
                      ? statementValues[info.key] === false
                      : false
                  }
                />
              ))}
            </div>

            <FormStepNavigation
              submissionAllowed="yes"
              isLastStep
              hideAbortButton
              stepSubmissionAllowed={stepCanBesubmitted}
              // for now the logic call is not made, see if there is a case where this
              // would be needed
              isCheckingLogic={false}
              previousPage={undefined}
              isAuthenticated={false}
              onDestroySession={onDestroySession}
              onFormSave={undefined}
            />
          </FormioForm>
        )}
      </Card>
    </LiteralsProvider>
  );
};

export default SingleFormStepNewRenderer;
