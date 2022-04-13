import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import {useImmerReducer} from 'use-immer';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  //useRouteMatch,
} from 'react-router-dom';

import {ConfigContext} from 'Context';

import {destroy, post} from 'api';
import usePageViews from 'hooks/usePageViews';
import useRecycleSubmission from 'hooks/useRecycleSubmission';
import useSessionTimeout from 'hooks/useSessionTimeout';
import ErrorBoundary from 'components/ErrorBoundary';
import FormStart from 'components/FormStart';
import FormStep from 'components/FormStep';
import {LayoutColumn} from 'components/Layout';
import Loader from 'components/Loader';
// import ProgressIndicator from 'components/ProgressIndicator';
import PaymentOverview from 'components/PaymentOverview';
import RequireSubmission from 'components/RequireSubmission';
import {RequireSession} from 'components/Sessions';
import SubmissionConfirmation from 'components/SubmissionConfirmation';
import Summary from 'components/Summary';
import {findNextApplicableStep} from 'components/utils';
import useQuery from 'hooks/useQuery';
import Types from 'types';
import useAutomaticRedirect from 'hooks/useAutomaticRedirect';

/**
 * Create a submission instance from a given form instance
 * @param  {Object} config The Open Forms backend config parameters, containing the baseUrl
 * @param  {Object} form   The relevant Open Forms form instance.
 * @return {Object}        The Submission instance.
 */
const createSubmission = async (config, form) => {
  const createData = {
    form: form.url,
    formUrl: window.location.toString(),
  };
  const submissionResponse = await post(`${config.baseUrl}submissions`, createData);
  return submissionResponse.data;
};

const initialState = {
  config: {baseUrl: ''},
  submission: null,
  submittedSubmission: null,
  processingStatusUrl: '',
  processingError: '',
  completed: false,
};


