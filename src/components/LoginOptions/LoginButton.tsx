import {ButtonLink} from '@utrecht/component-library-react';

import {getBEMClassName} from 'utils';

import {OFButton} from '@/components/Button';
import type {FormattedLoginOption} from '@/components/LoginOptions/LoginOptionsDisplay';

import LoginButtonIcon from './LoginButtonIcon';

export interface LoginButtonProps {
  option: FormattedLoginOption;
}

const LoginButton: React.FC<LoginButtonProps> = ({option}) => (
  <div className={getBEMClassName('login-button')}>
    {option.url !== undefined ? (
      <ButtonLink appearance="primary-action-button" href={option.url}>
        {option.label}
      </ButtonLink>
    ) : (
      <OFButton variant="primary" type="submit">
        {option.label}
      </OFButton>
    )}
    <LoginButtonIcon identifier={option.identifier} logo={option.logo} />
  </div>
);

export default LoginButton;
