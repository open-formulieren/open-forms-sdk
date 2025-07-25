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
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import {Suspense, lazy, useContext, useRef} from 'react';
import {useIntl} from 'react-intl';
import {useNavigate, useParams} from 'react-router';
import {useAsync} from 'react-use';
import {useImmerReducer} from 'use-immer';

import {ConfigContext, FormioTranslations} from 'Context';
import {get} from 'api';
import Card, {CardTitle} from 'components/Card';
import {EmailVerificationModal} from 'components/EmailVerification';
import FormNavigation, {StepSubmitButton} from 'components/FormNavigation';
import FormStepDebug from 'components/FormStepDebug';
import {LiteralsProvider} from 'components/Literal';
import Loader from 'components/Loader';
import PreviousLink from 'components/PreviousLink';
import {useSubmissionContext} from 'components/SubmissionProvider';
import {SummaryProgress} from 'components/SummaryProgress';
import FormStepSaveModal from 'components/modals/FormStepSaveModal';
import {
  eventTriggeredBySubmitButton,
  findNextApplicableStep,
  findPreviousApplicableStep,
  isLastStep,
} from 'components/utils';
import useFormContext from 'hooks/useFormContext';
import useTitle from 'hooks/useTitle';
import {PREFIX} from 'utils';

import {doLogicCheck, getCustomValidationHook, submitStepData} from './data';

// Dynamically import react-formio and use React.lazy to facilitate bundle splitting
// into separate chunks.
const Form = lazy(async () => {
  // this should already have been resolved the the sdk.tsx entrypoint :)
  const {Form, initializeFormio} = await import('formio-init');
  // side effect to ensure our custom templates/module are set up
  initializeFormio();
  // React.lazy must yield a 'default export'
  return {default: Form};
});

/**
 * Debounce interval in milliseconds (1000ms equals 1s) to prevent excessive amount of logic checks.
 * @type {number}
 */
const LOGIC_CHECK_DEBOUNCE = 1000;

/**
 * Get thrown if logic check is aborted.
 */
class AbortedLogicCheck extends Error {
  constructor(message = '', ...args) {
    super(message, ...args);
    this.name = 'AbortError'; // aligns with fetch Error.name that's thrown on abort
  }
}

/**
 * The initial state for FormStep component,
 * @see {reducer}
 */
const initialState = {
  configuration: null,
  backendData: {},
  formioInitialized: false,
  canSubmit: false,
  logicChecking: false,
  isFormSaveModalOpen: false,
  isNavigating: false,
  error: null,
  emailVerificationModal: {
    isOpen: false,
    componentKey: '',
    emailAddress: '',
  },
};

/**
 * State updates are performed by calling `dispatch` with an action, The reducer applies the action
 * to a "draft" state resulting in a new (immutable) state.
 *
 * @see {@link Immer documentation} https://immerjs.github.io/immer/example-setstate#useimmerreducer
 * @see {@link React documentation} https://reactjs.org/docs/hooks-reference.html#usereducer
 *
 * @param {Object} draft Draft state that produces new state once action is applied to it.
 * @param {Object} action Object that specified the state mutation, can contain the following keys:
 *    - `type` (string, required) the action to perform on draft state.
 *    - `playload` (Object) the data to use when performing the state mutation.
 *
 * @throws {Error} Throws an error if the action is not recognized.
 * @return {undefined} Nothing is returned but actions lead to re-renders with updated state.
 */
