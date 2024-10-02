import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import FAIcon from 'components/FAIcon';
import Link from 'components/Link';
import Literal from 'components/Literal';

const VARIANTS = ['start', 'end'];

const PreviousLink = ({to, onClick, position}) => {
  const className = classNames('openforms-previous-link', {
    [`openforms-previous-link--${position}`]: position,
  });
  return (
    <span className={className}>
      <Link to={to} onClick={onClick}>
        <FAIcon icon="arrow-left-long" extraClassName="openforms-previous-link__icon" />
        <Literal name="previousText" />
      </Link>
    </span>
  );
};

PreviousLink.propTypes = {
  to: PropTypes.string,
  onClick: PropTypes.func,
  position: PropTypes.oneOf(VARIANTS),
};

export default PreviousLink;
