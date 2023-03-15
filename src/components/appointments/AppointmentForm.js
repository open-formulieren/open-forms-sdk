import PropTypes from 'prop-types';
import React, {useContext, useEffect, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {Route, Switch, useHistory, useLocation, useRouteMatch} from 'react-router-dom';

import {ConfigContext} from 'Context';
import Body from 'components/Body';
import Card from 'components/Card';
import ErrorBoundary from 'components/ErrorBoundary';
import FormDisplay from 'components/FormDisplay';
import {LiteralsProvider} from 'components/Literal';
import Loader from 'components/Loader';
import ProgressIndicatorDisplay from 'components/ProgressIndicator/ProgressIndicatorDisplay';
import {STEP_LABELS} from 'components/ProgressIndicator/constants';
import SummaryConfirmation from 'components/SummaryConfirmation';
import AppointmentStep from 'components/appointments/AppointmentStep';
import {SUBMISSION_ALLOWED} from 'components/constants';
import useTitle from 'hooks/useTitle';
import Types from 'types';

const AppointmentProgressIndicator = ({title}) => {
  const {pathname} = useLocation();
  const [expanded, setExpanded] = useState(false);

  // collapse the expanded progress indicator if nav occurred, see
  // open-formulieren/open-forms#2673. It's important that *only* the pathname triggers
  // the effect, which is why exhaustive deps is ignored.
  useEffect(() => {
    if (expanded) {
      setExpanded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const config = useContext(ConfigContext);
  const summaryMatch = !!useRouteMatch('/appointment/overzicht');
  const confirmationMatch = !!useRouteMatch('/appointment/bevestiging');
  const appointmentMatch = !!useRouteMatch('/appointment');

  // figure out the title for the mobile menu based on the state
  let activeStepTitle;
  if (summaryMatch) {
    activeStepTitle = STEP_LABELS.overview;
  } else if (confirmationMatch) {
    activeStepTitle = STEP_LABELS.confirmation;
  } else {
    activeStepTitle = STEP_LABELS.appointment;
  }

  const ProgressIndicatorDisplayComponent =
    config?.displayComponents?.progressIndicator ?? ProgressIndicatorDisplay;

  return (
    <ProgressIndicatorDisplayComponent
      activeStepTitle={activeStepTitle}
      formTitle={title}
      steps={[]}
      hasSubmission={false}
      isStartPage={false}
      isSummary={summaryMatch}
      isConfirmation={confirmationMatch}
      isAppointment={appointmentMatch}
      isSubmissionComplete={false}
      areApplicableStepsCompleted={false}
      showOverview={true}
      showConfirmation={true}
      showAppointment={true}
      onExpandClick={() => setExpanded(!expanded)}
    />
  );
};

AppointmentProgressIndicator.propTypes = {
  title: PropTypes.string.isRequired,
};

const AppointmentSummary = ({form, onConfirm}) => {
  const history = useHistory();
  const onPrevPage = event => {
    event.preventDefault();
    history.push('/appointment');
  };

  const intl = useIntl();
  const pageTitle = intl.formatMessage({
    description: 'Summary page title',
    defaultMessage: 'Check and confirm',
  });
  useTitle(pageTitle);

  const [privacy, setPrivacy] = useState({
    requiresPrivacyConsent: true,
    privacyLabel: '',
    policyAccepted: false,
  });

  return (
    <Card
      title={
        <FormattedMessage
          description="Check overview and confirm"
          defaultMessage="Check and confirm"
        />
      }
    >
      <LiteralsProvider literals={form.literals}>
        <form onSubmit={onConfirm}>
          <SummaryConfirmation
            submissionAllowed={SUBMISSION_ALLOWED.yes}
            privacy={privacy}
            onPrivacyCheckboxChange={e =>
              setPrivacy({...privacy, policyAccepted: e.target.checked})
            }
            onPrevPage={onPrevPage}
          />
        </form>
      </LiteralsProvider>
    </Card>
  );
};

AppointmentSummary.propTypes = {
  form: Types.Form.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

const AppointmentConfirmation = () => {
  const intl = useIntl();
  const pageTitle = intl.formatMessage({
    description: 'Confirmation page title',
    defaultMessage: 'Confirmation',
  });
  useTitle(pageTitle);

  return (
    <Card
      title={
        <FormattedMessage
          description="Checking background processing status title"
          defaultMessage="Processing..."
        />
      }
    >
      <Loader modifiers={['centered']} />
      <Body>
        <FormattedMessage
          description="Checking background processing status body"
          defaultMessage="Please hold on while we're processing your submission."
        />
      </Body>
    </Card>
  );
};

AppointmentConfirmation.propTypes = {};

const AppointmentForm = ({form}) => {
  const history = useHistory();

  // extract the declared properties and configuration
  const config = useContext(ConfigContext);
  const onSubmitForm = () => {
    history.push('/appointment/bevestiging');
  };

  const onAppointmentSubmit = () => {
    console.log('Appointment data were filled');
    history.push('/appointment/overzicht');
  };

  const progressIndicator = form.showProgressIndicator ? (
    // should we use generic ProgressIndicator?
    <AppointmentProgressIndicator title={form.name} />
  ) : null;

  // Route the correct page based on URL
  const router = (
    <Switch>
      <Route path="/appointment/overzicht">
        <ErrorBoundary useCard>
          <AppointmentSummary form={form} onConfirm={onSubmitForm} />
        </ErrorBoundary>
      </Route>

      <Route path="/appointment/bevestiging">
        <ErrorBoundary useCard>
          <AppointmentConfirmation />
        </ErrorBoundary>
      </Route>

      <Route path="/">
        <ErrorBoundary useCard>
          <AppointmentStep form={form} onSubmit={onAppointmentSubmit} />
        </ErrorBoundary>
      </Route>
    </Switch>
  );

  const FormDisplayComponent = config?.displayComponents?.form ?? FormDisplay;
  return (
    <FormDisplayComponent
      router={router}
      progressIndicator={progressIndicator}
      showProgressIndicator={form.showProgressIndicator}
      isPaymentOverview={false}
    />
  );
};

AppointmentForm.propTypes = {
  form: Types.Form.isRequired,
};

export default AppointmentForm;
