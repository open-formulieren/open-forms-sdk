import {useContext, useEffect} from 'react';
import {useLocation} from 'react-router';

import {getLoginUrl} from 'components/LoginOptions/utils';

import type {Form} from '@/data/forms';

import {ConfigContext} from '../Context';
import useStartSubmission from './useStartSubmission';

/**
 * Calculate the auto-login URL, if applicable.
 */
const getLoginRedirectUrl = (form: Form): string | undefined => {
  if (!form.autoLoginAuthenticationBackend) return;

  const autoLoginOption = form.loginOptions.find(
    option => option.identifier === form.autoLoginAuthenticationBackend
  );
  if (autoLoginOption === undefined) return;
  return getLoginUrl(autoLoginOption);
};

/**
 * Automatically redirect the user to a specific login option (if configured)
 */
const useAutomaticRedirect = (form: Form) => {
  const location = useLocation();
  const {basePath} = useContext(ConfigContext);

  // In basePath, the end / is stripped
  let pathname: string = location.pathname;
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, pathname.length - 1);
  }

  const isStartPage = pathname === basePath;
  const autoRedirectUrl = getLoginRedirectUrl(form);
  const doStart = useStartSubmission();

  const shouldAutomaticallyRedirect = isStartPage && !doStart && autoRedirectUrl;

  useEffect(() => {
    if (shouldAutomaticallyRedirect) {
      window.location.href = autoRedirectUrl;
    }
  }, [shouldAutomaticallyRedirect, autoRedirectUrl]);

  return shouldAutomaticallyRedirect;
};

export default useAutomaticRedirect;
