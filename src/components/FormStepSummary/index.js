import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import Button from 'components/Button';
import Caption from 'components/Caption';
import { Table, TableRow, TableHead, TableCell } from 'components/Table';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import {getBEMClassName} from 'utils';
import {getComponentLabel, iterComponentsWithData, isChildOfEditGrid} from 'components/FormStepSummary/utils';

import ComponentValueDisplay from './ComponentValueDisplay';
import SummaryEditGrid from './SummaryEditGrid';


const SummaryTableRow = ({ component }) => {
  const label = getComponentLabel(component);
  if (!label && !component.value) return null;

  const {type} = component;
  const className = getBEMClassName('summary-row', [type]);
  return (
    <TableRow className={className}>
      <TableHead>{label}</TableHead>
      <TableCell>
        <ComponentValueDisplay component={component} />
      </TableCell>
    </TableRow>
  );
};

SummaryTableRow.propTypes = {
  component: PropTypes.object.isRequired,
};


const FormStepSummary = ({stepData, editStepUrl, editStepText}) => {
  const history = useHistory();
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
          * Loop through each (not hidden) field in the step
          * stepData contains 4 things.
          * title (string), submissionStep (object), data (object), configuration (object)
          * Note that the `components` must already be flattened and non-summary display
          * components removed.
          * Any component within an editgrid component is rendered as part of the editgrid and
          * should not be rendered independently
          */
          iterComponentsWithData(stepData.configuration.flattenedComponents, stepData.data).filter(
            (component) => !isChildOfEditGrid(component, stepData.configuration)
          ).map((component) => {
            let SummaryComponent = component.type === 'editgrid' ? SummaryEditGrid : SummaryTableRow;
            return <SummaryComponent component={component} key={`${component.key}-${component.id}`} />;
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
