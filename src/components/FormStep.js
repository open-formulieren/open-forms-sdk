/**
 * Render a single form step, as part of a started submission for a form.
 */

import React, {useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { useImmerReducer } from 'use-immer';
import useAsync from 'react-use/esm/useAsync';

import { get, post, put } from 'api';

import Button from 'components/Button';
import Card from 'components/Card';
import FormIOWrapper from 'components/FormIOWrapper';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import Loader from 'components/Loader';
import { ConfigContext } from 'Context';
import Types from 'types';
import LogoutButton from 'components/LogoutButton';
import hooks from '../formio/hooks';
import {findPreviousApplicableStep} from 'components/utils';

const LOGIC_CHECK_DEBOUNCE = 800; // in ms - once the user stops

const submitStepData = async (stepUrl, data) => {
  const stepDataResponse = await put(stepUrl, {data});
  return stepDataResponse.data;
};

const doLogicCheck = async (stepUrl, data) => {
  const url = `${stepUrl}/_check_logic`;
  const stepDetailData = await post(url, {data});
  if (!stepDetailData.ok) {
    throw new Error('Invalid response'); // TODO -> proper error & use ErrorBoundary
  }
  return stepDetailData.data;
};

const initialState = {
  configuration: null,
  data: null,
  canSubmit: false,
};

const reducer = (draft, action) => {
  switch(action.type) {
    case 'STEP_LOADED': {
      const {data, formStep: {configuration}, canSubmit} = action.payload;
      draft.configuration = configuration;
      draft.data = data;
      draft.canSubmit = canSubmit;
      break;
    }
    case 'STEP_DATA_UPDATED': {
      draft.data = action.payload;
      break;
    }
    case 'BLOCK_SUBMISSION': {
      draft.canSubmit = false;
      break;
    }
    // a separate action type because we should _not_ touch the configuration in the state
    case 'LOGIC_CHECK_DONE': {
      const {step: {data, canSubmit}} = action.payload;
      // update the altered values but only if relevant (we don't want to unnecesary break
      // references that trigger re-rendering).
      if (!isEqual(draft.data, data)) {
        draft.data = data;
      }
      draft.canSubmit = canSubmit;
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
  /* component state */
  const formRef = useRef(null);
  const [
    {configuration, data, canSubmit},
    dispatch
  ] = useImmerReducer(reducer, initialState);

  // react router hooks
  const history = useHistory();
  const { step: slug } = useParams();

  // logic check refs
  const formData = useRef(null);
  const logicCheckTimeout = useRef();
  const shouldAbortLogicCheck = useRef({});
  const logicChecks = useRef(0); // keep track of the number for debug purposes
  // can't use usePrevious, because the data changed event fires often, and we need to
  // track data changes since the last logic check rather.
  const previouslyCheckedData = useRef(null); // to compare with the data to check and possibly skip the check at all





  // look up the form step via slug so that we can obtain the submission step
  const formStep = form.steps.find(s => s.slug === slug);
  const submissionStep = submission.steps.find(s => s.formStep === formStep.url);

  // fetch the form step configuration
  const {loading} = useAsync(
    async () => {
      const stepDetail = await get(submissionStep.url);
      dispatch({
        type: 'STEP_LOADED',
        payload: stepDetail,
      });
      formData.current = stepDetail.data;
      const formInstance = formRef.current.formio;
      formInstance.submission = {data: formData.current};
    },
    [submissionStep.url]
  );




  const signalAbortLogicCheck = () => {
    console.log(`Aborting logic check ${logicChecks.current}`);
    const currentLogicCheck = logicChecks.current;
    shouldAbortLogicCheck.current[currentLogicCheck] = true;
  };

  const checkAbortedLogicCheck = (currentCheck) => {
    const shouldAbortCurrentCheck = !!shouldAbortLogicCheck.current[currentCheck];
    if (!shouldAbortCurrentCheck) return;
    // throw exception to exit current callback forcibly
    console.log('Throwing!');
    // clean up to avoid ever-growing memory usage
    delete shouldAbortLogicCheck.current[currentCheck];
    throw new Error('Aborted logic check');
  };






  const performLogicCheck = async () => {
    // 'clone' the object so that we're not checking against mutable references
    const data = {...formData.current};
    const previousData = previouslyCheckedData.current;
    if (previousData && isEqual(previousData, data)) return;
    if (isEmpty(data)) return;

    logicChecks.current += 1;

    const currentCheck = logicChecks.current;

    console.group(`Logic check ${currentCheck}`);

    dispatch({type: 'BLOCK_SUBMISSION'});

    const formInstance = formRef.current.formio;
    // we cannot use checkValidity, as that relies on formInstance.submitted to be true.
    // However, `isValid` runs the validation for every component with the currently-bound
    // data if not specified explicitly.
    if (formInstance.isValid()) {

      console.log('Invoking logic check...');
      console.log('Checking data: ', data);

      try {
        // call the backend to do the check
        checkAbortedLogicCheck(currentCheck);
        const {submission, step} = await doLogicCheck(submissionStep.url, data);
        console.log(`Logic check ${currentCheck} done in backend`);

        // now process the result of the logic check.
        checkAbortedLogicCheck(currentCheck);

        // we did perform a logic check, so now track which data we checked. Next logic
        // checks can then exit early if there are no changes.
        previouslyCheckedData.current = data;

        // report back to parent component
        onLogicChecked(submission, step);

        console.log(`Handling response from logic check ${currentCheck}.`);

        // we can't just dispatch this, because Formio keeps references to DOM nodes
        // which expire when the component re-renders, and that gives React
        // unstable_flushDiscreteUpdates warnings. However, we can update the form
        // definition by using the ref to the underlying Formio instance.
        // NOTE that this does effectively bring our state.configuration out of sync
        // with the actual form configuration (!).
        formInstance.setForm(step.formStep.configuration);

        // update the form data both in our internal state and the formio submission data
        const updatedData = {...data, ...step.data};
        formData.current = updatedData;
        if (!isEqual(formInstance.submission.data, updatedData)) {
          formInstance.submission = {data: updatedData};
        }

        // the reminder of the state updates we let the reducer handle
        dispatch({
          type: 'LOGIC_CHECK_DONE',
          payload: {
            submission,
            step: {...step, data: formData.current},
          },
        });
      } catch (e) {
        console.error(e);
      }

      console.log(`Done logic checking. Counter: ${currentCheck}`);
    } else {
      console.log('Skipping - form is not valid on client-side');
    }

    console.groupEnd();

  };

  const onFormIOSubmit = async ({ data }) => {
    if (!submission) {
      throw new Error("There is no active submission!");
    }

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

    // current is the component, current.instance is the component instance, and that
    // object has an instance property pointing to the WebForm...
    const formInstance = formRef.current.formio;
    if (!formInstance) {
      console.warn("Form was not rendered (yet), aborting submission.");
      return;
    }

    // submit the Formio.js form instance, which causes the submit event to be emitted.
    formInstance.submit();
  };

  const onFormSave = async (event) => {
    event.preventDefault();
  };

  const onPrevPage = (event) => {
    event.preventDefault();
    const currentStepIndex = form.steps.indexOf(formStep);
    const previousStepIndex = findPreviousApplicableStep(currentStepIndex, submission);

    const prevStepSlug = form.steps[previousStepIndex]?.slug;
    const navigateTo = prevStepSlug ? `/stap/${prevStepSlug}` : '/';
    history.push(navigateTo);
  };

  // See 'change' event https://help.form.io/developers/form-renderer#form-events
  const onFormIOChange = async (changed, flags, modifiedByHuman) => {
    // formio form not mounted -> nothing to do
    if (!formRef.current) return;

    // if there are no changes, do nothing
    if ( !(flags && flags.changes && flags.changes.length) ) return;
    if ( !modifiedByHuman ) return;

    console.group('Formio change');

    signalAbortLogicCheck();

    const data = changed.data;
    formData.current = data;

    // TODO: should we block submission by default to give the logic check time to
    // complete and re-activate it?

    // cancel old timeout if it's set
    logicCheckTimeout.current && clearTimeout(logicCheckTimeout.current);

    // schedule a new logic check to run in LOGIC_CHECK_DEBOUNCE ms
    logicCheckTimeout.current = setTimeout(
      async () => {
        console.log('performLogicCheck');
        await performLogicCheck();
      },
      LOGIC_CHECK_DEBOUNCE,
    );

    dispatch({
      type: 'STEP_DATA_UPDATED',
      payload: {...data},
    });

    console.groupEnd();
  };

  return (
    <Card title={submissionStep.name}>
      { loading ? <Loader modifiers={['centered']} /> : null }

      {
        (!loading && configuration) ? (
          <form onSubmit={onReactSubmit}>
            <FormIOWrapper
              ref={formRef}
              form={configuration}
              // Filter blank values so FormIO does not run validation on them
              submission={{data: filterBlankValues(data)}}
              onChange={onFormIOChange}
              // onRender={ (element) => console.log('Form rendered at:', element)}
              // onBlur={onFormIOBlur}
              onSubmit={onFormIOSubmit}
              options={{
                noAlerts: true,
                baseUrl: config.baseUrl,
                hooks,
                intl,
              }}
            />
            <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
              <ToolbarList>
                <Button
                  variant="anchor"
                  component="a"
                  onClick={onPrevPage}
                >{formStep.literals.previousText.resolved}</Button>
              </ToolbarList>
              <ToolbarList>
                {/* Hiding the Save button until the functionality is implemented */}
                <Button
                  type="button"
                  variant="secondary"
                  name="save" onClick={onFormSave} disabled style={{display: "none"}}
                >{formStep.literals.saveText.resolved}</Button>
                <Button
                  type="submit"
                  variant="primary"
                  name="next"
                  disabled={!canSubmit}
                >{formStep.literals.nextText.resolved}</Button>
              </ToolbarList>
            </Toolbar>
            {form.loginRequired ? <LogoutButton onLogout={onLogout}/> : null}
          </form>
        ) : null
      }
    </Card>
  );
};

FormStep.propTypes = {
  form: Types.Form,
  submission: PropTypes.object.isRequired,
  onLogicChecked: PropTypes.func.isRequired,
  onStepSubmitted: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

const filterBlankValues = (data) => {
  // ensure that '0' as a value is retained, only keep empty values that essentially
  // have 'zero length' in the input.
  const BLANK = [null, undefined, ''];
  const notBlank = Object.entries(data).filter( ([_, value]) => !BLANK.includes(value) );
  return Object.fromEntries(notBlank);
};

export default FormStep;
