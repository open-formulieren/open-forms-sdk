import {useEffect} from 'react';

import useStartSubmission from './useStartSubmission';
import {getLoginRedirectUrl} from 'components/utils';


const useAutomaticRedirect = (form) => {
  const autoRedirectUrl = getLoginRedirectUrl(form);
  const doStart = useStartSubmission();

  const shouldAutomaticallyRedirect = !doStart && autoRedirectUrl;

  useEffect(() => {
    if (shouldAutomaticallyRedirect) {
      window.location = autoRedirectUrl;
    }
  }, [shouldAutomaticallyRedirect, autoRedirectUrl])

  return shouldAutomaticallyRedirect;
};

export default useAutomaticRedirect;
