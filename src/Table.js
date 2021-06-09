import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from './utils';


const TableData = ({ children, }) => {
  return (
    <td>
      {children}
    </td>
  );
};

TableData.propTypes = {
    children: PropTypes.node,
};


const TableRow = ({ children, }) => {
  return (
    <tr>
      {children}
    </tr>
  );
};

TableRow.propTypes = {
    children: PropTypes.node,
};


const TableBody = ({ children, }) => {
  return (
    <tbody>
      {children}
    </tbody>
  );
};

TableBody.propTypes = {
    children: PropTypes.node,
};


const Table = ({ children, }) => {
  const className = getBEMClassName('table');
  return (
    <table className={className}>
      {children}
    </table>
  );
};

Table.propTypes = {
    children: PropTypes.node,
};


export {Table, TableBody, TableRow, TableData};
