import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import useAsync from 'react-use/esm/useAsync';

import { Toolbar, ToolbarList } from './Toolbar';
import Button from './Button';
import { get, post } from './api';
import {applyPrefix} from './formio/utils';


const loadStepsData = async (submission) => {
  return await Promise.all(submission.steps.map(async (submissionStep) => {
    const submissionStepDetail = await get(submissionStep.url);
    const formStepDetail = await get(submissionStep.formStep);
    const formDefinitionDetail = await get(formStepDetail.formDefinition);
    return {
      submissionStep,
      title: formDefinitionDetail.name,
      data: submissionStepDetail.data,
      configuration: submissionStepDetail.formStep.configuration
    };
  }));
};


const completeSubmission = async (submission) => {
    await post(`${submission.url}/_complete`);
};


const Summary = ({ submission, onConfirm, onShowStep }) => {
  const {loading, value, error} = useAsync(
    async () => loadStepsData(submission),
    [submission]
  );

  if (error) {
    console.error(error);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    await completeSubmission(submission);
    onConfirm();
  };

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
    <form onSubmit={onSubmit}>
      <h1 className={applyPrefix('title')}>Controleer en bevestig</h1>
      {value && value.map((step, index) => (
        <Fragment key={index}>
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
            <h3 className={applyPrefix('caption')}>{step.title}</h3>
            <Button variant="anchor" component="a" onClick={_ => onShowStep(step.submissionStep)}>
              Wijzig {step.title.toLocaleLowerCase()}
            </Button>
          </div>
          <table style={{width: '100%'}}>
            <tbody>
            {
              Object.keys(step.data).map((key, i) => (
                <tr key={i}>
                  <td>
                    <p className={applyPrefix('body')}>{renderLabel(step.configuration.components, key)}</p>
                  </td>
                  <td>
                    <p className={applyPrefix('body')}>{renderValue(step.data[key], step.configuration.components, key)}</p>
                  </td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </Fragment>
      ))}
      <Toolbar>
        <ToolbarList>
          <Button
            variant="anchor"
            component="a"
            style={{ 'paddingLeft': 0 }}
            onClick={_ => onShowStep(submission.steps[submission.steps.length-1])}
          >
            Vorige pagina
          </Button>
        </ToolbarList>
        <ToolbarList>
          <Button type="submit" variant="primary" name="confirm" disabled={loading}>
            Bevestigen
          </Button>
        </ToolbarList>
      </Toolbar>
    </form>
  );
};

Summary.propTypes = {
    submission: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onShowStep: PropTypes.func.isRequired,
};


export default Summary;
