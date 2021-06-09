import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from './utils';


const Anchor = ({ children, href, modifiers=[], component='a', ...extra }) => {
  const Component = `${component}`;
  const className = getBEMClassName('anchor', modifiers);
  const extraProps = {...extra};
  if (href) {
    extraProps.href = href;
  }
  return (
    <Component className={className} {...extraProps}>{children}</Component>
  );
};

Anchor.propTypes = {
    href: PropTypes.string,
    modifiers: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    component: PropTypes.string,
};


export default Anchor;
