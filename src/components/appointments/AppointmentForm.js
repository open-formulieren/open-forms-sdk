import React, {useContext} from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';

import {ConfigContext} from 'Context';
import ErrorBoundary from 'components/ErrorBoundary';
import FormDisplay from 'components/FormDisplay';
import FormStart from 'components/FormStart';

import AppointmentConfirmation from './AppointmentConfirmation';
import AppointmentProgressIndicator from './AppointmentProgressIndicator';
import AppointmentStep from './AppointmentStep';
import AppointmentSummary from './AppointmentSummary';

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

  const onFormStart = () => {
    console.log('Appointment form starts');
    history.push('/appointment/form');
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

      <Route path="/appointment/form">
        <ErrorBoundary useCard>
          <AppointmentStep form={form} onSubmit={onAppointmentSubmit} />
        </ErrorBoundary>
      </Route>

      <Route path="/">
        <ErrorBoundary useCard>
          <FormStart form={form} onFormStart={onFormStart} />
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

export default AppointmentForm;
