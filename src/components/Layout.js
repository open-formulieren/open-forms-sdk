import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';

const Layout = ({children, component = 'div'}) => {
  const className = getBEMClassName('layout');
  const Component = `${component}`;
  return (
    <Component className={`${className} utrecht-document`}>
      {children}
    </Component>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
  component: PropTypes.string,
};


const LayoutRow = ({children, modifiers = [], component = 'section'}) => {
  const className = getBEMClassName('layout__row', modifiers);
  const Component = `${component}`;
  return (
    <Component className={className}>
      {children}
    </Component>
  );
};

LayoutRow.propTypes = {
  children: PropTypes.node,
  modifiers: PropTypes.arrayOf(PropTypes.string),
  component: PropTypes.string,
};


const LayoutColumn = ({children, modifiers = [], component = 'div'}) => {
  const className = getBEMClassName('layout__column', modifiers);
  const Component = `${component}`;
  return (
    <Component className={className}>
      {children}
    </Component>
  );
};

LayoutColumn.propTypes = {
  children: PropTypes.node,
  modifiers: PropTypes.arrayOf(PropTypes.string),
  component: PropTypes.string,
};


export default Layout;
export {Layout, LayoutRow, LayoutColumn};
