import {
  Table as UtrechtTable,
  TableBody as UtrechtTableBody,
  TableCaption as UtrechtTableCaption,
  TableCell as UtrechtTableCell,
  TableHeader as UtrechtTableHeader,
  TableHeaderCell as UtrechtTableHeaderCell,
  TableRow as UtrechtTableRow,
} from '@utrecht/component-library-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Body from 'components/Body';
import {getBEMClassName} from 'utils';

const TableCell = ({children, component = Body, modifiers = []}) => {
  const Component = component;
  const className = getBEMClassName('table__cell', modifiers);
  return (
    <UtrechtTableCell className={className}>
      <Component component={'div'}>{children}</Component>
    </UtrechtTableCell>
  );
};

TableCell.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType,
  modifiers: PropTypes.arrayOf(PropTypes.string),
};

const TableHead = ({children, component = Body, modifiers = []}) => {
  const Component = component;
  const className = getBEMClassName('table__head', modifiers);
  return (
    <UtrechtTableHeaderCell className={className}>
      <Component>{children}</Component>
    </UtrechtTableHeaderCell>
  );
};

TableHead.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType,
  modifiers: PropTypes.arrayOf(PropTypes.string),
};

const TableRow = ({children, className = ''}) => {
  className = classNames(getBEMClassName('table__row'), className);
  return <UtrechtTableRow className={className}>{children}</UtrechtTableRow>;
};

TableRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const Table = ({children}) => {
  const className = getBEMClassName('table');
  return <UtrechtTable className={className}>{children}</UtrechtTable>;
};

Table.propTypes = {
  children: PropTypes.node,
};

const TableHeader = ({children}) => {
  return <UtrechtTableHeader>{children}</UtrechtTableHeader>;
};

TableHeader.propTypes = {
  children: PropTypes.node,
};

const TableBody = ({children}) => {
  return <UtrechtTableBody>{children}</UtrechtTableBody>;
};

TableBody.propTypes = {
  children: PropTypes.node,
};

const TableCaption = ({children}) => {
  return (
    <UtrechtTableCaption className={getBEMClassName('caption')}>{children}</UtrechtTableCaption>
  );
};

TableCaption.propTypes = {
  children: PropTypes.node,
};

export {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow};
