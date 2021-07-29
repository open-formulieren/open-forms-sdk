import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';
import Body from 'Body';


const TableCell = ({ children, component=Body }) => {
  const Component = component;
  const className = getBEMClassName('table__cell');
  return (
    <td className={className}>
      <Component component={'div'}>{children}</Component>
    </td>
  );
};

TableCell.propTypes = {
    children: PropTypes.node,
    component: PropTypes.elementType,
};

const TableHead = ({ children, component=Body }) => {
  const Component = component;
  const className = getBEMClassName('table__head');
  return (
    <th className={className}>
      <Component>{children}</Component>
    </th>
  );
};

TableHead.propTypes = {
    children: PropTypes.node,
    component: PropTypes.elementType,
};


const TableRow = ({ children }) => {
  const className = getBEMClassName('table__row');
  return (
    <tr className={className}>
      {children}
    </tr>
  );
};

TableRow.propTypes = {
    children: PropTypes.node,
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
