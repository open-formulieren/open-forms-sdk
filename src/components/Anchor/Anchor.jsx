import {Link as UtrechtLink} from '@utrecht/component-library-react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

export const ANCHOR_MODIFIERS = [
  // maps to NLDS
  'current',
  // OF specific
  'hover',
  'inherit',
];

const Anchor = ({
  children,
  href,
  modifiers = [],
  component: Component = UtrechtLink,
  ...extraProps
}) => {
  // extend with our own modifiers
  const className = clsx(
    'utrecht-link--openforms', // always apply our own modifier
    {
      'utrecht-link--current': modifiers.includes('current'),
      'utrecht-link--openforms-hover': modifiers.includes('hover'),
      'utrecht-link--openforms-inherit': modifiers.includes('inherit'),
    }
  );
  return (
    <Component className={className} href={href || undefined} {...extraProps}>
      {children}
    </Component>
  );
};

Anchor.propTypes = {
  href: PropTypes.string,
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(ANCHOR_MODIFIERS)),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  onClick: PropTypes.func,
};

export default Anchor;
