import {Icon} from '@utrecht/component-library-react';
import clsx from 'clsx';

import FAIcon from '@/components/FAIcon';
import Link from '@/components/Link';
import {Literal} from '@/components/Literal';

export interface PreviousLinkProps {
  to: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void | Promise<void>;
  position?: 'start' | 'end';
}

const PreviousLink: React.FC<PreviousLinkProps> = ({to, onClick, position}) => {
  const className = clsx('openforms-previous-link', {
    [`openforms-previous-link--${position}`]: position,
  });
  return (
    <Link to={to} onClick={onClick} className={className}>
      <Icon>
        <FAIcon icon="" className="fa-fw" />
      </Icon>
      <Literal name="previousText" />
    </Link>
  );
};

export default PreviousLink;
