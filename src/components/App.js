import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Form from 'components/Form';
import { Layout, LayoutRow } from 'components/Layout';
import ManageAppointment from 'components/appointments/ManageAppointment';


/*
Top level router - routing between an actual form or supporting screens.
 */
const App = (props) => {
  return (
    <Layout>
      <LayoutRow>

        <Switch>

          {/* Anything dealing with appointments gets routed to it's own sub-router */}
          <Route path="/afspraak*" component={ManageAppointment} />

          {/* All the rest goes to the actual form flow */}
          <Route path="/">
            <Form {...props} />
          </Route>

        </Switch>

      </LayoutRow>
    </Layout>
  );
};


export default App;
