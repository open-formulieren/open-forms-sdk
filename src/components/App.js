import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import ReactDOM from 'react-dom';
import {Navigate, Outlet, useMatch} from 'react-router-dom';

import {ConfigContext} from 'Context';
import AppDebug from 'components/AppDebug';
import {Cosign} from 'components/CoSign';
import Form from 'components/Form';
import LanguageSelection from 'components/LanguageSelection';
import {
  CreateAppointment,
  appointmentRoutes,
  manageAppointmentRoutes,
} from 'components/appointments';
import useFormContext from 'hooks/useFormContext';
import useQuery from 'hooks/useQuery';
import useZodErrorMap from 'hooks/useZodErrorMap';
import {I18NContext} from 'i18n';
import {DEBUG} from 'utils';

import AppDisplay from './AppDisplay';

export const routes = [
  {
    path: 'afspraak-annuleren/*',
    children: manageAppointmentRoutes,
  },
  {
    path: 'afspraak-maken/*',
    element: <CreateAppointment />,
    children: appointmentRoutes,
  },
  {
    path: 'cosign/*',
    element: <Cosign />,
  },
  // All the rest goes to the formio-based form flow
  {
    path: '*',
    element: <Form />,
  },
];

const LanguageSwitcher = () => {
  const {languageSelectorTarget: target} = useContext(I18NContext);
  return target ? ReactDOM.createPortal(<LanguageSelection />, target) : <LanguageSelection />;
};

/*
Top level router - routing between an actual form or supporting screens.
 */
const App = ({noDebug = false}) => {
  const form = useFormContext();
  const query = useQuery();
  const config = useContext(ConfigContext);
  const appointmentMatch = useMatch('afspraak-maken/*');
  const appointmentCancelMatch = useMatch('afspraak-annuleren/*');

  // register localized error messages in the default zod error map
  useZodErrorMap();

  const AppDisplayComponent = config?.displayComponents?.app ?? AppDisplay;

  const {translationEnabled} = form;
  const languageSwitcher = translationEnabled ? <LanguageSwitcher /> : null;
  const appDebug = DEBUG && !noDebug ? <AppDebug /> : null;

  const isAppointment = form.appointmentOptions?.isAppointment ?? false;
  if (isAppointment && !appointmentMatch && !appointmentCancelMatch) {
    return (
      <Navigate
        replace
        to={{
          pathname: '../afspraak-maken',
          search: `?${query}`,
        }}
      />
    );
  }

  return (
    <AppDisplayComponent
      router={<Outlet />}
      languageSwitcher={languageSwitcher}
      appDebug={appDebug}
    />
  );
};

App.propTypes = {
  noDebug: PropTypes.bool,
};

export default App;
