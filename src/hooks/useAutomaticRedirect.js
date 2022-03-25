import {useEffect} from 'react';

import useStartSubmission from './useStartSubmission';
import {getLoginRedirectUrl} from 'components/utils';


const useAutomaticRedirect = (form, nextUrl, submissionExists) => {
  const autoRedirectUrl = getLoginRedirectUrl(form, nextUrl);
  const doStart = useStartSubmission();

  const shouldAutomaticallyRedirect = !submissionExists && !doStart && autoRedirectUrl;

  useEffect(() => {
    if (shouldAutomaticallyRedirect) {
      window.location = autoRedirectUrl;
    }
  }, [shouldAutomaticallyRedirect, autoRedirectUrl])

  return shouldAutomaticallyRedirect;
};

export default useAutomaticRedirect;
