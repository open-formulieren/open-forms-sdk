import clsx from 'clsx';

import FAIcon from 'components/FAIcon';
import Link from 'components/Link';
import {Literal} from 'components/Literal';

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
      <FAIcon icon="arrow-left-long" extraClassName="openforms-previous-link__icon" />
      <span className="openforms-previous-link__text">
        <Literal name="previousText" />
      </span>
    </Link>
  );
};

export default PreviousLink;
