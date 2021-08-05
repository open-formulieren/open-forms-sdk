/**
 * Render a single form step, as part of a started submission for a form.
 */

import React, {useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';

import useAsync from 'react-use/esm/useAsync';
import useDebounce from 'react-use/esm/useDebounce';
import { useImmerReducer } from 'use-immer';

import { get, post, put } from 'api';

import Button from 'components/Button';
import Card from 'components/Card';
import FormIOWrapper from 'components/FormIOWrapper';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import Loader from 'components/Loader';
import { ConfigContext } from 'Context';
import Types from 'types';
import LogoutButton from 'components/LogoutButton';

const STEP_LOGIC_DEBOUNCE_MS = 300;

const initialState = {
  configuration: null,
  data: null,
};

const reducer = (draft, action) => {
  switch (action.type) {
    case 'STEP_LOADED': {
      const {data, formStep: {configuration}} = action.payload;
      draft.configuration = configuration;
      draft.data = data;
      break;
    }
    case 'FORM_CHANGED': {
      draft.data = action.payload;
      break;
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
};

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

const FormStep = ({ form, submission, onStepSubmitted, onLogout }) => {
  const config = useContext(ConfigContext);
  // component state
  const formRef = useRef(null);
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  // react router hooks
  const history = useHistory();
  const { step: slug } = useParams();

  // look up the form step via slug so that we can obtain the submission step
  const formStep = form.steps.find(s => s.slug === slug);
  const step = submission.steps.find(s => s.formStep === formStep.url);

  // fetch the form step configuration
  const {loading} = useAsync(
    async () => {
      const stepDetail = await get(step.url);
      dispatch({
        type: 'STEP_LOADED',
        payload: stepDetail,
      });
    },
    [step.url]
  );

  const [isCheckingLogic, cancelLogicCheck] = useDebounce(
    async () => {
      const data = state.data;
      if (!data) return;

      const stepDetail = await doLogicCheck(step.url, data);

      // TODO: check custom attributes for submission button control
      const formInstance = formRef.current.instance.instance;

      // we can't just dispatch this, because Formio keeps references to DOM nodes
      // which expire when the component re-renders, and that gives React
      // unstable_flushDiscreteUpdates warnings. However, we can update the form
      // definition by using the ref to the underlying Formio instance.
      formInstance.setForm(stepDetail.formStep.configuration);
    },
    STEP_LOGIC_DEBOUNCE_MS,
    [state.data]
  );

  const onFormIOSubmit = async ({ data }) => {
    if (!submission) {
      throw new Error("There is no active submission!");
    }

    // if any logic checks are scheduled, cancel them since we're submitting
    cancelLogicCheck();

    // submit the step data
    await submitStepData(step.url, data);
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
    console.log('save form button clicked');
  };

  const onPrevPage = (event) => {
    event.preventDefault();
    const indexPreviousStep = form.steps.indexOf(formStep) - 1;
    const prevStepSlug = form.steps[indexPreviousStep]?.slug;
    const navigateTo = prevStepSlug ? `/stap/${prevStepSlug}` : '/';
    history.push(navigateTo);
  };

  // See https://help.form.io/developers/form-renderer#form-events
  const onFormIOChange = (changed, flags, modifiedByHuman) => {
    // if there are no changes, do nothing
    if ( !(flags && flags.changes && flags.changes.length) ) return;
    if ( !modifiedByHuman ) return;
    const data = {...changed.data};
    dispatch({type: 'FORM_CHANGED', payload: data});
  };

  const {data, configuration} = state;

  return (
    <Card title={step.name}>
      { loading ? <Loader modifiers={['centered']} /> : null }

      {
        (!loading && configuration) ? (
          <form onSubmit={onReactSubmit}>
            <FormIOWrapper
              ref={formRef}
              form={configuration}
              submission={{data: data}}
              onChange={onFormIOChange}
              onSubmit={onFormIOSubmit}
              options={{noAlerts: true, baseUrl: config.baseUrl}}
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
                <Button
                  type="button"
                  variant="secondary"
                  name="save" onClick={onFormSave} disabled>{formStep.literals.saveText.resolved}</Button>
                <Button
                  type="submit"
                  variant="primary"
                  name="next"
                  disabled={!!isCheckingLogic}
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
  onStepSubmitted: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};


export default FormStep;
