/**
 * Render a single form step, as part of a started submission for a form.
 */

import React, {useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';

import useAsync from 'react-use/esm/useAsync';
import { useImmerReducer } from "use-immer";

import { get, put } from './api';

import Button from './Button';
import Card from './Card';
import { ConfigContext } from './Context';
import FormIOWrapper from './FormIOWrapper';
import { Toolbar, ToolbarList } from './Toolbar';
import Types from './types';

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
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
};

const submitStepData = async (stepUrl, data) => {
  const stepDataResponse = await put(stepUrl, {data});
  return stepDataResponse.data;
};

const FormStep = ({ form, submission, onStepSubmitted }) => {
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

  const onFormIOSubmit = async ({ data }) => {
    if (!submission) {
      throw new Error("There is no active submission!");
    }

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

  const {data, configuration} = state;

  return (
    <Card title={step.name}>
      { loading ? 'Loading...' : null }

      {
        (!loading && configuration) ? (
          <form onSubmit={onReactSubmit}>
            <FormIOWrapper
              ref={formRef}
              url="http://localhost:3000/bla"
              form={configuration}
              submission={{data: data}}
              onSubmit={onFormIOSubmit}
              options={{noAlerts: true, baseUrl: config.baseUrl}}
            />
            <Toolbar>
              <ToolbarList>
                <Button
                  variant="anchor"
                  component="a"
                  onClick={onPrevPage}
                >{formStep.literals.previousText.resolved}</Button>
              </ToolbarList>
              <ToolbarList>
                <Button type="button" variant="secondary" name="save" onClick={onFormSave} disabled>{formStep.literals.saveText.resolved}</Button>
                <Button type="submit" variant="primary" name="next">{formStep.literals.nextText.resolved}</Button>
              </ToolbarList>
            </Toolbar>
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
};


export default FormStep;
