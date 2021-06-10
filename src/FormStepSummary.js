import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import Caption from './Caption';
import { Table, TableRow, TableHead, TableCell } from "./Table";
import { Toolbar, ToolbarList } from './Toolbar';

import { getComponentLabel, getComponentValue } from "./utils";


const FormStepSummary = ({step, onShowStep}) => {

  return (
    <>
      <Toolbar>
        <ToolbarList>
          <Caption>{step.title}</Caption>
        </ToolbarList>
        <ToolbarList>
          <Button variant="anchor" component="a" onClick={_ => onShowStep(step.submissionStep)}>
            Wijzig {step.title.toLocaleLowerCase()}
          </Button>
        </ToolbarList>
      </Toolbar>
      <Table>
        {
          Object.keys(step.data).map((key, index) => (
            <TableRow key={index}>
              <TableHead>{getComponentLabel(step.configuration.components, key)}</TableHead>
              <TableCell>{getComponentValue(step.data[key], step.configuration.components, key)}</TableCell>
            </TableRow>
          ))
        }
      </Table>
    </>
  );
};

FormStepSummary.propTypes = {
  step: PropTypes.object.isRequired,
  onShowStep: PropTypes.func.isRequired,
};

export default FormStepSummary;
