import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import useAsync from 'react-use/esm/useAsync';

import { Toolbar, ToolbarList } from './Toolbar';
import Button from './Button';
import { get, post } from './api';


const loadStepsData = async (submission) => {
  const stepData = await Promise.all(submission.steps.map(async (submissionStep) => {
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
  // debugger;
  return stepData;
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

  const renderValue = (data, key) => {
    return typeof (data[key]) !== "object" ?
      JSON.stringify(data[key]).replaceAll('"', '') :
      Object.keys(data[key]).filter(inner_key => data[key][inner_key] === true).toString();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1 className="openforms-title">Controleer en bevestig</h1>
      {value && value.map((step, index) => (

        <Fragment key={index}>
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
            <h3 className="openforms-caption">{step.title}</h3>
            <Button variant="anchor" component="a" onClick={_ => onShowStep(step.submissionStep)}>
              Wijzig {step.title.toLocaleLowerCase()}
            </Button>
          </div>
          <table className="table" style={{width: '100%'}}>
            <tbody>
            {
              Object.keys(step.data).map((key, i) => (
                <tr key={i} className="table__row">
                  <td className="table__head">
                    <p className="openforms-body">
                      {
                        renderLabel(step.configuration.components, key)
                      }
                    </p>
                  </td>
                  <td className="table__cell">
                    <p className="openforms-body">
                      {
                        renderValue(step.data, key)
                      }
                    </p>
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
          <Button variant="anchor" component="a" style={{ 'paddingLeft': 0 }} onClick={_ => onShowStep(submission.steps[submission.steps.length-1])}>Vorige pagina</Button>
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
