import React, {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';

import {ConfigContext} from 'Context';
import Body from 'components/Body';
import Card from 'components/Card';
import ErrorBoundary from 'components/ErrorBoundary';
import FormDisplay from 'components/FormDisplay';
import Loader from 'components/Loader';
import ProgressIndicatorDisplay from 'components/ProgressIndicator/ProgressIndicatorDisplay';
import {STEP_LABELS} from 'components/ProgressIndicator/constants';
import Summary from 'components/Summary';
import AppointmentStep from 'components/appointments/AppointmentStep';
import useTitle from 'hooks/useTitle';

const AppointmentProgressIndicator = ({title}) => {
  const config = useContext(ConfigContext);
  const summaryMatch = !!useRouteMatch('/overzicht');
  const confirmationMatch = !!useRouteMatch('/bevestiging');
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
    />
  );
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

  const onLogout = () => {
    // todo
    console.log('logout');
    history.push('/appointment');
  };

  const progressIndicator = form.showProgressIndicator ? (
    // should we use generic ProgressIndicator?
    <AppointmentProgressIndicator title={form.name} />
  ) : null;

  // Route the correct page based on URL
  const router = (
    <Switch>
      <Route path="/">
        <ErrorBoundary useCard>
          <AppointmentStep form={form} onSubmit={onAppointmentSubmit} />
        </ErrorBoundary>
      </Route>

      <Route path="/overzicht">
        <ErrorBoundary useCard>
          <Summary form={form} onLogout={onLogout} onConfirm={onSubmitForm} />
        </ErrorBoundary>
      </Route>

      <Route path="/bevestiging">
        <ErrorBoundary useCard>
          <AppointmentConfirmation />
        </ErrorBoundary>
      </Route>
    </Switch>
  );

  // render the form step if there's an active submission (and no summary)
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

export default AppointmentForm;
