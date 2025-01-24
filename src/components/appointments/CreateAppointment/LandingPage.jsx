import {Navigate, useSearchParams} from 'react-router';

import {APPOINTMENT_STEP_PATHS} from './steps';

// TODO: replace with loader that redirects at the route level
export const LandingPage = () => {
  const [params] = useSearchParams();
  return (
    <Navigate
      replace
      to={{
        pathname: APPOINTMENT_STEP_PATHS[0],
        search: `?${params}`,
      }}
    />
  );
};
