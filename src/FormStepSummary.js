import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import Caption from './Caption';
import { Table, TableRow, TableHead, TableCell } from "./Table";
import { Toolbar, ToolbarList } from './Toolbar';

import { getComponentLabel, getComponentValue } from "./utils";


const FormStepSummary = ({stepData, onShowStep}) => {

  return (
    <>
      <Toolbar>
        <ToolbarList>
          <Caption component={'span'}>{stepData.title}</Caption>
        </ToolbarList>
        <ToolbarList>
          <Button variant="anchor" component="a" onClick={_ => onShowStep(stepData.submissionStep)}>
            Wijzig {stepData.title.toLocaleLowerCase()}
          </Button>
        </ToolbarList>
      </Toolbar>
      <Table>
        {
          Object.keys(stepData.data).map((key, index) => (
            <TableRow key={index}>
              <TableHead>{getComponentLabel(stepData.configuration.components, key)}</TableHead>
              <TableCell>{getComponentValue(stepData.data[key], stepData.configuration.components, key)}</TableCell>
            </TableRow>
          ))
        }
      </Table>
    </>
  );
};

FormStepSummary.propTypes = {
  stepData: PropTypes.object.isRequired,
  onShowStep: PropTypes.func.isRequired,
};

export default FormStepSummary;
