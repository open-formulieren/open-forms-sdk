import {PrimaryActionButton} from '@open-formulieren/formio-renderer';
import {ButtonLink} from '@utrecht/component-library-react';

import type {FormattedLoginOption} from '@/components/LoginOptions/LoginOptionsDisplay';

import LoginButtonIcon from './LoginButtonIcon';

export interface LoginButtonProps {
  option: FormattedLoginOption;
}

const LoginButton: React.FC<LoginButtonProps> = ({option}) => (
  <div className="openforms-login-button">
    {option.url !== undefined ? (
      <ButtonLink appearance="primary-action-button" href={option.url}>
        {option.label}
      </ButtonLink>
    ) : (
      <PrimaryActionButton type="submit">{option.label}</PrimaryActionButton>
    )}
    <LoginButtonIcon identifier={option.identifier} logo={option.logo} />
  </div>
);

export default LoginButton;
