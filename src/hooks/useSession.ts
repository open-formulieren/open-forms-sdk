import {useContext, useMemo} from 'react';

import {ConfigContext} from '@/Context';
import {apiCall} from '@/api';

export const useSession = () => {
  const {baseUrl} = useContext(ConfigContext);

  return useMemo(
    () => ({
      /**
       * Send a ping message to the server to re-new the session timer.
       */
      sendPing: () => apiCall(`${baseUrl}ping`),
    }),
    [baseUrl]
  );
};
