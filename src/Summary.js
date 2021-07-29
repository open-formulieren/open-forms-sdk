import React from 'react';
import PropTypes from 'prop-types';
import useAsync from 'react-use/esm/useAsync';
import { useHistory } from 'react-router-dom';

import { get, post } from 'api';
import Button from 'Button';
import Card from 'Card';
import FormStepSummary from 'FormStepSummary';
import { Toolbar, ToolbarList } from 'Toolbar';
import Types from 'types';
import { flattenComponents } from 'utils';
import Loader from 'Loader';


const loadStepsData = async (submission) => {
  const stepsData = await Promise.all(submission.steps.map(async (submissionStep) => {
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
  stepsData.map(stepData => stepData.configuration.components = flattenComponents(stepData.configuration.components));
  return stepsData;
};


const completeSubmission = async (submission) => {
    const response = await post(`${submission.url}/_complete`);
    if (!response.ok) {
        console.error(response.data);
    } else {
      return response.data;
    }
};


const Summary = ({ form, submission, onConfirm }) => {
  const history = useHistory();
  const {loading, value: submissionSteps, error} = useAsync(
    async () => loadStepsData(submission),
    [submission]
  );

  const lastStep = form.steps[form.steps.length - 1];
  const prevPageUrl = `/stap/${lastStep.slug}`;

  if (error) {
    console.error(error);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    const {downloadUrl, reportStatusUrl, confirmationPageContent} = await completeSubmission(submission);
    onConfirm(downloadUrl, reportStatusUrl, confirmationPageContent);
  };

  return (
    <Card title="Controleer en bevestig">
      <form onSubmit={onSubmit}>
        { loading ? <Loader modifiers={['centered']} /> : null }
        {submissionSteps && submissionSteps.map((stepData, i) => (
          <FormStepSummary
            key={stepData.submissionStep.id}
            stepData={stepData}
            editStepUrl={`/stap/${form.steps[i].slug}`}
            editStepText={form.literals.changeText.resolved}
          />
        ))}
        <Toolbar modifiers={['mobile-reverse-order']}>
          <ToolbarList>
            <Button
              variant="anchor"
              component="a"
              href={prevPageUrl}
              onClick={event => {
                event.preventDefault();
                history.push(prevPageUrl);
              }}
            >{form.literals.previousText.resolved}</Button>
          </ToolbarList>
          <ToolbarList>
            <Button type="submit" variant="primary" name="confirm" disabled={loading}>
              {form.literals.confirmText.resolved}
            </Button>
          </ToolbarList>
        </Toolbar>
      </form>
    </Card>
  );
};

Summary.propTypes = {
  form: Types.Form.isRequired,
  submission: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
};


export default Summary;
