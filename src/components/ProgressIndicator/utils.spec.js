import messagesEN from 'i18n/compiled/en.json';
import {createIntl, createIntlCache} from 'react-intl';

import {buildSubmission} from 'api-mocks/submissions';

import {addFixedSteps, getStepsInfo} from './utils';

const cache = createIntlCache();
const intl = createIntl({locale: 'en', messages: messagesEN}, cache);

const formSteps = [
  {
    slug: 'step-1',
    formDefinition: 'Step 1',
    isCompleted: false,
    isApplicable: true,
    isCurrent: true,
    canNavigateTo: true,
  },
];

describe('Transforming form steps and injecting fixed steps', () => {
  it('prepends start page and appends summary and confirmation steps', () => {
    const submission = buildSubmission();
    const updatedSteps = getStepsInfo(formSteps, submission, '/stap/step-1');
    const stepsToRender = addFixedSteps(intl, updatedSteps, submission, '/stap/step-1', true, true);

    expect(stepsToRender.length).toEqual(4);
    expect(stepsToRender[0].to).toEqual('startpagina');

    expect(stepsToRender[1].to).toEqual('/stap/step-1');
    expect(stepsToRender[1].label).toEqual('Step 1');
    expect(stepsToRender[1].isCompleted).toEqual(false);
    expect(stepsToRender[1].isApplicable).toEqual(true);
    expect(stepsToRender[1].isCurrent).toEqual(true);
    expect(stepsToRender[1].canNavigateTo).toEqual(true);

    expect(stepsToRender[2].to).toEqual('overzicht');
    expect(stepsToRender[3].to).toEqual('bevestiging');
  });

  it('accepts parameters to not append summary or confirmation', () => {
    const submission = buildSubmission();
    const updatedSteps = getStepsInfo(formSteps, submission, '/stap/step-1');
    const stepsToRender = addFixedSteps(
      intl,
      updatedSteps,
      submission,
      '/stap/step-1',
      false,
      false
    );

    expect(stepsToRender.length).toEqual(2);

    expect(stepsToRender[0].to).toEqual('startpagina');

    expect(stepsToRender[1].to).toEqual('/stap/step-1');
    expect(stepsToRender[1].label).toEqual('Step 1');
    expect(stepsToRender[1].isCompleted).toEqual(false);
    expect(stepsToRender[1].isApplicable).toEqual(true);
    expect(stepsToRender[1].isCurrent).toEqual(true);
    expect(stepsToRender[1].canNavigateTo).toEqual(true);
  });
});
