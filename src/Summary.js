import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import useAsync from 'react-use/esm/useAsync';

import { Toolbar, ToolbarList } from './Toolbar';
import Button from './Button';
import { get, post } from './api';
import FormIOWrapper from "./FormIOWrapper";


const loadStepsData = async (submission) => {
  // const promises = submission.steps.map(step => get(step.url));
  // const formStepPromises = submission.steps.map(step => get(step.formStep));
  // const stepDetails = await Promise.all(promises);
  // const stepsInfo = [];
  // for (let stepDetail of stepDetails) {
  //   stepsInfo.push({data: {data: stepDetail.data}, configuration: stepDetail.formStep.configuration});
  // }
  // debugger;
  const stepsInfo = [];
  for (let submissionStep of submission.steps) {
    const stepDetail = await get(submissionStep.url);
    const formStepDetail = await get(submissionStep.formStep);
    const formDefinitionDetail = await get(formStepDetail.formDefinition);
    stepsInfo.push({submissionStep,
                    title: formDefinitionDetail.name,
                    data: {data: stepDetail.data},
                    configuration: stepDetail.formStep.configuration});
  }
  return stepsInfo;
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

  return (
    <form onSubmit={onSubmit}>
      <h2>Controleer en bevestig</h2>

      {value && value.map((step, index) => (
        <Fragment>
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
            <h3>{step.title}</h3>
            <Button variant="anchor" component="a" onClick={_ => onShowStep(step.submissionStep)}>
              Wijzig {step.title.toLocaleLowerCase()}
            </Button>
          </div>
          <FormIOWrapper
            key={index}
            form={step.configuration}
            submission={step.data}
            options={{noAlerts: true, readOnly: true, renderMode: 'html'}}
          />
        </Fragment>
      ))}

      <Toolbar>
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
