import React from 'react';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';

import Types from 'types';
import {START_FORM_QUERY_PARAM} from 'components/LoginButton';
import FormLanding from 'components/FormLanding';


export const getLoginUrl = (loginOption) => {
  const nextUrl = new URL(window.location.href);

  const queryParams = Array.from(nextUrl.searchParams.keys());
  queryParams.map(param => nextUrl.searchParams.delete(param));

  nextUrl.searchParams.set(START_FORM_QUERY_PARAM, '1');
  const loginUrl = new URL(loginOption.url);
  loginUrl.searchParams.set('next', nextUrl.toString());
  return loginUrl.toString();
};


/**
 * Form start screen.
 *
 * This is shown when the form is initially loaded and provides the explicit user
 * action to start the form, or present the login button (DigiD, eHerkenning, eIDAS)
 */
const FormStart = ({ form, onFormStart }) => {
  const intl = useIntl();

  const canLogin = form.loginOptions.length > 0;
  const startLoginMessage = form.loginRequired
    ? intl.formatMessage({
        description: 'Form start login required body text',
        defaultMessage: 'Please authenticate to start the form.'
    })
    : canLogin
      ? intl.formatMessage({
          description: 'Form start anonymous or login body text',
          defaultMessage: 'Please authenticate or start the form anonymously.'
      })
      : intl.formatMessage({
         description: 'Form start (no login available) body text',
         defaultMessage: 'Please click the button below to start the form.'
      })
  ;

  return (
    <FormLanding
      form={form}
      onFormStart={onFormStart}
      getLoginUrl={getLoginUrl}
      startLoginMessage={startLoginMessage}
    />
  );
};

FormStart.propTypes = {
  form: Types.Form.isRequired,
  onFormStart: PropTypes.func.isRequired,
};


export default FormStart;
