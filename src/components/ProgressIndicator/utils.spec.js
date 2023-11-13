import {buildSubmission} from 'api-mocks/submissions';

import {addFixedSteps, getStepsInfo} from './utils';

const formSteps = [
  {
    uuid: '9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5',
    slug: 'step-1',
    to: 'step-1',
    formDefinition: 'Step 1',
    isCompleted: false,
    isApplicable: true,
    isCurrent: false,
    canNavigateTo: true,
  },
];

it('updates steps as expected', () => {
  const submission = buildSubmission();
  const updatedSteps = getStepsInfo(formSteps, submission, '/start-page');
  const stepsToRender = addFixedSteps(updatedSteps, submission, '/start-page', true, true);

  expect(stepsToRender[0].slug).toEqual('startpagina');

  expect(stepsToRender[1].uuid).toEqual('9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5');
  expect(stepsToRender[1].slug).toEqual('step-1');
  expect(stepsToRender[1].to).toEqual('/stap/step-1');
  expect(stepsToRender[1].formDefinition).toEqual('Step 1');
  expect(stepsToRender[1].isCompleted).toEqual(false);
  expect(stepsToRender[1].isApplicable).toEqual(true);
  expect(stepsToRender[1].isCurrent).toEqual(false);
  expect(stepsToRender[1].canNavigateTo).toEqual(true);

  expect(stepsToRender[2].slug).toEqual('overzicht');
  expect(stepsToRender[3].slug).toEqual('bevestiging');
});

it('doesnt contain overview and summary when false', () => {
  const submission = buildSubmission();
  const updatedSteps = getStepsInfo(formSteps, submission, '/start-page');
  const stepsToRender = addFixedSteps(updatedSteps, submission, '/start-page', false, false);

  expect(stepsToRender.length).toEqual(2);

  expect(stepsToRender[0].slug).toEqual('startpagina');

  expect(stepsToRender[1].uuid).toEqual('9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5');
  expect(stepsToRender[1].slug).toEqual('step-1');
  expect(stepsToRender[1].to).toEqual('/stap/step-1');
  expect(stepsToRender[1].formDefinition).toEqual('Step 1');
  expect(stepsToRender[1].isCompleted).toEqual(false);
  expect(stepsToRender[1].isApplicable).toEqual(true);
  expect(stepsToRender[1].isCurrent).toEqual(false);
  expect(stepsToRender[1].canNavigateTo).toEqual(true);
});
