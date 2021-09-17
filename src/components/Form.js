import React, {useContext} from 'react';
import { useImmerReducer } from 'use-immer';
import {
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';


import { ConfigContext } from 'Context';

import {destroy, post} from 'api';
import usePageViews from 'hooks/usePageViews';
import ErrorBoundary from 'components/ErrorBoundary';
import FormStart from 'components/FormStart';
import FormStep from 'components/FormStep';
import ProgressIndicator from 'components/ProgressIndicator';
import { Layout, LayoutRow, LayoutColumn } from 'components/Layout';
import RequireSubmission from 'components/RequireSubmission';
import SubmissionConfirmation from 'components/SubmissionConfirmation';
import Summary from 'components/Summary';
import Types from 'types';
import {useIntl} from 'react-intl';

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
  submittedSubmission: null,
  processingStatusUrl: '',
  processingError: '',
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
        submittedSubmission: action.payload.submission,
        processingStatusUrl: action.payload.processingStatusUrl,
      };
    }
    case 'PROCESSING_FAILED': {
      // set the error message in the state
      draft.processingError = action.payload;
      // put the submission back in the state as well, so we can re-submit
      draft.submission = draft.submittedSubmission;
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
 *
 * OpenForms forms consist of some metadata and individual steps.
 * @param  {Object} options.form The form definition from the Open Forms API
 * @return {JSX}
 */
 const Form = ({ form }) => {
  const history = useHistory();
  usePageViews();
  const intl = useIntl();

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
    event && event.preventDefault();
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

    const nextUrl = nextStep ? `/stap/${nextStep.slug}` : '/overzicht';
    history.push(nextUrl);
  };

  const onSubmitForm = (processingStatusUrl) => {
    dispatch({
      type: 'SUBMITTED',
      payload: {
        submission: state.submission,
        processingStatusUrl,
      }
    });
    history.push('/bevestiging');
  };

  const onLogout = async (event) => {
    event.preventDefault();

    const confirmationQuestion = intl.formatMessage(
      {
        description: 'log out confirmation prompt',
        defaultMessage: 'Are you sure that you want to logout?'
      }
    );
    if (!window.confirm(confirmationQuestion)) {
      return;
    }
    await destroy(`${config.baseUrl}authentication/session`);
    history.push('/');
    // TODO: replace with a proper reset of the state instead of a page reload.
    window.location.reload();
  };

  const onProcessingFailure = (errorMessage) => {
    dispatch({type: 'PROCESSING_FAILED', payload: errorMessage});
    history.push('/overzicht');
  };

  // render the form step if there's an active submission (and no summary)
  return (
    <Layout>
      <LayoutRow>
        <LayoutColumn modifiers={['mobile-order-2', 'mobile-padding-top']}>

          {/* Route the correct page based on URL */}
          <Switch>

            <Route exact path="/">
              <ErrorBoundary>
                <FormStart form={form} onFormStart={onFormStart} />
              </ErrorBoundary>
            </Route>

            <Route exact path="/overzicht">
              <RequireSubmission
                submission={state.submission}
                form={form}
                processingError={state.processingError}
                onConfirm={onSubmitForm}
                onLogout={onLogout}
                component={Summary} />
            </Route>

            <Route exact path="/bevestiging">
              <RequireSubmission
                submission={state.submittedSubmission}
                statusUrl={state.processingStatusUrl}
                onFailure={onProcessingFailure}
                component={SubmissionConfirmation} />
            </Route>

            <Route path="/stap/:step" render={() => (
              <RequireSubmission
                form={form}
                submission={state.submission}
                onLogicChecked={(submission) => dispatch({type: 'SUBMISSION_LOADED', payload: submission})}
                onStepSubmitted={onStepSubmitted}
                onLogout={onLogout}
                component={FormStep}
              />
            )} />

          </Switch>

        </LayoutColumn>

        {
          form.showProgressIndicator
          ? (
            <LayoutColumn modifiers={['secondary', 'mobile-order-1', 'mobile-sticky']}>
              <ProgressIndicator
                title={form.name}
                steps={form.steps}
                submission={state.submission}
              />
            </LayoutColumn>
          )
          : null
        }

      </LayoutRow>
    </Layout>
  );
};

Form.propTypes = {
  form: Types.Form.isRequired,
};

export { Form };
