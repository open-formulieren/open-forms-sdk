import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from './utils';


const TableCell = ({ children, }) => {
  const className = getBEMClassName('table__cell');
  return (
    <td className={className}>
      {children}
    </td>
  );
};

TableCell.propTypes = {
    children: PropTypes.node,
};

const TableHead = ({ children, }) => {
  const className = getBEMClassName('table__head');
  return (
    <th className={className}>
      {children}
    </th>
  );
};

TableHead.propTypes = {
    children: PropTypes.node,
};


const TableRow = ({ children, }) => {
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