const reducer = (draft, action) => {
  switch (action.type) {
    case 'SUBMISSION_LOADED': {
      // keep the submission instance in the state and set the current step to the
      // first step of the form.
      draft.submission = action.payload;
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
    case 'PROCESSING_SUCCEEDED': {
      draft.processingError = null;
      draft.completed = true;
      break;
    }
    case 'CLEAR_PROCESSING_ERROR': {
      draft.processingError = '';
      break;
    }
    case 'SESSION_EXPIRED': {
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
const Form = ({form}) => {
  const history = useHistory();
  const shouldAutomaticallyRedirect = useAutomaticRedirect(form);
  const queryParams = useQuery();
  usePageViews();
  const intl = useIntl();

  // extract the declared properties and configuration
  const {steps} = form;
  const config = useContext(ConfigContext);

  // load the state management/reducer
  const initialStateFromProps = {...initialState, config, step: steps[0]};
  const [state, dispatch] = useImmerReducer(reducer, initialStateFromProps);

  const onSubmissionLoaded = (submission, next = '') => {
    if (sessionExpired) return;
    dispatch({
      type: 'SUBMISSION_LOADED',
      payload: submission,
    });
    // navigate to the first step
    const firstStepRoute = `/stap/${form.steps[0].slug}`;
    history.push(next ? next : firstStepRoute);
  }

  // if there is an active submission still, re-load that (relevant for hard-refreshes)
  const [
    loading,
    setSubmissionId,
    removeSubmissionId
  ] = useRecycleSubmission(form, state.submission, onSubmissionLoaded);

  const [sessionExpired, resetSession] = useSessionTimeout(
    () => {
      removeSubmissionId();
      dispatch({type: 'SESSION_EXPIRED'});
    }
  );

  //const paymentOverviewMatch = useRouteMatch('/betaaloverzicht');

  /**
   * When the form is started, create a submission and add it to the state.
   *
   * @param  {Event} event The DOM event, could be a button click or a custom event.
   * @return {Void}
   */
  const onFormStart = async (event) => {
    event && event.preventDefault();

    // required to get rid of the error message saying the session is expired - once
    // you start a new submission, any previous call history should be discarded.
    resetSession();

    if (state.submission != null) {
      onSubmissionLoaded(state.submission);
      return;
    }

    const {config} = state;
    const submission = await createSubmission(config, form);
    dispatch({
      type: 'SUBMISSION_LOADED',
      payload: submission,
    });
    setSubmissionId(submission.id);
    // navigate to the first step
    const firstStepRoute = `/stap/${form.steps[0].slug}`;
    history.push(firstStepRoute);
  };

  const onStepSubmitted = async (formStep) => {
    const currentStepIndex = form.steps.indexOf(formStep);

    const nextStepIndex = findNextApplicableStep(currentStepIndex, state.submission);
    const nextStep = form.steps[nextStepIndex]; // will be undefined if it's the last step

    const nextUrl = nextStep ? `/stap/${nextStep.slug}` : '/overzicht';
    history.push(nextUrl);
  };

  const onSubmitForm = (processingStatusUrl) => {
    removeSubmissionId();
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
    await destroy(`${config.baseUrl}authentication/${state.submission.id}/session`);
    removeSubmissionId();
    history.push('/');
    // TODO: replace with a proper reset of the state instead of a page reload.
    window.location.reload();
  };

  const onProcessingFailure = (errorMessage) => {
    // TODO: provide generic fallback message in case no explicit
    // message is shown
    dispatch({type: 'PROCESSING_FAILED', payload: errorMessage});
    history.push('/overzicht');
  };

  // handle redirect from payment provider to render appropriate page and include the
  // params as state for the next component.
  if (queryParams.get('of_payment_status')) {
    return (
      <Redirect to={{
        pathname: '/betaaloverzicht',
        state: {
          status: queryParams.get('of_payment_status'),
          userAction: queryParams.get('of_payment_action'),
        },
      }}/>
    );
  }

  if (loading || shouldAutomaticallyRedirect) {
    return (
      <LayoutColumn>
        <Loader modifiers={['centered']}/>
      </LayoutColumn>
    );
  }

  // render the form step if there's an active submission (and no summary)
  return (
    <>
      <LayoutColumn modifiers={['mobile-order-2', 'mobile-padding-top']}>
        {/* Route the correct page based on URL */}
        <Switch>

          <Route exact path="/">
            <ErrorBoundary>
              <FormStart form={form} onFormStart={onFormStart}/>
            </ErrorBoundary>
          </Route>

          <Route exact path="/overzicht">
            <RequireSession expired={sessionExpired}>
              <RequireSubmission
                submission={state.submission}
                form={form}
                processingError={state.processingError}
                onConfirm={onSubmitForm}
                onLogout={onLogout}
                component={Summary}
                onClearProcessingErrors={() => dispatch({type: 'CLEAR_PROCESSING_ERROR'})}
              />
            </RequireSession>
          </Route>

          <Route exact path="/bevestiging">
            <RequireSubmission
              submission={state.submittedSubmission}
              statusUrl={state.processingStatusUrl}
              onFailure={onProcessingFailure}
              onConfirmed={() => dispatch({type: 'PROCESSING_SUCCEEDED'})}
              component={SubmissionConfirmation}/>
          </Route>

          <Route exact path="/betaaloverzicht">
            <ErrorBoundary>
              <PaymentOverview/>
            </ErrorBoundary>
          </Route>

          <Route path="/stap/:step" render={() => (
            <RequireSession expired={sessionExpired}>
              <RequireSubmission
                form={form}
                submission={state.submission}
                onLogicChecked={(submission) => dispatch({type: 'SUBMISSION_LOADED', payload: submission})}
                onStepSubmitted={onStepSubmitted}
                onLogout={onLogout}
                component={FormStep}
              />
            </RequireSession>
          )}/>

        </Switch>

      </LayoutColumn>

      {/*{
        form.showProgressIndicator && !paymentOverviewMatch
        ? (
          <LayoutColumn modifiers={['secondary', 'mobile-order-1', 'mobile-sticky']}>
            <ProgressIndicator
              title={form.name}
              steps={form.steps}
              submission={state.submission || state.submittedSubmission}
              submissionAllowed={form.submissionAllowed}
              completed={state.completed}
            />
          </LayoutColumn>
        )
        : null
      }*/}
    </>
  );
};

Form.propTypes = {
  form: Types.Form.isRequired,
};

export default Form;
