import React from 'react';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';
import {Table, TableCell, TableHead, TableRow} from 'components/Table';
import ComponentValueDisplay from 'components/FormStepSummary/ComponentValueDisplay';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import Caption from 'components/Caption';
import Button from 'components/Button';


const SummaryTableRow = ({name, value, component}) => {
  if (!name) {
    return null;
  }

  const className = getBEMClassName('summary-row', [component.type]);
  return (
    <TableRow className={className}>
      <TableHead>{name}</TableHead>
      <TableCell>
        <ComponentValueDisplay value={value} component={component} />
      </TableCell>
    </TableRow>
  );
};

SummaryTableRow.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool]),
  component: PropTypes.object.isRequired,
};


const FormStepSummary = ({slug, name, data, editStepText}) => {
  const editStepUrl = `/stap/${slug}`;
  const history = useHistory();

    return (
      <>
        <Toolbar modifiers={['compact']}>
          <ToolbarList>
            <Caption component={'span'}>{name}</Caption>
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
            data.map((item, index) => (
              <SummaryTableRow
                key={index}
                name={item.name}
                value={item.value}
                component={item.component}
              />
            ))
          }
        </Table>
      </>
    );
  };

FormStepSummary.propTypes = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  editStepText: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export {SummaryTableRow};
export default FormStepSummary;
