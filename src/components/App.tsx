import {Navigate, Outlet, useMatch, useSearchParams} from 'react-router';

import useFormContext from '@/hooks/useFormContext';
import useZodErrorMap from '@/hooks/useZodErrorMap';

/*
Top level router - routing between an actual form or supporting screens.
 */
const App: React.FC = () => {
  const form = useFormContext();
  const [params] = useSearchParams();
  const appointmentMatch = useMatch('afspraak-maken/*');
  const appointmentCancelMatch = useMatch('afspraak-annuleren/*');
  const isSessionExpiryMatch = useMatch('sessie-verlopen');

  // register localized error messages in the default zod error map
  useZodErrorMap();

  const isAppointment = form.appointmentOptions?.isAppointment ?? false;
  if (isAppointment && !appointmentMatch && !appointmentCancelMatch && !isSessionExpiryMatch) {
    return (
      <Navigate
        replace
        to={{
          pathname: '../afspraak-maken',
          search: `?${params}`,
        }}
      />
    );
  }
  return <Outlet />;
};

export default App;
