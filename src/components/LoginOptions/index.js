import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';
import Literal from 'components/Literal';
import {getLoginUrl} from 'components/utils';
import Types from 'types';

import LoginOptionsDisplay from './LoginOptionsDisplay';

const LoginOptions = ({form, onFormStart}) => {
  const config = useContext(ConfigContext);

  const loginAsYourselfOptions = [];
  const loginAsGemachtigdeOptions = [];
  const cosignLoginOptions = [];

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

  if (form.cosignLoginOptions) {
    form.cosignLoginOptions.forEach(option => {
      cosignLoginOptions.push({
        ...option,
        label: (
          <FormattedMessage
            description="Login button label"
            defaultMessage="Login with {provider}"
            values={{provider: option.label}}
          />
        ),
      });
    });
  }

  if (!form.loginRequired) {
    loginAsYourselfOptions.push({
      identifier: 'anonymous',
      label: <Literal name="beginText" />,
    });
  }

  const LoginDisplayComponent = config?.displayComponents?.loginOptions ?? LoginOptionsDisplay;
  const Container = form.loginRequired ? React.Fragment : 'form';
  const containerProps = form.loginRequired
    ? {}
    : {
        onSubmit: e => {
          e.preventDefault();
          onFormStart(e);
        },
      };

  return (
    <Container {...containerProps}>
      <LoginDisplayComponent
        loginAsYourselfOptions={loginAsYourselfOptions}
        loginAsGemachtigdeOptions={loginAsGemachtigdeOptions}
        cosignLoginOptions={cosignLoginOptions}
      />
    </Container>
  );
};

LoginOptions.propTypes = {
  form: Types.Form.isRequired,
  onFormStart: PropTypes.func.isRequired,
};

export default LoginOptions;
