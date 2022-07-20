import React from 'react';
import PropTypes from 'prop-types';
import {Utils as FormioUtils} from 'formiojs';
import _ from 'lodash';

import {getComponentLabel} from './utils';
import {getBEMClassName} from 'utils';
import {TableCell, TableHead, TableRow} from 'components/Table';
import ComponentValueDisplay from './ComponentValueDisplay';

const ItemInGroup = ({component, value, isLast=false}) => {
    const label = getComponentLabel(component);
    if (!label && !value) return null;

    let componentWithValue = _.cloneDeep(component);
    componentWithValue.value = value;

    const modifiers = isLast ? [component.type, 'last'] : [component.type];

    return (
      <TableRow
        className={getBEMClassName('summary-row', modifiers)}
      >
        <TableHead>{label}</TableHead>
        <TableCell>
          <ComponentValueDisplay component={componentWithValue} />
        </TableCell>
      </TableRow>
    );
};


const RepeatingGroup = ({configuration, values}) => {
  const valuesList = Object.entries(values);

  return (
    <>
      {
        valuesList.map(
          ([itemKey, itemValue], index) => {
            const childComponent = FormioUtils.getComponent(configuration, itemKey, true);
            const isLastItemInGroup = index === valuesList.length - 1;
            return (
              <ItemInGroup component={childComponent} value={itemValue} isLast={isLastItemInGroup} key={index}/>
            );
          }
        )
      }
    </>
  );
};


const SummaryEditGrid = ({ component }) => {
  const editGridlabel = getComponentLabel(component);
  if (!editGridlabel && !component.value) return null;

  // The configuration of the repeating components
  const repeatingGroupConfig = component.components;
  const groupsValues = component.value || [];

  return (
    <>
      <TableRow className={getBEMClassName('summary-row', ['editgrid'])}>
        <TableHead>{editGridlabel}</TableHead>
        <TableCell />
      </TableRow>
      {
        groupsValues.map((groupValues, index) => (
          <>
            <TableRow className={getBEMClassName('summary-row', ['editgrid-group'])}>
              <TableHead><strong>{`${component.groupLabel} ${index+1}`}</strong></TableHead>
              <TableCell />
            </TableRow>
            <RepeatingGroup configuration={repeatingGroupConfig} values={groupValues} key={index}/>
          </>

        ))
      }
    </>
  );
};

SummaryEditGrid.propTypes = {
  component: PropTypes.object.isRequired,
};

export default SummaryEditGrid;
