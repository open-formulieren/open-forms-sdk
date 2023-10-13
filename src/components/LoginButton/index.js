import {
  Button as UtrechtButton,
  ButtonLink as UtrechtButtonLink,
} from '@utrecht/component-library-react';
import React from 'react';

import FormattedLoginOption from 'types/FormattedLoginOption';
import {getBEMClassName} from 'utils';

import LoginButtonIcon from './LoginButtonIcon';

const LoginButton = ({option, ...extra}) => {
  let url = option.url;
  let extraProps = {...extra};
  let ButtonComponent = UtrechtButtonLink;

  if (!url) {
    url = '#';
    extraProps = {...extraProps, type: 'submit'};
    ButtonComponent = UtrechtButton;
  }

  return (
    <div className={getBEMClassName('login-button')}>
      <ButtonComponent href={url} appearance="primary-action-button" {...extraProps}>
        {option.label}
      </ButtonComponent>
      <LoginButtonIcon identifier={option.identifier} logo={option.logo} />
    </div>
  );
};

LoginButton.propTypes = {
  option: FormattedLoginOption.isRequired,
};

export default LoginButton;
