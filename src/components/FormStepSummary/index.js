import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import {useIntl} from 'react-intl';

import Button from 'components/Button';
import Caption from 'components/Caption';
import { Table, TableRow, TableHead, TableCell } from 'components/Table';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import {getBEMClassName} from 'utils';

import {
  getComponentLabel,
  getComponentValue,
  iterComponentsWithData,
} from 'components/FormStepSummary/utils';


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
          /*
          * Loop through each field in the step
          * stepData contains 4 things.
          * title (string), submissionStep (object), data (object), configuration (object)
          * Note that the `components` should already be flattened!
          */
          iterComponentsWithData(stepData.configuration.components, stepData.data).map((component) => {
            const {key, type} = component;
            const className = getBEMClassName('summary-row', [type]);
            return (
              <TableRow key={key} className={className}>
                <TableHead>
                  {getComponentLabel(component)}
                </TableHead>
                <TableCell>
                  {getComponentValue(component, intl)}
                </TableCell>
              </TableRow>
            );
          })
        }
      </Table>

    </>
  );
};

FormStepSummary.propTypes = {
  stepData: PropTypes.shape({
    configuration: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    submissionStep: PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      formStep: PropTypes.string.isRequired,
      canSubmit: PropTypes.bool.isRequired,
      completed: PropTypes.bool.isRequired,
      isApplicable: PropTypes.bool.isRequired,
      optional: PropTypes.bool.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  editStepUrl: PropTypes.string.isRequired,
  editStepText: PropTypes.string.isRequired,
};

export default FormStepSummary;
