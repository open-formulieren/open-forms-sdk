import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import {useIntl} from 'react-intl';

import Button from 'components/Button';
import Caption from 'components/Caption';
import { Table, TableRow, TableHead, TableCell } from 'components/Table';
import { Toolbar, ToolbarList } from 'components/Toolbar';

import { getComponentLabel, getComponentValue } from 'utils';


const FormStepSummary = ({stepData, editStepUrl, editStepText}) => {
  const history = useHistory();
  const intl = useIntl();
  return (
    <>
      <Toolbar modifiers={['compact']}>
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
            {editStepText}
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
              <TableCell>{getComponentValue(value, stepData.configuration.components, key, intl)}</TableCell>
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
  editStepText: PropTypes.string.isRequired,
};

export default FormStepSummary;
