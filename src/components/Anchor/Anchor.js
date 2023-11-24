import {Link as UtrechtLink} from '@utrecht/component-library-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

export const ANCHOR_MODIFIERS = [
  // maps to NLDS
  'current',
  // OF specific
  'hover',
  'inherit',
  'indent',
];

const Anchor = ({children, href, modifiers = [], ...extraProps}) => {
  // extend with our own modifiers
  const className = classNames(
    'utrecht-link--openforms', // always apply our own modifier
    {
      'utrecht-link--current': modifiers.includes('current'),
      'utrecht-link--openforms-hover': modifiers.includes('hover'),
      'utrecht-link--openforms-inherit': modifiers.includes('inherit'),
      'utrecht-link--openforms-indent': modifiers.includes('indent'),
    }
  );
  return (
    <UtrechtLink className={className} href={href || undefined} {...extraProps}>
      {children}
    </UtrechtLink>
  );
};

Anchor.propTypes = {
  href: PropTypes.string,
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(ANCHOR_MODIFIERS)),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  onClick: PropTypes.func,
};

export default Anchor;
