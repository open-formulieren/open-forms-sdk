import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';

const SPAN_MODIFIERS = ['muted', 'indent', 'inherit'];


const Span = ({ children, modifiers=[], ...extra  }) => {
  const className = getBEMClassName('span', modifiers);

  return <span className={className} {...extra}>{children}</span>
};

Span.propTypes = {
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(SPAN_MODIFIERS)),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default Span;
