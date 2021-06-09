import React from 'react';
import PropTypes from 'prop-types';
import useAsync from 'react-use/esm/useAsync';

import { get, post } from './api';
import Button from './Button';
import Card from "./Card";
import FormStepSummary from "./FormStepSummary";
import { Toolbar, ToolbarList } from './Toolbar';


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

  return (
    <Card title="Controleer en bevestig">
      <form onSubmit={onSubmit}>
        {value && value.map((step, index) => (
          <FormStepSummary key={index} step={step} onShowStep={onShowStep}/>
        ))}
        <Toolbar>
          <ToolbarList>
            <Button
              variant="anchor"
              component="a"
              onClick={() => onShowStep(submission.steps[submission.steps.length - 1])}
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
    </Card>
  );
};

Summary.propTypes = {
    submission: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onShowStep: PropTypes.func.isRequired,
};


export default Summary;
