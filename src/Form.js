import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';

// import { Errors as FormioErrors } from 'react-formio';
import useAsync from 'react-use/esm/useAsync';
import { useImmerReducer } from "use-immer";

import FormIOWrapper from './FormIOWrapper';
import { ConfigContext } from './Context';
import FormStepsSidebar from './FormStepsSidebar';
import { get, post, put } from './api';


/**
 * Create a submission instance from a given form instance
 * @param  {Object} config The Open Forms backend config parameters, containing the baseUrl
 * @param  {Object} form   The relevant Open Forms form instance.
 * @return {Object}        The Submission instance.
 */
const createSubmission = async (config, form) => {
  const submissionResponse = await post(`${config.baseUrl}submissions`, {form: form.url});
  return submissionResponse.data;
};


const submitStepData = async (stepUrl, data) => {
  const stepDataResponse = await put(stepUrl, {data});
  return stepDataResponse.data;
};


const initialState = {
  config: {baseUrl: ''},
  step: {url: ''},
  stepConfiguration: {},
  submission: null,
};


const reducer = (draft, action) => {
  switch (action.type) {
    case 'STEP_LOADED': {
      const { configuration } = action.payload;
      draft.stepConfiguration = configuration;
      break;
    }
    case 'SUBMISSION_CREATED': {
      draft.submission = action.payload;
      break;
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
};

/**
 * An OpenForms form.
 *
 * TODO: this is currently working on raw form step definitions, without integration in
 * specific submissions (i.e. we can't do anything cool yet with custom hooks and
 * custom field types in FormIO.js)
 *
 * OpenForms forms consist of some metadata and individual steps.
 * @param  {Object} options.form The form definition from the Open Forms API
 * @return {JSX}
 */
 const Form = ({ form, titleComponent='h2' }) => {
  // extract the declared properties and configuration
  const { name, steps } = form;
  const Title = `${titleComponent}`;
  const config = useContext(ConfigContext);

  // load the state management/reducer
  const initialStateFromProps = {...initialState, config, step: steps[0]};
  const [state, dispatch] = useImmerReducer(reducer, initialStateFromProps);

  // fetch the form step configuration
  const {loading} = useAsync(
    async () => {
      if (!state.step || !state.step.url) return;
      const stepDetail = await get(state.step.url);
      dispatch({
        type: 'STEP_LOADED',
        payload: stepDetail,
      });
    },
    [state.step]
  );

  const formRef = useRef(null);

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

  const onFormIOSubmit = async ({ data }) => {
    const { step, config } = state;
    let { submission } = state;

    // if there's currently no submission active, start one
    if (step === form.steps[0] && !submission) {
      submission = await createSubmission(config, form);
      dispatch({
        type: 'SUBMISSION_CREATED',
        payload: submission,
      });
    }

    if (!submission) {
      throw new Error("There is no active submission!");
    }

    // submit the step data as well - grab the correct submission step based on the
    // index of the form step
    const submissionStep = submission.steps[form.steps.indexOf(step)];
    await submitStepData(submissionStep.url, data);
  };

  return (
    <div className="card">
      <header className="card__header">
        <Title className="title">{name}</Title>
      </header>

      <div className="card__body" style={{display: 'flex'}}>

        { loading ? 'Loading...' : null }

        <div style={{width: '75%'}}>
          {
            (!loading && state.stepConfiguration) ? (
              <form onSubmit={onReactSubmit}>
                <FormIOWrapper
                  ref={formRef}
                  form={state.stepConfiguration}
                  onSubmit={onFormIOSubmit}
                  options={{noAlerts: true}}
                />
                <button type="submit">Submit</button>
              </form>
            ) : null
          }
        </div>

        <FormStepsSidebar steps={steps} />

      </div>
    </div>
    );
};

Form.propTypes = {
  titleComponent: PropTypes.string,
  form: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    loginRequired: PropTypes.bool.isRequired,
    product: PropTypes.object,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      formDefinition: PropTypes.string.isRequired,
      index: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};

export { Form };
