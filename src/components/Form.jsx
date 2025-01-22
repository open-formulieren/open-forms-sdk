import {useContext, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {Navigate, Outlet, useLocation, useNavigate, useSearchParams} from 'react-router';
import {usePrevious} from 'react-use';

import {ConfigContext} from 'Context';
import {destroy} from 'api';
import FormProgressIndicator from 'components/FormProgressIndicator';
import Loader from 'components/Loader';
import SubmissionProvider from 'components/SubmissionProvider';
import AnalyticsToolsConfigProvider from 'components/analytics/AnalyticsToolConfigProvider';
import {START_FORM_QUERY_PARAM} from 'components/constants';
import {flagActiveSubmission, flagNoActiveSubmission} from 'data/submissions';
import useAutomaticRedirect from 'hooks/useAutomaticRedirect';
import useFormContext from 'hooks/useFormContext';
import usePageViews from 'hooks/usePageViews';
import useRecycleSubmission from 'hooks/useRecycleSubmission';

import FormDisplay from './FormDisplay';

/**
 * An OpenForms form.
 *
 *
 * OpenForms forms consist of some metadata and individual steps.
 * @param  {Object} options.form The form definition from the Open Forms API
 * @return {JSX}
 */
const Form = () => {
  const form = useFormContext();
  const navigate = useNavigate();
  const shouldAutomaticallyRedirect = useAutomaticRedirect(form);
  const [params] = useSearchParams();
  usePageViews();
  const intl = useIntl();
  const prevLocale = usePrevious(intl.locale);
  const {state: routerState} = useLocation();

  // extract the declared properties and configuration
  const config = useContext(ConfigContext);

  // figure out the submission in the state. If it's stored in the router state, extract
  // it and set it in the React state to 'persist' it.
  const submissionFromRouterState = routerState?.submission;
  const [submission, setSubmission] = useState(null);
  if (submission == null && submissionFromRouterState != null) {
    setSubmission(submissionFromRouterState);
  }

  const onSubmissionLoaded = submission => {
    setSubmission(submission);
    flagActiveSubmission();
  };

  // if there is an active submission still, re-load that (relevant for hard-refreshes)
  // TODO: should probably move to the router loader
  const [loading, setSubmissionId, removeSubmissionId] = useRecycleSubmission(
    form,
    submission,
    onSubmissionLoaded
  );

  useEffect(
    () => {
      if (prevLocale === undefined) return;
      if (intl.locale !== prevLocale && submission) {
        removeSubmissionId();
        setSubmission(null);
        flagNoActiveSubmission();
        navigate(`/?${START_FORM_QUERY_PARAM}=1`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intl.locale, prevLocale, removeSubmissionId, submission]
  );

  const onDestroySession = async () => {
    await destroy(`${config.baseUrl}authentication/${submission.id}/session`);
    removeSubmissionId();
    setSubmission(null);
    navigate('/');
  };

  // handle redirect from payment provider to render appropriate page and include the
  // params as state for the next component.
  if (params.get('of_payment_status')) {
    // TODO: store details in sessionStorage instead, to survive hard refreshes
    return (
      <Navigate
        replace
        to="/bevestiging"
        state={{
          status: params.get('of_payment_status'),
          userAction: params.get('of_payment_action'),
          statusUrl: params.get('of_submission_status'),
        }}
      />
    );
  }

  if (loading || shouldAutomaticallyRedirect) {
    return <Loader modifiers={['centered']} />;
  }

  // render the container for the router and necessary context providers for deeply
  // nested child components
  return (
    <FormDisplay progressIndicator={<FormProgressIndicator submission={submission} />}>
      <AnalyticsToolsConfigProvider>
        <SubmissionProvider
          submission={submission}
          onSubmissionObtained={submission => {
            onSubmissionLoaded(submission);
            setSubmissionId(submission.id);
          }}
          onDestroySession={onDestroySession}
          removeSubmissionId={removeSubmissionId}
        >
          <Outlet />
        </SubmissionProvider>
      </AnalyticsToolsConfigProvider>
    </FormDisplay>
  );
};

Form.propTypes = {};

export default Form;
