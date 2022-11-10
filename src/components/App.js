import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Switch, Route} from 'react-router-dom';

import Form from 'components/Form';
import { Layout, LayoutRow } from 'components/Layout';
import ManageAppointment from 'components/appointments/ManageAppointment';
import LanguageSelection from 'components/LanguageSelection';

const LanguageSwitcher = ({ target = null, renderSelector = false }) => {
  if (!renderSelector) return (<></>);
  return target ? (
    ReactDOM.createPortal(<LanguageSelection />, target)
  ) : (
    <LayoutRow>
      <LanguageSelection />
    </LayoutRow>
  );
};

LanguageSwitcher.propTypes = {
  target: PropTypes.instanceOf(Element),
};

/*
Top level router - routing between an actual form or supporting screens.
 */
const App = ({ languageSelectorTarget, ...props }) => {
  return (
    <Layout>
      <LanguageSwitcher target={languageSelectorTarget} renderSelector={props.form.translationEnabled} />

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

App.propTypes = {
  languageSelectorTarget: PropTypes.instanceOf(Element),
  form: PropTypes.object,  // FIXME generate from OpenAPI spec
};

export default App;
