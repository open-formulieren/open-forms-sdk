import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Form from 'components/Form';
import { Layout, LayoutRow, LayoutRowHeader } from 'components/Layout';
import ManageAppointment from 'components/appointments/ManageAppointment';
import logo from '../img/logo_denhaag.svg';


/*
Top level router - routing between an actual form or supporting screens.
 */
const App = (props) => {
  return (
    <div className={"utrecht-document"}>
      <div className={"denhaag-form-header"}>
        <div className={"denhaag-form-header__border-image"}></div>
        <Layout>
          <LayoutRowHeader>
            <img className={"denhaag-form-header__logo"} src={logo}/>
            <h1 className={"denhaag-form-header__title"}>{props.form.name}</h1>
          </LayoutRowHeader>
        </Layout>
      </div>
      <Layout>
        <LayoutRow>

          <Switch>

            {/* Anything dealing with appointments gets routed to it's own sub-router */}
            <Route path="/afspraak*" component={ManageAppointment}/>

            {/* All the rest goes to the actual form flow */}
            <Route path="/">
              <Form {...props} />
            </Route>

          </Switch>

        </LayoutRow>
      </Layout>
    </div>
  );
};


export default App;
