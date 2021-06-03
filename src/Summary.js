import React from 'react';
import PropTypes from 'prop-types';
import useAsync from 'react-use/esm/useAsync';

import { Toolbar, ToolbarList } from './Toolbar';
import Button from './Button';
import { get, post } from './api';
import FormIOWrapper from "./FormIOWrapper";


const loadStepData = async (submission) => {
  const promises = submission.steps.map(step => get(step.url));
  const stepDetails = await Promise.all(promises);
  const stepsInfo = [];
  for (let stepDetail of stepDetails) {
    stepsInfo.push({data: {data: stepDetail.data}, configuration: stepDetail.formStep.configuration});
  }
  return stepsInfo;
};


const completeSubmission = async (submission) => {
    await post(`${submission.url}/_complete`);
};


const Summary = ({ submission, onConfirm }) => {
  const {loading, value, error} = useAsync(
    async () => loadStepData(submission),
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
      <h2>Summary</h2>

      {value && value.map((step, index) => (
        <FormIOWrapper
          key={index}
          form={step.configuration}
          submission={step.data}
          options={{noAlerts: true, readOnly: true}}
        />
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
};


export default Summary;
