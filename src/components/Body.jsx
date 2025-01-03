import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';

export const VARIANTS = ['big', 'muted', 'small', 'wysiwyg', 'inline'];

const Body = ({modifiers = [], component = 'p', children, ...props}) => {
  const Component = `${component}`;
  const className = getBEMClassName('body', modifiers);
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

Body.propTypes = {
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(VARIANTS)),
  component: PropTypes.string,
  children: PropTypes.node,
};

export default Body;
