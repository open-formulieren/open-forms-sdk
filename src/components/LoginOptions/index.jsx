import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {useSearchParams} from 'react-router';

import {Literal} from 'components/Literal';
import {getCosignLoginUrl, getLoginUrl} from 'components/utils';
import Types from 'types';

import LoginOptionsDisplay from './LoginOptionsDisplay';

const LoginOptions = ({form, onFormStart, extraNextParams = {}, isolateCosignOptions = true}) => {
  const [params] = useSearchParams();

  const loginAsYourselfOptions = [];
  const loginAsGemachtigdeOptions = [];
  const cosignLoginOptions = [];

  form.loginOptions.forEach(option => {
    let readyOption = {...option};
    readyOption.url = getLoginUrl(option, {}, extraNextParams);
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
    const cosignCode = params.get('code');
    form.cosignLoginOptions.forEach(option => {
      const loginUrl = getCosignLoginUrl(option, cosignCode ? {code: cosignCode} : undefined);
      cosignLoginOptions.push({
        ...option,
        url: loginUrl,
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

  const Container = form.loginRequired ? React.Fragment : 'form';
  const containerProps = form.loginRequired
    ? {}
    : {
        onSubmit: async e => {
          e.preventDefault();
          await onFormStart({isAnonymous: true});
        },
        'data-testid': 'start-form',
      };

  return (
    <Container {...containerProps}>
      <LoginOptionsDisplay
        loginAsYourselfOptions={loginAsYourselfOptions}
        loginAsGemachtigdeOptions={loginAsGemachtigdeOptions}
        cosignLoginOptions={cosignLoginOptions}
        isolateCosignOptions={isolateCosignOptions}
      />
    </Container>
  );
};

LoginOptions.propTypes = {
  form: Types.Form.isRequired,
  onFormStart: PropTypes.func.isRequired,
  extraParams: PropTypes.object,
  extraNextParams: PropTypes.object,
  isolateCosignOptions: PropTypes.bool,
};

export default LoginOptions;
