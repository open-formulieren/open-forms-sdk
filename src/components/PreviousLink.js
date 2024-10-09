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
    <Link to={to} onClick={onClick} className={className}>
      <FAIcon icon="arrow-left-long" extraClassName="openforms-previous-link__icon" />
      <Literal name="previousText" />
    </Link>
  );
};

PreviousLink.propTypes = {
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  position: PropTypes.oneOf(VARIANTS),
};

export default PreviousLink;
