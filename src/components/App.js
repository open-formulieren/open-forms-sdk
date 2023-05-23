import React, {useContext} from 'react';
import ReactDOM from 'react-dom';
import {Route, Routes} from 'react-router-dom';

import {ConfigContext} from 'Context';
import AppDebug from 'components/AppDebug';
import Form from 'components/Form';
import LanguageSelection from 'components/LanguageSelection';
import {LayoutRow} from 'components/Layout';
import {CosignSummary} from 'components/Summary';
import AppointmentForm from 'components/appointments/AppointmentForm';
import ManageAppointment from 'components/appointments/ManageAppointment';
import {I18NContext} from 'i18n';
import Types from 'types';
import {DEBUG} from 'utils';

import AppDisplay from './AppDisplay';
import ErrorBoundary from './ErrorBoundary';

const LanguageSwitcher = () => {
  const {languageSelectorTarget: target} = useContext(I18NContext);
  return target ? (
    ReactDOM.createPortal(<LanguageSelection />, target)
  ) : (
    <LayoutRow>
      <LanguageSelection />
    </LayoutRow>
  );
};

/*
Top level router - routing between an actual form or supporting screens.
 */
const App = ({...props}) => {
  const config = useContext(ConfigContext);
  const {
    form: {translationEnabled},
    noDebug = false,
  } = props;

  const AppDisplayComponent = config?.displayComponents?.app ?? AppDisplay;

  const languageSwitcher = translationEnabled ? <LanguageSwitcher /> : null;
  const router = (
    <Routes>
      {/* Anything dealing with appointments gets routed to its own sub-router */}
      <Route path="afspraak-annuleren/*" element={<ManageAppointment />} />
      <Route path="appointment/*" element={<AppointmentForm {...props} />} />

      <Route exact path="cosign/*">
        <ErrorBoundary useCard>
          <CosignSummary {...props} />
        </ErrorBoundary>
      </Route>

      {/* All the rest goes to the actual form flow */}
      <Route path="*" element={<Form {...props} />} />
    </Routes>
  );
  const appDebug = DEBUG && !noDebug ? <AppDebug /> : null;

  return (
    <AppDisplayComponent router={router} languageSwitcher={languageSwitcher} appDebug={appDebug} />
  );
};

App.propTypes = {
  form: Types.Form,
};

export default App;
