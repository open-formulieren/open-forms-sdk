import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import { useImmerReducer } from "use-immer";
import {
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';


import { ConfigContext } from './Context';

import { post } from './api';
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
  step: null,
  submission: null,
  showSummary: false,
};


const reducer = (draft, action) => {
  switch (action.type) {
    case 'SUBMISSION_CREATED': {
      // keep the submission instance in the state and set the current step to the
      // first step of the form.
      const submission = action.payload;
      draft.submission = submission;
      draft.step = submission.steps[0];
      break;
    }
    case 'SHOW_SUMMARY': {
      draft.showSummary = true;
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
    if (state.submission != null) {
      throw new Error("There already is an active form submission.");
    }

    const {config} = state;
    const submission = await createSubmission(config, form);
    dispatch({
      type: 'SUBMISSION_CREATED',
      payload: submission,
    });

    // navigate to the first step
    history.push(`/stap/${form.steps[0].slug}`);
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
              { state.showSummary && <Summary submission={state.submission} onConfirm={ () => dispatch({type: 'SUBMITTED'}) } /> }
            </Route>

            <Route path="/stap/:step" render={() => (
              <RequireSubmission submission={state.submission}>
                <FormStep
                  form={form}
                  step={state.step}
                  submission={state.submission}
                  onLastStepSubmitted={() => dispatch({type: 'SHOW_SUMMARY'})}
                />
              </RequireSubmission>
            )} />

          </Switch>

        </LayoutColumn>

        <LayoutColumn modifiers={['secondary']}>
          <FormStepsSidebar title={form.name} steps={form.steps} />
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
