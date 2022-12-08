import React from 'react';
import {FormattedMessage} from 'react-intl';

import Button from 'components/Button';
import FormattedLoginOption from 'types/FormattedLoginOption';
import {getBEMClassName} from 'utils';

import LoginButtonIcon from './LoginButtonIcon';

const LoginButton = ({option, ...extra}) => {
  let url = option.url;
  let extraProps = {...extra};
  let component = 'a';

  if (!url) {
    url = '#';
    extraProps = {...extraProps, type: 'submit'};
    component = 'button';
  }

  return (
    <div className={getBEMClassName('login-button')}>
      <Button variant="primary" component={component} href={url} {...extraProps}>
        {option.label}
      </Button>
      <LoginButtonIcon identifier={option.identifier} logo={option.logo} />
    </div>
  );
};

LoginButton.propTypes = {
  option: FormattedLoginOption.isRequired,
};

export default LoginButton;
