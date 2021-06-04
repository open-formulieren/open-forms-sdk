import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import useAsync from 'react-use/esm/useAsync';

import { Toolbar, ToolbarList } from './Toolbar';
import Button from './Button';
import { get, post } from './api';
import FormIOWrapper from "./FormIOWrapper";
import {Templates} from "react-formio";

// use our own template for this component
Templates.addTemplate('overview', {
  component: {
    form: `
      <div id="{{ctx.id}}" class="{{ctx.classes}}" style="display: table;width: 100%; table-layout: fixed; margin-bottom: 1vh;" ref="component">
          <div style="display: table-row">
              {{ctx.children}}
          </div>
      </div>
      `
  },
  label: {
    form: `
      <label class="openforms-label {{ctx.label.className}}" style="display: table-cell" for="{{ctx.instance.id}}-{{ctx.component.key}}">
        {{ ctx.t(ctx.component.label) }}
        {% if (ctx.component.tooltip) { %}
          <i ref="tooltip" class="{{ctx.iconClass('question-sign')}}"></i>
        {% } %}
      </label>
      `
  }
});


const loadStepsData = async (submission) => {
  return await Promise.all(submission.steps.map(async (submissionStep) => {
    const submissionStepDetail = await get(submissionStep.url);
    const formStepDetail = await get(submissionStep.formStep);
    const formDefinitionDetail = await get(formStepDetail.formDefinition);
    return {
      submissionStep,
      title: formDefinitionDetail.name,
      data: {
        data: submissionStepDetail.data
      },
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
    <form onSubmit={onSubmit}>
      <h2>Controleer en bevestig</h2>

      {value && value.map((step, index) => (
        <Fragment key={index}>
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
            <h3>{step.title}</h3>
            <Button variant="anchor" component="a" onClick={_ => onShowStep(step.submissionStep)}>
              Wijzig {step.title.toLocaleLowerCase()}
            </Button>
          </div>
          <FormIOWrapper
            form={step.configuration}
            submission={step.data}
            options={{renderMode: 'html', template: 'overview'}}
          />
        </Fragment>
      ))}

      <Toolbar>
        <ToolbarList>
          <Button variant="anchor" component="a" onClick={_ => onShowStep(submission.steps[submission.steps.length-1])}>Vorige pagina</Button>
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
