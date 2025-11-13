import {LoadingIndicator} from '@open-formulieren/formio-renderer';
import {useContext, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {Navigate, Outlet, useLocation, useMatch, useNavigate, useSearchParams} from 'react-router';
import {usePrevious} from 'react-use';

import {ConfigContext} from '@/Context';
import {destroy} from '@/api';
import FormProgressIndicator from '@/components/FormProgressIndicator';
import SubmissionProvider from '@/components/SubmissionProvider';
import AnalyticsToolsConfigProvider from '@/components/analytics/AnalyticsToolConfigProvider';
import {START_FORM_QUERY_PARAM} from '@/components/constants';
import {type Submission, flagActiveSubmission, flagNoActiveSubmission} from '@/data/submissions';
import useAutomaticRedirect from '@/hooks/useAutomaticRedirect';
import useFormContext from '@/hooks/useFormContext';
import usePageViews from '@/hooks/usePageViews';
import useRecycleSubmission from '@/hooks/useRecycleSubmission';

import FormDisplay from './FormDisplay';

/**
 * An OpenForms form.
 */
const Form: React.FC = () => {
  const form = useFormContext();
  const navigate = useNavigate();
  const shouldAutomaticallyRedirect = useAutomaticRedirect(form);
  const [params] = useSearchParams();
  usePageViews();
  const intl = useIntl();
  const prevLocale = usePrevious(intl.locale);
  const {state: routerState} = useLocation();
  const confirmationMatch = useMatch('/bevestiging');

  // extract the declared properties and configuration
  const config = useContext(ConfigContext);

  // figure out the submission in the state. If it's stored in the router state, extract
  // it and set it in the React state to 'persist' it.
  const submissionFromRouterState: Submission | undefined | null = routerState?.submission;
  const [submission, setSubmission] = useState<Submission | null>(null);
  if (submission == null && submissionFromRouterState != null) {
    setSubmission(submissionFromRouterState);
  }

  const onSubmissionLoaded = (submission: Submission) => {
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
    if (!submission) return;
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
          statusUrl: params.get('of_submission_status'),
        }}
      />
    );
  }

  if (loading || shouldAutomaticallyRedirect) {
    return <LoadingIndicator position="center" />;
  }

  // don't render the PI if the form is configured to never display the progress
  // indicator, or we're on the final confirmation page
  const showProgressIndicator = form.showProgressIndicator && !confirmationMatch;

  // render the container for the router and necessary context providers for deeply
  // nested child components
  return (
    <FormDisplay
      progressIndicator={
        showProgressIndicator ? <FormProgressIndicator submission={submission} /> : null
      }
    >
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

export default Form;
