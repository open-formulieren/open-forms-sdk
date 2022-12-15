import PropTypes from 'prop-types';
import React from 'react';

import {getBEMClassName} from 'utils';

const List = ({children, modifiers = [], ordered = false, component = ''}) => {
  const Component = component ? component : ordered ? 'ol' : 'ul';
  const className = getBEMClassName('list', modifiers);
  return (
    <Component className={className}>
      {React.Children.map(children, child => (
        <li className={getBEMClassName('list__item')}>{child}</li>
      ))}
    </Component>
  );
};

List.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(['compact', 'extra-compact', 'dash'])),
  ordered: PropTypes.bool,
  component: PropTypes.string,
};

export default List;
