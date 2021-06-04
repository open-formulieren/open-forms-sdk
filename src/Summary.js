import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import useAsync from 'react-use/esm/useAsync';

import { Toolbar, ToolbarList } from './Toolbar';
import Button from './Button';
import { get, post } from './api';
import FormIOWrapper from "./FormIOWrapper";
import {Templates} from "react-formio";
import {default as LabelTemplate} from "./formio/templates/label";
import {default as TextTemplate} from "./formio/templates/text";
import {default as ComponentTemplate} from "./formio/templates/component";

// use our own template library
// Templates.current = {
  // component: {form: `
  //   <p>-------------------------------------</p>
  //   <p>This needs to be a table</p>
  //   <div id="{{ctx.id}}" class="{{ctx.classes}}"{% if (ctx.styles) { %} styles="{{ctx.styles}}"{% } %} ref="component">
  //     <div ref="messageContainer"></div>
  //     {% if (ctx.visible) { %}
  //     {{ctx.children}}
  //     {% } %}
  //   </div>
  //   <p>-------------------------------------</p>
  //   `
  // },

//   component: {form: `
//     <p>-----</p>
//     <table class="table">
//     <tbody class="table__body">
//     <tr class="table__row">
//         <th class="table__head">
//             <p class="body">Put label here</p>
//         </th>
//         <td class="table__cell">
//             <p class="body">
//                 Put content here
//             </p>
//         </td>
//     </tr>
//     </tbody>
// </table>
//     `
//   },
//
//   label: {form: `
//       <label class="openforms-label {{ctx.label.className}}" for="{{ctx.instance.id}}-{{ctx.component.key}}">
//         {{ ctx.t(ctx.component.label) }}
//         {% if (ctx.component.tooltip) { %}
//           <i ref="tooltip" class="{{ctx.iconClass('question-sign')}}"></i>
//         {% } %}
//       </label>
//       `
//   }
// };


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
            // Pass template in here. Still pass renderMode and flatten
            options={{noAlerts: true, readOnly: true, renderMode: 'html'}}
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
