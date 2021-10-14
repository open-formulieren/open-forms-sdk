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
        // we _merge_ the data from the client with the logic check, where the last one
        // overrules the former. This accounts for extra data that may have been filled
        // out while the logic check was processing in the backend.
        draft.data = {...draft.data, ...data};
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
  // can't use usePrevious, because the data changed event fires often, and we need to
  // track data changes since the last logic check rather.
  const previouslyCheckedDataRef = useRef(null);
  const [
    {configuration, data, canSubmit},
    dispatch
  ] = useImmerReducer(reducer, initialState);

  // react router hooks
  const history = useHistory();
  const { step: slug } = useParams();

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
    },
    [submissionStep.url]
  );

  const previousData = previouslyCheckedDataRef.current;

  const performLogicCheck = async () => {
    if (previousData && isEqual(previousData, data)) return;
    if (isEmpty(data)) return;
    previouslyCheckedDataRef.current = data;
    dispatch({type: 'BLOCK_SUBMISSION'});
    // call the backend to do the check
    const {submission, step} = await doLogicCheck(submissionStep.url, data);
    onLogicChecked(submission, step); // report back to parent component
    const formInstance = formRef.current.instance.instance;
    // we can't just dispatch this, because Formio keeps references to DOM nodes
    // which expire when the component re-renders, and that gives React
    // unstable_flushDiscreteUpdates warnings. However, we can update the form
    // definition by using the ref to the underlying Formio instance.
    // NOTE that this does effectively bring our state.configuration out of sync
    // with the actual form configuration (!).
    formInstance.setForm(step.formStep.configuration);
    // the reminder of the state updates we let the reducer handle
    dispatch({
      type: 'LOGIC_CHECK_DONE',
      payload: {
        submission,
        step,
      },
    });
  };

  const onFormIOSubmit = async ({ data }) => {
    if (!submission) {
      throw new Error("There is no active submission!");
    }

    await submitStepData(submissionStep.url, data);
    // TODO: is this needed? and shouldn't we just update the state?
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
    const formInstance = formRef.current.instance.instance;
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
  const onFormIOChange = (changed, flags, modifiedByHuman) => {
    // if there are no changes, do nothing
    if ( !(flags && flags.changes && flags.changes.length) ) return;
    if ( !modifiedByHuman ) return;
    dispatch({
      type: 'STEP_DATA_UPDATED',
      payload: {...changed.data},
    });
  };

  // See 'blur' event https://help.form.io/developers/form-renderer#form-events
  const onFormIOBlur = (instance) => {
    // Note that we do not need to handle the response
    performLogicCheck();
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
              submission={{data: Object.fromEntries(Object.entries(data).filter(([_, value]) => !!value ))}}
              onChange={onFormIOChange}
              onBlur={onFormIOBlur}
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

export default FormStep;
