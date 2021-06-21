import React from 'react';
import PropTypes from 'prop-types';
import useAsync from 'react-use/esm/useAsync';
import { useHistory } from 'react-router-dom';

import { get, post } from './api';
import Button from './Button';
import Card from "./Card";
import FormStepSummary from "./FormStepSummary";
import { Toolbar, ToolbarList } from './Toolbar';
import { flattenComponents } from './utils';


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
    const {downloadUrl, confirmationPageContent} = await completeSubmission(submission);
    onConfirm(downloadUrl, confirmationPageContent);
  };

  return (
    <Card title="Controleer en bevestig">
      <form onSubmit={onSubmit}>
        { loading ? 'Loading...' : null }
        {submissionSteps && submissionSteps.map((stepData, i) => (
          <FormStepSummary
            key={stepData.submissionStep.id}
            stepData={stepData}
            editStepUrl={`/stap/${form.steps[i].slug}`}
          />
        ))}
        <Toolbar>
          <ToolbarList>
            <Button
              variant="anchor"
              component="a"
              href={prevPageUrl}
              onClick={event => {
                event.preventDefault();
                history.push(prevPageUrl);
              }}
            >Vorige pagina</Button>
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
  form: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    loginRequired: PropTypes.bool.isRequired,
    product: PropTypes.object,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      formDefinition: PropTypes.string.isRequired,
      index: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  submission: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
};


export default Summary;
