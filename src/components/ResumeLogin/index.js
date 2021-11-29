import React from 'react';
import {useIntl} from 'react-intl';
import {useHistory, useLocation} from 'react-router-dom';

import Types from 'types';
import FormLanding from 'components/FormLanding';
import {START_FORM_QUERY_PARAM} from 'components/LoginButton';


export const getLoginUrl = (loginOption) => {
  const redirectUrl = new URL(window.location.href);
  redirectUrl.searchParams.set(START_FORM_QUERY_PARAM, 1);

  const loginUrl = new URL(loginOption.url);
  loginUrl.searchParams.set('next', redirectUrl);
  return loginUrl.toString();
};


const ResumeLogin = ({form}) => {
  const intl = useIntl();
  const history = useHistory();
  const currentUrl = useLocation();

  const resumeLoginMessage = intl.formatMessage({
    description: 'Form resume login body text',
    defaultMessage: 'Please authenticate to resume the form.'
  });

  const onStart = () => {
    const currentSearchParams = new URLSearchParams(currentUrl.search);

    const redirectUrl = currentSearchParams.get('next');
    if (redirectUrl) {
      let lastEditedStepRoute = new URL(redirectUrl);
      history.push(lastEditedStepRoute.pathname);
    } else {
      const firstStepRoute = `/stap/${form.steps[0].slug}`;
      history.push(firstStepRoute);
    }
  };

  return (
    <FormLanding
      form={form}
      onFormStart={onStart}
      getLoginUrl={getLoginUrl}
      startLoginMessage={resumeLoginMessage}
    />
  );
};


ResumeLogin.propTypes = {
  form: Types.Form.isRequired,
}


export default ResumeLogin;
