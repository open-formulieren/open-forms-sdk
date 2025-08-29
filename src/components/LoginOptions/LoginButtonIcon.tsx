import clsx from 'clsx';

import type {FormLoginOption} from '@/data/forms';

type LoginOptionLogo = Required<FormLoginOption>['logo'];

export const LOGO_APPEARANCES: LoginOptionLogo['appearance'][] = ['dark', 'light'];

export interface LoginButtonIconProps {
  identifier: string;
  logo?: LoginOptionLogo;
}

const LoginButtonIcon: React.FC<LoginButtonIconProps> = ({identifier, logo}) => {
  if (!logo) return null;

  const {href, imageSrc, title, appearance} = logo;
  return (
    <a
      className={clsx('openforms-login-button-logo', `openforms-login-button-logo--${appearance}`)}
      href={href}
      key={identifier}
      target="_blank"
      rel="noreferrer nofollower"
    >
      <img className="openforms-login-button-logo__image" alt={title} src={imageSrc} />
    </a>
  );
};

export default LoginButtonIcon;
