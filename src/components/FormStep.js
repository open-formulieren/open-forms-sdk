/**
 * Render a single form step, as part of a started submission for a form.
 */
import React, {useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
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
import {PREFIX}  from 'formio/constants';
import Types from 'types';

const DEBUG = process.env.NODE_ENV === 'development';

const LOGIC_CHECK_DEBOUNCE = 1000; // in ms - once the user stops

const submitStepData = async (stepUrl, data) => {
  const stepDataResponse = await put(stepUrl, {data});
  return stepDataResponse;
};

const doLogicCheck = async (stepUrl, data, signal) => {
  const url = `${stepUrl}/_check_logic`;
  const stepDetailData = await post(url, {data}, signal);
  if (!stepDetailData.ok) {
    throw new Error('Invalid response'); // TODO -> proper error & use ErrorBoundary
  }
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

  const evaluateFormLogic = async (controller) => {
    // 'clone' the object so that we're not checking against mutable references
    let data = getCurrentFormData();
    const previousData = previouslyCheckedData.current;
    if (previousData && isEqual(previousData, data)) return;
    if (isEmpty(data)) return;

    dispatch({
      type: 'BLOCK_SUBMISSION',
      payload: {logicChecking: true},
    });

    const formInstance = formRef.current.formio;

    // we cannot use checkValidity, as that relies on formInstance.submitted to be true.
    // However, `isValid` runs the validation for every component with the currently-bound
    // data if not specified explicitly.
    const isValid = formInstance.isValid();

    // form does not validate client-side, don't bother with checking server-side yet.
    if (!isValid) {
      dispatch({
        type: 'LOGIC_CHECK_INTERRUPTED',
        payload: {
          canSubmit: false
        }
      });
      return;
    }

    // now the actual checking *can* be aborted, which results in an exception being thrown.
    try {
      // call the backend to do the check
      checkAbortedLogicCheck(controller.signal);
      // update our view of the data, which may have been changed by now because of user input
      data = getCurrentFormData();
      const {submission, step} = await doLogicCheck(submissionStep.url, data, controller.signal);
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

    await submitStepData(submissionStep.url, data);
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
  const onReactSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    // current is the component, current.instance is the component instance, and that
    // object has an instance property pointing to the WebForm...
    const formInstance = formRef.current.formio;
    if (!formInstance) {
      console.warn("Form was not rendered (yet), aborting submission.");
      return;
    }

    if (!formInstance.isValid()) {
      return;
    }

    // submit the Formio.js form instance, which causes the submit event to be emitted.
    formInstance.submit();
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

    dispatch({type: 'BLOCK_SUBMISSION'});

    // signal abortion, and set a new controller for the newly scheduled check.
    controller.current.abort();
    const abortController = new AbortController();
    controller.current = abortController;

    // cancel old timeout if it's set
    if(logicCheckTimeout.current) {
      clearTimeout(logicCheckTimeout.current);
      dispatch({
        type: 'LOGIC_CHECK_INTERRUPTED',
        payload: {
          canSubmit: formRef.current?.formio?.isValid() || false,
        },
      });
    }

    // schedule a new logic check to run in LOGIC_CHECK_DEBOUNCE ms
    logicCheckTimeout.current = setTimeout(
      async () => {
        await evaluateFormLogic(abortController);
      },
      LOGIC_CHECK_DEBOUNCE,
    );

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
                  },
                  hooks,
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
