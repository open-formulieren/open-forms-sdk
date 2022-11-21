import React, {useContext} from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route} from 'react-router-dom';

import Form from 'components/Form';
import { Layout, LayoutRow } from 'components/Layout';
import ManageAppointment from 'components/appointments/ManageAppointment';
import LanguageSelection from 'components/LanguageSelection';
import { I18NContext } from 'i18n';
import Types from 'types';


const LanguageSwitcher = () => {
  const { languageSelectorTarget: target } = useContext(I18NContext);
  return target ? (
    ReactDOM.createPortal(<LanguageSelection />, target)
  ) : (
    <LayoutRow>
      <LanguageSelection />
    </LayoutRow>
  )
};

/*
Top level router - routing between an actual form or supporting screens.
 */
const App = ({ ...props }) => {
  const { form: { translationEnabled } } = props;
  console.log(document.title + " frontend")
  return (
    <Layout>
      { translationEnabled ? <LanguageSwitcher /> : null }

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
  form: Types.Form,
};

export default App;
