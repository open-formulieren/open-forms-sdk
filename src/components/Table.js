import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Body from 'components/Body';
import {getBEMClassName} from 'utils';


const TableCell = ({ children, component=Body, modifiers=[] }) => {
  const Component = component;
  const className = getBEMClassName('table__cell', modifiers);
  return (
    <td className={className}>
      <Component component={'div'}>{children}</Component>
    </td>
  );
};

TableCell.propTypes = {
    children: PropTypes.node,
    component: PropTypes.elementType,
    modifiers: PropTypes.arrayOf(PropTypes.string),
};

const TableHead = ({ children, component=Body, modifiers=[] }) => {
  const Component = component;
  const className = getBEMClassName('table__head', modifiers);
  return (
    <th className={className}>
      <Component>{children}</Component>
    </th>
  );
};

TableHead.propTypes = {
    children: PropTypes.node,
    component: PropTypes.elementType,
    modifiers: PropTypes.arrayOf(PropTypes.string),
};


const TableRow = ({ children, className='' }) => {
  className = classNames(
    getBEMClassName('table__row'),
    className,
  );
  return (
    <tr className={className}>
      {children}
    </tr>
  );
};

TableRow.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

const Table = ({ children, }) => {
  const className = getBEMClassName('table');
  return (
    <table className={className}>
      <tbody>
        {children}
      </tbody>
    </table>
  );
};

Table.propTypes = {
    children: PropTypes.node,
};


export {Table, TableRow, TableHead, TableCell};
