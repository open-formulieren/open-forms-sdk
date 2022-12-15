import React from 'react';
import {Route, Switch} from 'react-router-dom';

import ErrorBoundary from 'components/ErrorBoundary';
import {LayoutColumn} from 'components/Layout';

import CancelAppointment from './CancelAppointment';
import CancelAppointmentSuccess from './CancelAppointmentSuccess';

const ManageAppointment = () => {
  return (
    <LayoutColumn modifiers={['mobile-order-2', 'mobile-padding-top']}>
      <Switch>
        <Route exact path="/afspraak-annuleren">
          <ErrorBoundary>
            <CancelAppointment />
          </ErrorBoundary>
        </Route>

        <Route exact path="/afspraak-annuleren/succes" component={CancelAppointmentSuccess} />
      </Switch>
    </LayoutColumn>
  );
};

export default ManageAppointment;
