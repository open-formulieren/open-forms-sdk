import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import { useImmerReducer } from "use-immer";
import {
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';


import { ConfigContext } from './Context';

import { get, post } from './api';
import Summary from './Summary';
import FormStart from './FormStart';
import FormStep from './FormStep';
import FormStepsSidebar from './FormStepsSidebar';
import { Layout, LayoutRow, LayoutColumn } from './Layout';
import RequireSubmission from './RequireSubmission';

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


const initialState = {
  config: {baseUrl: ''},
  submission: null,
};


const reducer = (draft, action) => {
  switch (action.type) {
    case 'SUBMISSION_LOADED': {
      // keep the submission instance in the state and set the current step to the
      // first step of the form.
      const submission = action.payload;
      draft.submission = submission;
      break;
    }
    case 'SUBMITTED': {
      return {
        ...initialState,
        config: draft.config,
      };
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
};

/**
 * An OpenForms form.
 *
 *
 * OpenForms forms consist of some metadata and individual steps.
 * @param  {Object} options.form The form definition from the Open Forms API
 * @return {JSX}
 */
 const Form = ({ form }) => {
  const history = useHistory();

  // extract the declared properties and configuration
  const {steps} = form;
  const config = useContext(ConfigContext);

  // load the state management/reducer
  const initialStateFromProps = {...initialState, config, step: steps[0]};
  const [state, dispatch] = useImmerReducer(reducer, initialStateFromProps);

  /**
   * When the form is started, create a submission and add it to the state.
   *
   * @param  {Event} event The DOM event, could be a button click or a custom event.
   * @return {Void}
   */
  const onFormStart = async (event) => {
    event.preventDefault();
    const firstStepRoute = `/stap/${form.steps[0].slug}`;

    if (state.submission != null) {
      // TODO: how should we handle this? when there's already a submission started
      // and the user navigates back to the start page?
      console.error("There already is an active form submission.");
      history.push(firstStepRoute);
      return;
    }

    const {config} = state;
    const submission = await createSubmission(config, form);
    dispatch({
      type: 'SUBMISSION_LOADED',
      payload: submission,
    });

    // navigate to the first step
    history.push(firstStepRoute);
  };

  const onStepSubmitted = async (formStep) => {
    const stepIndex = form.steps.indexOf(formStep);
    // TODO: there *may* be optional steps, so completion/summary can already get
    // triggered earlier, potentially. This will need to be incorporated later.
    const nextStep = form.steps[stepIndex + 1]; // will be undefined if it's the last step

    // refresh the submission from the backend
    const submission = await get(state.submission.url);
    dispatch({
      type: 'SUBMISSION_LOADED',
      payload: submission,
    });

    const nextUrl = nextStep ? `/stap/${nextStep.slug}` : '/overzicht';
    history.push(nextUrl);
  };

  // render the form step if there's an active submission (and no summary)
  return (
    <Layout>
      <LayoutRow>
        <LayoutColumn>

          {/* Route the correct page based on URL */}
          <Switch>

            <Route exact path="/">
              <FormStart form={form} onFormStart={onFormStart} />
            </Route>

            <Route exact path="/overzicht">
              <RequireSubmission
                submission={state.submission}
                onConfirm={() => dispatch({type: 'SUBMITTED'})}
                component={Summary} />
            </Route>

            <Route path="/stap/:step" render={() => (
              <RequireSubmission
                submission={state.submission}
                form={form}
                onStepSubmitted={onStepSubmitted}
                component={FormStep}
              />
            )} />

          </Switch>

        </LayoutColumn>

        <LayoutColumn modifiers={['secondary']}>
          <FormStepsSidebar
            title={form.name}
            steps={form.steps}
            submission={state.submission}
          />
        </LayoutColumn>

      </LayoutRow>
    </Layout>
  );
};

Form.propTypes = {
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
