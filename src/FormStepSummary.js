import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import Button from './Button';
import Caption from './Caption';
import { Table, TableRow, TableHead, TableCell } from "./Table";
import { Toolbar, ToolbarList } from './Toolbar';

import { getComponentLabel, getComponentValue } from "./utils";


const FormStepSummary = ({stepData, editStepUrl}) => {
  const history = useHistory();
  return (
    <>
      <Toolbar>
        <ToolbarList>
          <Caption component={'span'}>{stepData.title}</Caption>
        </ToolbarList>
        <ToolbarList>
          <Button
            variant="anchor"
            component="a"
            href={editStepUrl}
            onClick={(event) => {
              event.preventDefault();
              history.push(editStepUrl);
            }}
          >
            Wijzig {stepData.title.toLocaleLowerCase()}
          </Button>
        </ToolbarList>
      </Toolbar>
      <Table>
        {
          // Loop through each field in the step
          // stepData contains 4 things.
          // title (string), submissionStep (object), data (object), configuration (object)
          Object.entries(stepData.data).map(([key, value]) => (
            <TableRow key={key}>
              <TableHead>{getComponentLabel(stepData.configuration.components, key)}</TableHead>
              <TableCell>{getComponentValue(value, stepData.configuration.components, key)}</TableCell>
            </TableRow>
          ))
        }
      </Table>
    </>
  );
};

FormStepSummary.propTypes = {
  stepData: PropTypes.object.isRequired,
  editStepUrl: PropTypes.string.isRequired,
};

export default FormStepSummary;
