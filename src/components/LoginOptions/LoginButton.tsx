import {LoadingIndicator, PrimaryActionButton} from '@open-formulieren/formio-renderer';

import Anchor from '@/components/Anchor';
import type {FormattedLoginOption} from '@/components/LoginOptions/LoginOptionsDisplay';

import LoginButtonIcon from './LoginButtonIcon';

export interface LoginButtonProps {
  option: FormattedLoginOption;
  isStarting?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({option, isStarting}) => (
  <div className="openforms-login-button">
    {option.url !== undefined ? (
      <Anchor
        as="button-link"
        appearance="primary-action-button"
        href={option.url}
        placeholder={isStarting}
      >
        {option.label}
      </Anchor>
    ) : (
      <PrimaryActionButton type="submit" disabled={isStarting}>
        {isStarting ? (
          <LoadingIndicator position="center" size="small" color="muted" />
        ) : (
          option.label
        )}
      </PrimaryActionButton>
    )}
    <LoginButtonIcon identifier={option.identifier} logo={option.logo} />
  </div>
);

export default LoginButton;
