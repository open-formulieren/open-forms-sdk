import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import Caption from './Caption';
import { Table, TableRow, TableHead, TableCell } from "./Table";
import { Toolbar, ToolbarList } from './Toolbar';


const FormStepSummary = ({step, onShowStep}) => {

  const renderLabel = (components, key) => {
    const component = components.find(component => component.key === key);
    return component ? component.label : '';
  };

  const renderValue = (inputValue, components, key) => {
    const component = components.find(component => component.key === key);

    if (component.type === "checkbox") {
      return inputValue ? 'Ja' : 'Nee';
    } else if (component.type === "select") {
      const obj = component.data.values.find(obj => obj.value === inputValue);
      return obj ? obj.label : '';
    } else if (component.type === "radio") {
      const obj = component.values.find(obj => obj.value === inputValue);
      return obj ? obj.label : '';
    } else if (component.type === "selectboxes") {
      const selectedBoxes = Object.keys(inputValue).filter(key => inputValue[key] === true);
      const selectedObjs = component.values.filter(obj => selectedBoxes.includes(obj.value));
      const selectedLabels = selectedObjs.map(selectedLabel => selectedLabel.label);
      return selectedLabels.toString();
    }

    return inputValue;
  };

  return (
    <Fragment>
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
          Object.keys(step.data).map((key, i) => (
            <TableRow key={i}>
              <TableHead>{renderLabel(step.configuration.components, key)}</TableHead>
              <TableCell>{renderValue(step.data[key], step.configuration.components, key)}</TableCell>
            </TableRow>
          ))
        }
      </Table>
    </Fragment>
  );
};

FormStepSummary.propTypes = {
  step: PropTypes.object.isRequired,
  onShowStep: PropTypes.func.isRequired,
};

export default FormStepSummary;
