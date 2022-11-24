import {useContext, useEffect} from 'react';
import {useLocation} from 'react-router-dom';

import useStartSubmission from './useStartSubmission';
import {getLoginRedirectUrl} from 'components/utils';
import {ConfigContext} from '../Context';

const useAutomaticRedirect = form => {
  const location = useLocation();
  const {basePath} = useContext(ConfigContext);

  // In basePath, the end / is stripped
  let pathname = location.pathname;
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, pathname.length - 1);
  }

  const isStartPage = pathname === basePath;
  const autoRedirectUrl = getLoginRedirectUrl(form);
  const doStart = useStartSubmission();

  const shouldAutomaticallyRedirect = isStartPage && !doStart && autoRedirectUrl;

  useEffect(() => {
    if (shouldAutomaticallyRedirect) {
      window.location = autoRedirectUrl;
    }
  }, [shouldAutomaticallyRedirect, autoRedirectUrl]);

  return shouldAutomaticallyRedirect;
};

export default useAutomaticRedirect;
