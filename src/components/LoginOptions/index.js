import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';
import Literal from 'components/Literal';
import {getCoSignLoginUrl, getLoginUrl} from 'components/utils';
import Types from 'types';

import LoginOptionsDisplay from './LoginOptionsDisplay';

const LoginOptions = ({form, onFormStart}) => {
  const config = useContext(ConfigContext);

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

  const LoginDisplayComponent = config?.displayComponents?.loginOptions ?? LoginOptionsDisplay;
  const Container = form.loginRequired ? React.Fragment : 'form';
  const containerProps = form.loginRequired ? {} : {onSubmit: onFormStart};

  let cosignInfo;
  if (form.cosignLoginInfo) {
    cosignInfo = {...form.cosignLoginInfo};
    cosignInfo.url = getCoSignLoginUrl(form);
    cosignInfo.label = (
      <FormattedMessage
        description="Login button label"
        defaultMessage="Login with {provider}"
        values={{provider: form.cosignLoginInfo.label}}
      />
    );
  }

  return (
    <Container {...containerProps}>
      <LoginDisplayComponent
        loginAsYourselfOptions={loginAsYourselfOptions}
        loginAsGemachtigdeOptions={loginAsGemachtigdeOptions}
        cosignLoginInfo={cosignInfo}
      />
    </Container>
  );
};

LoginOptions.propTypes = {
  form: Types.Form.isRequired,
  onFormStart: PropTypes.func.isRequired,
};

export default LoginOptions;
