/**
 * Render a single form step, as part of a started submission for a form.
 */

import React, {useRef} from 'react';
import PropTypes from 'prop-types';

import useAsync from 'react-use/esm/useAsync';
import { useImmerReducer } from "use-immer";

import { get, put } from './api';

import Button from './Button';
import Card from './Card';
import FormIOWrapper from './FormIOWrapper';
import FormStepsSidebar from './FormStepsSidebar';
import { Toolbar, ToolbarList } from './Toolbar';

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

const FormStep = ({ form, step, submission, onLastStepSubmitted }) => {
  const formRef = useRef(null);
  const [state, dispatch] = useImmerReducer(reducer, initialState);

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

    // check if we need to invoke the logic for the last step
    // TODO: there *may* be optional steps, so completion/summary can already get
    // triggered earlier, potentially. This will need to be incorporated later.
    const isLastStep = submission.steps.reverse()[0] === step;
    if (isLastStep) {
      onLastStepSubmitted();
    }
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

  const {data, configuration} = state;

  return (
    <Card title={form.name}>

      <div style={{display: 'flex'}}>

        { loading ? 'Loading...' : null }

        <div style={{width: '75%'}}>
          {
            (!loading && configuration) ? (
              <form onSubmit={onReactSubmit}>
                <FormIOWrapper
                  ref={formRef}
                  form={configuration}
                  submission={data}
                  onSubmit={onFormIOSubmit}
                  options={{noAlerts: true}}
                />
                <Toolbar>
                  <ToolbarList>
                    <Button variant="anchor" component="a">Vorige pagina</Button>
                  </ToolbarList>
                  <ToolbarList>
                    <Button type="button" variant="secondary" name="save" onClick={onFormSave} disabled>Tussentijds opslaan</Button>
                    <Button type="submit" variant="primary" name="next">Volgende</Button>
                  </ToolbarList>
                </Toolbar>
              </form>
            ) : null
          }

        </div>

        <FormStepsSidebar steps={form.steps} />

      </div>

    </Card>
  );
};

FormStep.propTypes = {
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
  step: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    optional: PropTypes.bool.isRequired,
    available: PropTypes.bool.isRequired,
    completed: PropTypes.bool.isRequired,
    formStep: PropTypes.string.isRequired,
  }).isRequired,
  submission: PropTypes.object.isRequired,
  onLastStepSubmitted: PropTypes.func.isRequired,
};


export default FormStep;