const reducer = (draft, action) => {
  switch (action.type) {
    case 'STEP_LOADED': {
      const {
        data,
        formStep: {configuration},
        canSubmit,
      } = action.payload;
      draft.configuration = configuration;
      draft.backendData = data;
      draft.formioInitialized = false;
      draft.canSubmit = canSubmit;
      draft.logicChecking = false;
      draft.isNavigating = false;
      break;
    }

    case 'FORMIO_CHANGE_HANDLED': {
      draft.logicChecking = false;
      break;
    }

    case 'FORMIO_INITIALIZED': {
      draft.formioInitialized = true;
      break;
    }

    case 'BLOCK_SUBMISSION': {
      const {logicChecking = false} = action.payload || {};
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
    }

    // a separate action type because we should _not_ touch the configuration in the state
    case 'LOGIC_CHECK_DONE': {
      const {
        step: {data, canSubmit},
      } = action.payload;
      // update the altered values but only if relevant (we don't want to unnecesary break
      // references that trigger re-rendering).
      if (!isEqual(draft.backendData, data)) {
        draft.backendData = cloneDeep(data);
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

    case 'VERIFY_EMAIL': {
      const {componentKey, emailAddress} = action.payload;
      draft.emailVerificationModal.isOpen = true;
      draft.emailVerificationModal.componentKey = componentKey;
      draft.emailVerificationModal.emailAddress = emailAddress;
      // otherwise remains in blocked state from backend validation errors
      draft.canSubmit = true;
      break;
    }

    case 'CLOSE_EMAIL_VERIFICATION_MODAL': {
      draft.emailVerificationModal = initialState.emailVerificationModal;
      break;
    }

    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
};

/**
 * Form step React component, uses (Form.io) Form component internally.
 *
 * Retrieves the formio configuration from the backend and manages the submission state.
 * Change events in the form trigger logic checks to the backend, which may update the
 * form state itself again. When the formio form is submitted, the step data is
 * validated and persisted to the backend, then the form navigates to the next step
 * or summary page.
 *
 * @throws {Error} Throws errors from state so the error boundaries can pick them up.
 * @return {React.ReactNode}
 */
const FormStep = () => {
  const intl = useIntl();
  const config = useContext(ConfigContext);
  const formioTranslations = useContext(FormioTranslations);
  const form = useFormContext();
  const {submission, onSubmissionObtained, onDestroySession} = useSubmissionContext();

  /* component state */
  const formRef = useRef(null);
  const [
    {
      configuration,
      backendData,
      formioInitialized,
      canSubmit,
      logicChecking,
      isFormSaveModalOpen,
      isNavigating,
      error,
      emailVerificationModal,
    },
    dispatch,
  ] = useImmerReducer(reducer, initialState);

  // react router hooks
  const navigate = useNavigate();
  const {step: slug} = useParams();

  // logic check refs
  const logicCheckTimeout = useRef();
  // can't use usePrevious, because the data changed event fires often, and we need to
  // track data changes since the last logic check rather.
  const previouslyCheckedData = useRef(null); // to compare with the data to check and possibly skip the check at all
  const controller = useRef(new AbortController());
  const configurationRef = useRef(configuration);

  // look up the form step via slug so that we can obtain the submission step
  const formStep = form.steps.find(s => s.slug === slug);
  const currentStepIndex = form.steps.indexOf(formStep);
  const submissionStep = submission.steps.find(s => s.formStep === formStep.url);

  useTitle(formStep.formDefinition, form.name);

  /**
   * Fetches the form step data from the backend.
   * TODO: something is causing the FormStep.js to render multiple times, leading to state updates
   *   on unmounted components.
   *
   * During evaluation, the following actions are/may be dispatched:
   *
   *   - `ERROR` When an error occurred while loading the form step configuration.
   *   - `STEP_LOADED` When the form step is fetched fom the backend.
   */
  const {loading} = useAsync(async () => {
    let stepDetail;

    try {
      stepDetail = await get(submissionStep.url);
    } catch (e) {
      dispatch({type: 'ERROR', payload: e});
      return;
    }

    dispatch({
      type: 'STEP_LOADED',
      payload: stepDetail,
    });
    configurationRef.current = stepDetail.formStep.configuration;
    window.scrollTo(0, 0, {behavior: 'smooth'});
  }, [submissionStep.url]);

  // throw errors from state so the error boundaries can pick them up
  if (error) {
    throw error;
  }

  const closeFormStepSaveModal = () => {
    dispatch({type: 'TOGGLE_FORM_SAVE_MODAL', payload: {open: false}});
  };

  // event loops and async programming are fun!
  // UI inputs are wonky if end-users perform input while evaluating logic checks that
  // operate on (slightly) stale form data. Evaluating the ref value once before
  // something doing IO and using that value _after_ the IO event completed can lead
  // to de-sync. This utility ensures you always have an up-to-date view of the form
  // data.
  //
  // Currently it's a simple wrapper around the form data ref, but we may do more advanced
  // things using immer.produce to deal with immutable state inside at some point.
  const getCurrentFormData = () => {
    const submissionData = formRef.current?.formio?.submission?.data;
    return submissionData ? {...submissionData} : null;
  };

  /**
   * Check whether a current logic using the _check-logic endpoint should be cancelled.
   * @throws {AbortedLogicCheck} Throws an AbortedLogicCheck if the current logic check should be
   *   aborted
   * @param {*} signal
   */
  const checkAbortedLogicCheck = signal => {
    const shouldAbortCurrentCheck = signal.aborted;
    if (!shouldAbortCurrentCheck) {
      return;
    }
    // throw custom error object to exit current callback forcibly
    throw new AbortedLogicCheck('Aborted logic check');
  };

  /**
   * Evaluates the server side logic.
   *
   * During evaluation, the following actions are/may be dispatched:
   *
   *   - `LOGIC_CHECK_INTERRUPTED` When there's no point/change in state to be expected by the logic
   *       check
   *   - `BLOCK_SUBMISSION` When the logic is checking and the form should be disabled for
   *       submission.
   *   - `LOGIC_CHECK_DONE` When the logic check is done and the form should be enabled for
   *       submission.
   *   - `LOGIC_CHECK_INTERRUPTED` When an error occurred during the logic check.
   *
   * @param  {AbortController} controller AbortController used to abort XHR requests and/or result
   *   processing because of new user input.
   * @param  {boolean} canSubmitState The original canSubmit state at the time of scheduling the
   *   logic check.
   * @param  {boolean} forceEvaluation Force re-evaluation of the logic check even if the data
   *   hasn't changed (#2488).
   */
  const evaluateFormLogic = async (controller, canSubmitState, forceEvaluation) => {
    // the canSubmitState variable essentially captures whether the form was submittable
    // or not at the time the logic check was scheduled. The logic check itself can modify
    // this based on backend response data, but one of the first actions when a change
    // event is received is blocking the submit button to give the logic check time to
    // complete.
    let data = getCurrentFormData();

    // IF there's no point/change in state to be expected by the logic check, we need
    // to reinstate the original canSubmitState, which happens in the guard clause below.
    const previousData = previouslyCheckedData.current;
    const dataEmpty = isEmpty(data);
    const dataUnchanged = previousData && isEqual(previousData, data);

    if (!forceEvaluation && (dataEmpty || dataUnchanged)) {
      dispatch({
        type: 'LOGIC_CHECK_INTERRUPTED',
        payload: {
          canSubmit: canSubmitState, // restore the original state from before the logic check
        },
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
      // `checkAbortedLogicCheck` throws error if checko should be aborted, skipping `doLogicCheck`.
      checkAbortedLogicCheck(controller.signal);

      // update our view of the data, which may have been changed by now because of user input.
      data = getCurrentFormData();

      // call the backend to do the check
      const {submission, step} = await doLogicCheck(
        submissionStep.url,
        data,
        invalidKeys,
        controller.signal
      );

      // now process the result of the logic check.

      // first, check if we still have to process the results or not
      checkAbortedLogicCheck(controller.signal);

      // we did perform a logic check, so now track which data we checked. Next logic
      // checks can then exit early if there are no changes.
      previouslyCheckedData.current = cloneDeep(data);

      // report back to parent component
      onSubmissionObtained(submission);

      // we can't just dispatch this, because Formio keeps references to DOM nodes
      // which expire when the component re-renders, and that gives React
      // unstable_flushDiscreteUpdates warnings. However, we can update the form
      // definition by using the ref to the underlying Formio instance.
      // NOTE that this does effectively bring our state.configuration out of sync
      // with the actual form configuration (!).
      const newConfiguration = step.formStep.configuration;
      const previousConfiguration = configurationRef.current;
      const configurationChanged =
        previousConfiguration && !isEqual(previousConfiguration, newConfiguration);
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
        throw e; // re-throw on unexpected errors
      }
    }
  };

  /**
   * A form has been submitted.
   * @see {onReactSubmit} We wrap the submit so that we control our own submit button.
   *
   * During evaluation, the following actions are/may be dispatched:
   *
   *   - `NAVIGATE` Immediately (if submission is available).
   *   - `ERROR` When an error occurred while loading the form step configuration.
   *
   * @param {Object} data The submission json object.
   * @return {Promise}
   */
  const onFormIOSubmit = async ({data}) => {
    if (!submission) {
      throw new Error('There is no active submission!');
    }

    // React.StrictMode results in components being unmounted and remounted in dev mode
    // (this catches bugs early!) and is something we want. However, the react-formio
    // component is *not* able to deal with this because it is old and upgrading that
    // library is currently not an option.
    //
    // Due to the unmount-and-remount, the `onSubmit` event is bound twice on the
    // formio instance, causing this callback to run twice. In dev mode, this leads to
    // racing HTTP PUT calls, which result in a HTTP 500 server error for unique
    // constraint violation, breaking filling out steps for the first time in dev (prod
    // is fine). To mitigate this, we track the internal state.
    //
    // We anticipate that these kind of issues will go away by themselves when the new
    // renderer is done that doesn't manually keep track of callbacks, but instead uses
    // pure React props. That is still a while away though.
    const formInstance = formRef.current.formio;
    if (formInstance._of_already_submitting) return;

    formInstance._of_already_submitting = true;
    dispatch({type: 'NAVIGATE'});

    try {
      await submitStepData(submissionStep.url, data);
    } catch (e) {
      dispatch({type: 'ERROR', payload: e});
    } finally {
      delete formInstance._of_already_submitting;
    }

    // This will reload the submission
    const {submission: updatedSubmission} = await doLogicCheck(submissionStep.url, data);
    onSubmissionObtained(updatedSubmission); // report back to parent component

    // navigate to the next page (either the next step or the overview)
    const currentStepIndex = form.steps.indexOf(formStep);
    const nextStepIndex = findNextApplicableStep(currentStepIndex, submission);
    const nextStep = form.steps[nextStepIndex]; // will be undefined if it's the last step
    const nextUrl = nextStep ? `/stap/${nextStep.slug}` : '/overzicht';
    navigate(nextUrl);
  };

  /**
   * we wrap the submit so that we control our own submit button, as the form builder
   * does NOT include submit buttons. We need this to navigate between our own steps
   * and navigate flow.
   *
   * The handler of this submit event essentially calls the underlying formio.js
   * instance submit method, which leads to the submit event being emitted, and we tap
   * into that to handle the actual submission.
   *
   * During evaluation, the following actions are/may be dispatched:
   *
   *   - `BLOCK_SUBMISSION` When the the logic is checking and the form should be disabled for
   *       submission.
   *
   * @param {Event} event
   */
  const onReactSubmit = async event => {
    event.preventDefault();

    // Issue #2084 - The button to save a row of an editgrid triggers a submit if there are validation errors
    if (!eventTriggeredBySubmitButton(event)) return;

    if (!canSubmit) return;

    // current is the component, current.instance is the component instance, and that
    // object has an instance property pointing to the WebForm...
    const formInstance = formRef.current.formio;
    if (!formInstance) {
      console.warn('Form was not rendered (yet), aborting submission.');
      return;
    }

    const data = getCurrentFormData();

    // set internal state, which implies a submit attempt was done (whether succesful
    // or with (validation) errors is irrelevant, see formio.js/src/WebForm.js). This
    // ensures that validation errors are only cleared for the field being changed.
    formInstance.submitted = true;
    formInstance.setPristine(false);

    // we set the dirty flag, even if there are no changes at all to force validation of
    // whatever data is in the form before submitting. Untouched form fields are marked
    // as 'pristine' in Formio (see `Component.invalidMessage` method`) which causes
    // validation to be skipped.
    const isValid = await formInstance.checkAsyncValidity(data, true, data); // sets the validation error messages

    // invalid forms may not be submitted.
    if (!isValid) {
      let firstComponentWithError = formInstance.getComponent(formInstance.errors[0].component.key);
      if (firstComponentWithError && firstComponentWithError.element) {
        firstComponentWithError.element.scrollIntoView();
      }
      dispatch({type: 'BLOCK_SUBMISSION'});
      return;
    }

    // submit the Formio.js form instance, which causes the submit event to be emitted.
    // FormIO submit() calls executeSubmit() which catches invalid field data (including empty required fields)
    // and then renders the errors in the form. If this is not caught, the step will be submitted anyway
    try {
      await formInstance.submit();
    } catch {
      // Submitting the form step failed
      dispatch({type: 'BLOCK_SUBMISSION'});
    }
  };

  const onSaveConfirm = async () => {
    return await submitStepData(submissionStep.url, {...getCurrentFormData()});
  };

  /**
   * Get called when the user presses the save button.
   * @see {onSaveConfirm} Opens a modal, `onSaveConfirm` after user confirms.
   *
   * During evaluation, the following actions are/may be dispatched:
   *
   *   - `TOGGLE_FORM_SAVE_MODAL` After preventing default event handler, resulting in
   *     `isFormSaveModalOpen=true`, opening modal.
   *
   * @param {PointerEvent} event
   * @return {Promise}
   */
  const onFormSave = async event => {
    event.preventDefault();
    dispatch({type: 'TOGGLE_FORM_SAVE_MODAL', payload: {open: true}});
  };

  const getPreviousPageHref = () => {
    const currentStepIndex = form.steps.indexOf(formStep);
    const previousStepIndex = findPreviousApplicableStep(currentStepIndex, submission);

    const prevStepSlug = form.steps[previousStepIndex]?.slug;
    return prevStepSlug ? `/stap/${prevStepSlug}` : '/';
  };

  /**
   * Handler to navigate back to the previous step or page
   * @param {PointerEvent} event
   *
   * During evaluation, the following actions are/may be dispatched:
   *
   *   - `NAVIGATE` After preventing default event handler.
   */
  const onPrevPage = event => {
    event.preventDefault();

    dispatch({type: 'NAVIGATE'});

    const navigateTo = getPreviousPageHref();
    navigate(navigateTo);
  };

  /**
   * Called when the form has completed the render, attach, and one initialization change event
   * loop.
   * @see {@link Form.io documentation} https://help.form.io/developers/form-renderer#form-events
   */
  const onFormIOInitialized = () => {
    const formInstance = formRef.current?.instance?.instance;

    if (!formInstance) {
      console.warn('No form instance available!');
      return;
    }

    // formio initialized also fires when the formio configuration changes bceause of
    // logic, but we only tap into this hook to set the backend-loaded submission data.
    // Once this is done, we don't want to run anything anymore.
    // Otherwise this causes problems wich change events triggering and "bouncing" back
    // and forth (in WebKit browsers) with the logic check via the onFormIOChange, see
    // open-formulieren/open-forms#3511.
    if (formioInitialized) return;

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
      formInstance.setSubmission({data: cloneDeep(backendData)}, {noValidate: true});
    }
    dispatch({type: 'FORMIO_INITIALIZED'});
  };

  /**
   * A value has been changed within the rendered form
   * @see {@link Form.io documentation} https://help.form.io/developers/form-renderer#form-events
   *
   * During evaluation, the following actions are/may be dispatched:
   *
   *   - `BLOCK_SUBMISSION` When the form was modified by a human (`modifiedByHuman`)  and the form
   *       should be disabled for submission.
   *   - `ERROR` When an error occurred while evaluating the form logic.
   *   - `FORMIO_CHANGE_HANDLED` When the change is successfully handled .
   *
   * @param {*} changed The changes that occurred, and the component that triggered the change.
   *   See "componentChange" event for description of this argument
   * @param {*} flags The change loop flags.
   * @param {*} modifiedByHuman Flag to determine if the change was made by a human interaction, or
   *   programatic.
   *
   * @return {Promise}
   */
  const onFormIOChange = async (changed, flags, modifiedByHuman) => {
    // formio form not mounted -> nothing to do
    if (!formRef.current) return;
    // Under some conditions and engines (e.g. WebKit), `onFormIOChange` can be triggered while
    // logicChecking is currently running (that is the scheduled logic check with `setTimeout` is ongoing).
    // While it is running, `canSubmit` is set to `false` because of the fired `BLOCK_SUBMISSION` action.
    // We don't want to get in conflict with the current check if the change doesn't come from the user.
    // See https://github.com/open-formulieren/open-forms/issues/3572 for an example.
    if (!modifiedByHuman && logicChecking) return;

    // backend logic leads to changes in FormIO configuration, which triggers onFormIOInitialized.
    // This in turn triggers the onFormIOChange event because the submission data is set
    // programmatically. Without checking for human interaction, this would block the
    // submission again for LOGIC_CHECK_DEBOUNCE ms, for the logic check to eventually
    // be interrupted inside the evaluateFormLogic handler because the data hasn't
    // changed. We can skip this particular block-unblock cycle by only blocking the
    // submission because of human input.
    if (modifiedByHuman) {
      dispatch({type: 'BLOCK_SUBMISSION'});
    }

    let localCanSubmit = canSubmit;

    // signal abortion, and set a new controller for the newly scheduled check.
    controller.current.abort();
    const abortController = new AbortController();
    controller.current = abortController;

    // cancel old timeout if it's set
    if (logicCheckTimeout.current) {
      localCanSubmit = logicCheckTimeout.current.canSubmit;
      clearTimeout(logicCheckTimeout.current.timeoutId);
    }

    // Issue #2488 - If an unsaved iteration of the repeating group had errors, deleting the line doesn't trigger a
    // data change (because of the inlineEdit=False property). So we need to force re-evaluation to make the "next step"
    // button become active again
    const forceEvaluateLogic = !!flags?.deletedRepeatingGroupRow;

    // schedule a new logic check to run in LOGIC_CHECK_DEBOUNCE ms
    const timeoutId = setTimeout(async () => {
      // we are executing the scheduled timeout, so for this event-handle cycle,
      // reset the timeout, otherwise the 'LOGIC_CHECK_INTERRUPTED' always fires on
      // the next change event which hold an outdated canSubmit state
      logicCheckTimeout.current = null;
      try {
        await evaluateFormLogic(abortController, localCanSubmit, forceEvaluateLogic);
      } catch (e) {
        dispatch({type: 'ERROR', payload: e});
      }
    }, LOGIC_CHECK_DEBOUNCE);
    logicCheckTimeout.current = {timeoutId, canSubmit: localCanSubmit};

    dispatch({type: 'FORMIO_CHANGE_HANDLED'});
  };

  const isLoadingSomething = loading || isNavigating;

  // Summary progress
  const applicableSteps = submission.steps.filter(step => step.isApplicable === true);
  const currentSubmissionStepIndex = applicableSteps.indexOf(submissionStep);

  const previousPage = getPreviousPageHref();
  return (
    <LiteralsProvider literals={formStep.literals}>
      <Card title={form.name} mobileHeaderHidden>
        {isLoadingSomething ? <Loader modifiers={['centered']} /> : null}

        {previousPage && <PreviousLink to={previousPage} onClick={onPrevPage} position="start" />}

        {!isLoadingSomething && form.showSummaryProgress && (
          <SummaryProgress
            current={currentSubmissionStepIndex + 1}
            total={applicableSteps.length}
          />
        )}
        {!isLoadingSomething && configuration ? (
          <>
            <CardTitle title={submissionStep.name} headingType="subtitle" padded />
            <Suspense fallback={<Loader modifiers={['centered']} />}>
              <form onSubmit={onReactSubmit} noValidate>
                <Form
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
                      requiredFieldsWithAsterisk: config.requiredFieldsWithAsterisk,
                    },
                    hooks: {
                      customValidation: getCustomValidationHook(submissionStep.url, error =>
                        dispatch({type: 'ERROR', payload: error})
                      ),
                    },
                    // custom options
                    intl,
                    ofContext: {
                      form: form,
                      submissionUuid: submission.id,
                      submissionUrl: submission.url,
                      saveStepData: async () =>
                        await submitStepData(submissionStep.url, {...getCurrentFormData()}),
                      verifyEmailCallback: ({key, email}) => {
                        // clear the errors from the component
                        const formInstance = formRef.current.formio;
                        const component = formInstance.getComponent(key);
                        component.setCustomValidity('');

                        dispatch({
                          type: 'VERIFY_EMAIL',
                          payload: {componentKey: key, emailAddress: email},
                        });
                      },
                    },
                  }}
                />
                {config.debug ? <FormStepDebug data={getCurrentFormData()} /> : null}
                <FormNavigation
                  submitButton={
                    <StepSubmitButton
                      canSubmitForm={submission.submissionAllowed}
                      canSubmitStep={canSubmit}
                      isLastStep={isLastStep(currentStepIndex, submission)}
                      isCheckingLogic={logicChecking}
                    />
                  }
                  onFormSave={form.suspensionAllowed ? onFormSave : undefined}
                  previousPage={previousPage}
                  onNavigatePrevPage={onPrevPage}
                  isAuthenticated={submission.isAuthenticated}
                  onDestroySession={onDestroySession}
                />
              </form>
            </Suspense>
          </>
        ) : null}
      </Card>
      <FormStepSaveModal
        isOpen={isFormSaveModalOpen}
        closeModal={closeFormStepSaveModal}
        onSaveConfirm={onSaveConfirm}
        onSessionDestroyed={onDestroySession}
        suspendFormUrl={`${submission.url}/_suspend`}
        suspendFormUrlLifetime={form.resumeLinkLifetime}
        submissionId={submission.id}
      />
      <EmailVerificationModal
        isOpen={emailVerificationModal.isOpen}
        closeModal={() => dispatch({type: 'CLOSE_EMAIL_VERIFICATION_MODAL'})}
        submissionUrl={submission.url}
        componentKey={emailVerificationModal.componentKey}
        emailAddress={emailVerificationModal.emailAddress}
      />
    </LiteralsProvider>
  );
};

FormStep.propTypes = {};

export default FormStep;
