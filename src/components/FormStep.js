/**
 * Render a single form step, as part of a started submission for a form.
 *
 * Functional requirements:
 *
 *   - the backend form configuration must be displayed when a new step is loaded
 *   - users must be able to fill out the form step
 *   - whenever there is user input, this requires to be validated/checked by both
 *     frontend and backend
 *   - the default reaction for (new) user input is blocking the submit button
 *   - as long as there is any unvalidated/unchecked input, the submit button must remain
 *     blocked
 *   - while the submit button is blocked, we run client-side validation. if that fails,
 *     the submit button remains blocked
 *   - user input schedules a backend logic check. after this is completed, the submit
 *     button state is updated with the result from the backend
 *   - backend logic checks are cancelled/debounced on new user input
 *   - backend logic checks are skipped if the input data is empty or unchanged from the
 *     last check that did execute
 *   - on quick user input changes with a net zero result, the submit button must be
 *     restored to its original state
 *
 */
import React, {useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { useImmerReducer } from 'use-immer';
import useAsync from 'react-use/esm/useAsync';

import hooks from '../formio/hooks';

import { get, post, put } from 'api';
import Card from 'components/Card';
import FormIOWrapper from 'components/FormIOWrapper';
import FormStepDebug from 'components/FormStepDebug';
import Loader from 'components/Loader';
import FormStepSaveModal from 'components/modals/FormStepSaveModal';
import {findPreviousApplicableStep, isLastStep} from 'components/utils';
import ButtonsToolbar from 'components/ButtonsToolbar';
import {ConfigContext, FormioTranslations} from 'Context';
import { ValidationError } from 'errors';
import {PREFIX}  from 'formio/constants';
import Types from 'types';
import {DEBUG} from 'utils';

const LOGIC_CHECK_DEBOUNCE = 1000; // in ms - once the user stops

const submitStepData = async (stepUrl, data) => {
  const stepDataResponse = await put(stepUrl, {data});
  if (!stepDataResponse.ok) {
    if (stepDataResponse.status === 400) {
      throw new ValidationError(
        'Backend did not validate the data',
        stepDataResponse.data,
      );
    } else {
      throw new Error(`Backend responded with HTTP ${stepDataResponse.status}`);
    }
  }
  return stepDataResponse;
};

const getCustomValidationHook = (stepUrl, onBackendError) => {
  const customValidation = async (data, next) => {
    const PREFIX = 'data';

    const validateUrl = `${stepUrl}/validate`;
    let validateResponse;
    try {
      validateResponse = await post(validateUrl, data);
    } catch(error) {
      onBackendError(error);
      next([{path: '', message: error.detail, code: error.code}]);
      return;
    }

    // process the errors
    if (validateResponse.status === 400) {
      const invalidParams = validateResponse.data.invalidParams.filter(
        param => param.name.startsWith(`${PREFIX}.`)
      );
      const errors = invalidParams.map(({name, code, reason}) => ({
        path: name.replace(`${PREFIX}.`, '', 1),
        message: reason,
        code: code,
      }));
      next(errors);
      return;
    }
    if (!validateResponse.ok) {
      console.warn(`Unexpected HTTP ${validateResponse.status}`)
    }
    next();
  };
  return customValidation;
};

const doLogicCheck = async (stepUrl, data, invalidKeys=[], signal) => {
  const url = `${stepUrl}/_check_logic`;
  // filter out the invalid keys so we only send valid (client-side) input data to the
  // backend to evaluate logic.
  let dataForLogicCheck = invalidKeys.length ? omit(data, invalidKeys) : data;
  const stepDetailData = await post(url, {data: dataForLogicCheck}, signal);
  if (!stepDetailData.ok) {
    throw new Error('Invalid response'); // TODO -> proper error & use ErrorBoundary
  }

  // Re-add any invalid data to the step data that was not sent for the logic check. Otherwise, any previously saved
  // data in the step will overwrite the user input
  Object.assign(stepDetailData.data.step.data, data);
  return stepDetailData.data;
};

class AbortedLogicCheck extends Error {
  constructor(message='', ...args) {
    super(message, ...args);
    this.name = 'AbortError';  // aligns with fetch Error.name that's thrown on abort
  }
}

const initialState = {
  configuration: null,
  backendData: {},
  canSubmit: false,
  logicChecking: false,
  isFormSaveModalOpen: false,
  isNavigating: false,
  error: null,
};

const reducer = (draft, action) => {
  switch(action.type) {
    case 'STEP_LOADED': {
      const {data, formStep: {configuration}, canSubmit} = action.payload;
      draft.configuration = configuration;
      draft.backendData = data;
      draft.canSubmit = canSubmit;
      draft.logicChecking = false;
      draft.isNavigating = false;
      break;
    }
    case 'FORMIO_CHANGE_HANDLED': {
      draft.logicChecking = false;
      break;
    }
    case 'BLOCK_SUBMISSION': {
      const { logicChecking=false } = action.payload || {};
      draft.canSubmit = false;
      draft.logicChecking = logicChecking;
      break;
    }
    // can happen because of a logic check abort
    case 'LOGIC_CHECK_INTERRUPTED': {
      const {canSubmit} = action.payload;
      draft.logicChecking = false;
      draft.canSubmit = canSubmit;
      break;
    };
    // a separate action type because we should _not_ touch the configuration in the state
    case 'LOGIC_CHECK_DONE': {
      const {step: {data, canSubmit}} = action.payload;
      // update the altered values but only if relevant (we don't want to unnecesary break
      // references that trigger re-rendering).
      if (!isEqual(draft.backendData, data)) {
        draft.backendData = data;
      }
      draft.canSubmit = canSubmit;
      draft.logicChecking = false;
      break;
    }
    case 'TOGGLE_FORM_SAVE_MODAL': {
      const {open} = action.payload;
      draft.isFormSaveModalOpen = open;
      break;
    }
    case 'NAVIGATE': {
      draft.isNavigating = true;
      break;
    }
    case 'ERROR': {
      draft.error = action.payload;
      break;
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
};

const FormStep = ({
    form,
    submission,
    onLogicChecked,
    onStepSubmitted,
    onLogout,
}) => {
  const intl = useIntl();
  const config = useContext(ConfigContext);
  const formioTranslations = useContext(FormioTranslations);

  /* component state */
  const formRef = useRef(null);
  const [
    {
      configuration, backendData,
      canSubmit, logicChecking,
      isFormSaveModalOpen,
      isNavigating,
      error,
    },
    dispatch
  ] = useImmerReducer(reducer, initialState);

  // react router hooks
  const history = useHistory();
  const { step: slug } = useParams();

  // logic check refs
  const logicCheckTimeout = useRef();
  // can't use usePrevious, because the data changed event fires often, and we need to
  // track data changes since the last logic check rather.
  const previouslyCheckedData = useRef(null); // to compare with the data to check and possibly skip the check at all
  const controller = useRef(new AbortController());
  const configurationRef = useRef(configuration);

  const closeFormStepSaveModal = () => dispatch({type: 'TOGGLE_FORM_SAVE_MODAL', payload: {open: false}});

  // look up the form step via slug so that we can obtain the submission step
  const formStep = form.steps.find(s => s.slug === slug);
  const currentStepIndex = form.steps.indexOf(formStep);
  const submissionStep = submission.steps.find(s => s.formStep === formStep.url);

  // fetch the form step configuration
  // TODO: something is causing the FormStep.js to render multiple times, leading to
  // state updates on unmounted components.
  const {loading} = useAsync(
    async () => {
      const stepDetail = await get(submissionStep.url);
      dispatch({
        type: 'STEP_LOADED',
        payload: stepDetail,
      });
      configurationRef.current = stepDetail.formStep.configuration;
    },
    [submissionStep.url]
  );

  // throw errors from state so the error boundaries can pick them up
  if (error) {
    throw error;
  }

  // event loops and async programming are fun!
  // UI inputs are wonky if end-users perform input while evaluating logic checks that
  // operate on (slightly) stale form data. Evaluating the ref value once before
  // something doing IO and using that value _after_ the IO event completed can lead
  // to de-sync. This utility ensures you always have an up-to-date view of the form
  // data.
  //
  // Currently it's a simple wrapper around the form ref, but we may do more advanced
  // things using immer.produce to deal with immutable state inside at some point.
  const getCurrentFormData = () => {
    const submissionData = formRef.current?.formio?.submission?.data;
    return submissionData ? {...submissionData} : null;
  };

  const checkAbortedLogicCheck = (signal) => {
    const shouldAbortCurrentCheck = signal.aborted;
    if (!shouldAbortCurrentCheck) return;
    // throw custom error object to exit current callback forcibly
    throw new AbortedLogicCheck('Aborted logic check');
  };

  /**
   * Evaluate the server side logic
   * @param  {AbortController} controller     AbortController used to abort XHR requests and/or result processing
   *   because of new user input.
   * @param  {Boolean} canSubmitState The original canSubmit state at the time of scheduling the logic check.
   * @return {Void}                No return, dispatches reducer actions leading to state updates.
   */
  const evaluateFormLogic = async (controller, canSubmitState) => {
    // the canSubmitState variable essentially captures whether the form was submittable
    // or not at the time the logic check was scheduled. The logic check itself can modify
    // this based on backend response data, but one of the first actions when a change
    // event is received is blocking the submit button to give the logic check time to
    // complete.
    //
    // IF there's no point/change in state to be expected by the logic check, we need
    // to reinstate the original canSubmitState, which happens in the guard clause below.
    let data = getCurrentFormData();
    const previousData = previouslyCheckedData.current;

    const dataEmpty = isEmpty(data);
    const dataUnchanged = previousData && isEqual(previousData, data);

    if (dataEmpty || dataUnchanged) {
      dispatch({
        type: 'LOGIC_CHECK_INTERRUPTED',
        payload: {
          canSubmit: canSubmitState, // restore the original state from before the logic check
        }
      });
      return;
    }

    dispatch({
      type: 'BLOCK_SUBMISSION',
      payload: {logicChecking: true},
    });

    const formInstance = formRef.current.formio;

    // we cannot use checkValidity, as that relies on formInstance.submitted to be true.
    // However, `isValid` runs the validation for every component with the currently-bound
    // data if not specified explicitly.
    const isValid = formInstance.isValid();

    // when the form does not validate client-side: instead of skipping the backend check,
    // we record the data keys that are invalid and exclude those from being sent to the
    // server. It's possible that an invalid form state is resolved by logic by changing
    // something in an earlier step, but that requires the backend call to go through.
    // See #1526 for an example of such a case.
    const invalidKeys = !isValid ? formInstance.errors.map(err => err.component.key) : [];

    // now the actual checking *can* be aborted, which results in an exception being thrown.
    try {
      // call the backend to do the check
      checkAbortedLogicCheck(controller.signal);
      // update our view of the data, which may have been changed by now because of user input
      data = getCurrentFormData();
      const {submission, step} = await doLogicCheck(submissionStep.url, data, invalidKeys, controller.signal);
      // now process the result of the logic check.

      // first, check if we still have to process the results or not
      checkAbortedLogicCheck(controller.signal);

      // we did perform a logic check, so now track which data we checked. Next logic
      // checks can then exit early if there are no changes.
      previouslyCheckedData.current = cloneDeep(data);

      // report back to parent component
      onLogicChecked(submission, step);

      // we can't just dispatch this, because Formio keeps references to DOM nodes
      // which expire when the component re-renders, and that gives React
      // unstable_flushDiscreteUpdates warnings. However, we can update the form
      // definition by using the ref to the underlying Formio instance.
      // NOTE that this does effectively bring our state.configuration out of sync
      // with the actual form configuration (!).
      const newConfiguration = step.formStep.configuration;
      const previousConfiguration = configurationRef.current;
      const configurationChanged = previousConfiguration && !isEqual(previousConfiguration, newConfiguration);
      if (configurationChanged) {
        formInstance.setForm(newConfiguration);
        configurationRef.current = newConfiguration;
      }

      // definitely after the IO action (API call for logic check), we must update our
      // current view of the form data, and do it as close as possible to where we
      // process it.
      data = getCurrentFormData();

      // update the form data in the formio submission data. we do not filterBlankValues
      // here, as a default value may have been explicitly
      // reset to an empty value (see https://github.com/open-formulieren/open-forms/issues/994)
      const updatedData = cloneDeep({...data, ...step.data});
      if (!isEqual(data, updatedData)) {
        formInstance.submission = {data: updatedData};
      }

      // the reminder of the state updates we let the reducer handle
      dispatch({
        type: 'LOGIC_CHECK_DONE',
        payload: {
          submission,
          step: {...step, data: updatedData},
        },
      });
    } catch (e) {
      dispatch({type: 'LOGIC_CHECK_INTERRUPTED', payload: {canSubmit}});
      if (e.name !== 'AbortError') {
        throw (e) // re-throw on unexpected errors
      }
    }
  };

  const onFormIOSubmit = async ({ data }) => {
    if (!submission) {
      throw new Error("There is no active submission!");
    }

    dispatch({type: 'NAVIGATE'});

    try {
      await submitStepData(submissionStep.url, data);
    } catch (e) {
      dispatch({type: 'ERROR', payload: e});
    }

    // This will reload the submission
    const {submission: updatedSubmission, step} = await doLogicCheck(submissionStep.url, data);
    onLogicChecked(updatedSubmission, step); // report back to parent component
    onStepSubmitted(formStep);
  };

  // we wrap the submit so that we control our own submit button, as the form builder
  // does NOT include submit buttons. We need this to navigate between our own steps
  // and navigate flow.
  //
  // The handler of this submit event essentially calls the underlying formio.js
  // instance submit method, which leads to the submit event being emitted, and we tap
  // into that to handle the actual submission.
  const onReactSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    // current is the component, current.instance is the component instance, and that
    // object has an instance property pointing to the WebForm...
    const formInstance = formRef.current.formio;
    if (!formInstance) {
      console.warn("Form was not rendered (yet), aborting submission.");
      return;
    }

    const data = getCurrentFormData();
    // we set the dirty flag, even if there are changes at all to force validation of
    // whatever data is in the form before submitting. Untouched form fields are marked
    // as 'pristine' in Formio (see `Component.invalidMessage` method`) which causes
    // validation to be skipped.
    const isValid = await formInstance.checkAsyncValidity(data, true, data);  // sets the validation error messages
    // invalid forms may not be submitted.
    if (!isValid) {
      dispatch({type: 'BLOCK_SUBMISSION'});
      return;
    }

    // submit the Formio.js form instance, which causes the submit event to be emitted.
    // FormIO submit() calls executeSubmit() which catches invalid field data (including empty required fields)
    // and then renders the errors in the form. If this is not caught, the step will be submitted anyway
    try {
      await formInstance.submit();
    } catch (e) {
      // Submitting the form step failed
      dispatch({type: 'BLOCK_SUBMISSION'});
    }
  };

  const onSaveConfirm = async () => {
    const response = await submitStepData(
      submissionStep.url, {...getCurrentFormData()}
    );
    return response;
  };

  const onFormSave = async (event) => {
    event.preventDefault();
    dispatch({type: 'TOGGLE_FORM_SAVE_MODAL', payload: {open: true}});
  };

  const onPrevPage = (event) => {
    event.preventDefault();

    dispatch({type: 'NAVIGATE'});

    const currentStepIndex = form.steps.indexOf(formStep);
    const previousStepIndex = findPreviousApplicableStep(currentStepIndex, submission);

    const prevStepSlug = form.steps[previousStepIndex]?.slug;
    const navigateTo = prevStepSlug ? `/stap/${prevStepSlug}` : '/';
    history.push(navigateTo);
  };

  const onFormIOInitialized = () => {
    const formInstance = formRef.current?.instance?.instance;

    if (!formInstance) {
      console.warn('No form instance available!');
      return;
    }

    // We cannot filter 'blank' values to prevent Formio validation from running, as
    // Formio will use the default values in that case which have been explicitly
    // unset. In the situation that we have invalid backend data (loading a submission
    // with a required field with default value that was cleared, for example), we
    // _need_ to see the validation errors since the data is not valid.
    // For the initial, empty form load, no validation errors are displayed as there
    // is no respective backend data.
    const submissionData = formInstance.submission.data;
    const shouldSetData = !isEmpty(backendData) && !isEqual(submissionData, backendData);
    if (shouldSetData) {
      // the cloneDeep is needed since we deliberately make the immer state mutable
      // for FormIO (multivalue input is one example why that's needed).
      formInstance.setSubmission(
        {data: cloneDeep(backendData)},
        {noValidate: true},
      );
    }
  };

  // See 'change' event https://help.form.io/developers/form-renderer#form-events
  const onFormIOChange = async (changed, flags, modifiedByHuman) => {
    // formio form not mounted -> nothing to do
    if (!formRef.current) return;

    // backend logic leads to changes in FormIO configuration, which triggers onFormIOInitialized.
    // This in turn triggers the onFormIOChange event because the submission data is set
    // programmatically. Without checking for human interaction, this would block the
    // submission again for LOGIC_CHECK_DEBOUNCE ms, for the logic check to eventually
    // be interrupted inside the evaluateFormLogic handler because the data hasn't
    // changed. We can skip this particular block-unblock cycle by only blocking the
    // submission because of human input.
    if (modifiedByHuman) dispatch({type: 'BLOCK_SUBMISSION'});
    let localCanSubmit = canSubmit;

    // signal abortion, and set a new controller for the newly scheduled check.
    controller.current.abort();
    const abortController = new AbortController();
    controller.current = abortController;

    // cancel old timeout if it's set
    if(logicCheckTimeout.current) {
      localCanSubmit = logicCheckTimeout.current.canSubmit;
      clearTimeout(logicCheckTimeout.current.timeoutId);
    }

    // schedule a new logic check to run in LOGIC_CHECK_DEBOUNCE ms
    const timeoutId = setTimeout(
      async () => {
        // we are executing the scheduled timeout, so for this event-handle cycle,
        // reset the timeout, otherwise the 'LOGIC_CHECK_INTERRUPTED' always fires on
        // the next change event which hold an outdated canSubmit state
        logicCheckTimeout.current = null;
        try {
          await evaluateFormLogic(abortController, localCanSubmit);
        } catch (e) {
          dispatch({type: 'ERROR', payload: e});
        }
      },
      LOGIC_CHECK_DEBOUNCE,
    );
    logicCheckTimeout.current = {timeoutId, canSubmit: localCanSubmit};

    dispatch({type: 'FORMIO_CHANGE_HANDLED'});
  };

  const isLoadingSomething = (loading || isNavigating);
  return (
    <>
      <Card title={submissionStep.name}>
        { isLoadingSomething ? <Loader modifiers={['centered']} /> : null }

        {
          (!isLoadingSomething && configuration) ? (
            <form onSubmit={onReactSubmit}>
              <FormIOWrapper
                ref={formRef}
                form={configuration}
                onChange={onFormIOChange}
                onSubmit={onFormIOSubmit}
                onInitialized={onFormIOInitialized}
                options={{
                  noAlerts: true,
                  baseUrl: config.baseUrl,
                  language: formioTranslations.language,
                  i18n: formioTranslations.i18n,
                  evalContext: {
                    ofPrefix: `${PREFIX}-`,
                    requiredFieldsWithAsterisk: form.requiredFieldsWithAsterisk,
                  },
                  hooks: {
                    ...hooks,
                    customValidation: getCustomValidationHook(
                      submissionStep.url,
                      error => dispatch({type: 'ERROR', payload: error}),
                    ),
                  },
                  // custom options
                  intl,
                  ofContext: {
                    form: form,
                    submissionUuid: submission.id,
                    saveStepData: async () => await submitStepData(
                      submissionStep.url, {...getCurrentFormData()}
                    ),
                  },
                }}
              />
              { DEBUG ? <FormStepDebug data={getCurrentFormData()} /> : null }
            <ButtonsToolbar
              literals={formStep.literals}
              canSubmitStep={canSubmit}
              canSubmitForm={submission.submissionAllowed}
              isAuthenticated={submission.isAuthenticated}
              isLastStep={isLastStep(currentStepIndex, submission)}
              isCheckingLogic={logicChecking}
              loginRequired={form.loginRequired}
              onFormSave={onFormSave}
              onLogout={onLogout}
              onNavigatePrevPage={onPrevPage}
            />
            </form>
          ) : null
        }
      </Card>
      <FormStepSaveModal
        isOpen={isFormSaveModalOpen}
        closeModal={closeFormStepSaveModal}
        onSaveConfirm={onSaveConfirm}
        suspendFormUrl={`${submission.url}/_suspend`}
      />
    </>
  );
};

FormStep.propTypes = {
  form: Types.Form,
  submission: PropTypes.object.isRequired,
  onLogicChecked: PropTypes.func.isRequired,
  onStepSubmitted: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default FormStep;
