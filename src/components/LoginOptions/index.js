import React from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';

import Literal from 'components/Literal';
import {getLoginUrl} from 'components/utils';
import Types from 'types';

import LoginOptionsDisplay from './LoginOptionsDisplay';

const LoginOptions = ({form, onFormStart}) => {
  const loginAsYourselfOptions = [];
  const loginAsGemachtigdeOptions = [];

  form.loginOptions.forEach(option => {
    let readyOption = {...option};
    readyOption.url = getLoginUrl(option);
    readyOption.label = (
      <FormattedMessage
        description="Login button label"
        defaultMessage="Login with {provider}"
        values={{provider: option.label}}
      />
    );

    if (readyOption.isForGemachtigde) {
      loginAsGemachtigdeOptions.push(readyOption);
    } else {
      loginAsYourselfOptions.push(readyOption);
    }
  });

  if (!form.loginRequired) {
    loginAsYourselfOptions.push({
      identifier: 'anonymous',
      label: <Literal name="beginText" />,
    });
  }

  if (form.loginRequired) {
    return (
      <LoginOptionsDisplay
        loginAsYourselfOptions={loginAsYourselfOptions}
        loginAsGemachtigdeOptions={loginAsGemachtigdeOptions}
      />
    );
  }

  return (
    <form onSubmit={onFormStart}>
      <LoginOptionsDisplay
        loginAsYourselfOptions={loginAsYourselfOptions}
        loginAsGemachtigdeOptions={loginAsGemachtigdeOptions}
      />
    </form>
  );
};

LoginOptions.propTypes = {
  form: Types.Form.isRequired,
  onFormStart: PropTypes.func.isRequired,
};

export default LoginOptions;
