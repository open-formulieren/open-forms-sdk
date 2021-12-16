import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import cloneDeep from 'lodash/cloneDeep';

import {SUBMISSION_ALLOWED} from 'components/constants';
import ButtonsToolbar from './index';
import {basicForm} from './fixtures';


let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});


const LITERALS = {
  nextText: {value: '', resolved: 'Next step'},
  saveText: {value: '', resolved: 'Save step'},
  previousText: {value: '', resolved: 'Previous step'},
};


it('Last step of submittable form, button is present', () => {

  let testForm = cloneDeep(basicForm);
  testForm = {
    ...testForm,
    submissionAllowed: SUBMISSION_ALLOWED.yes,
    loginRequired: false,
  };

  const mockFunction = jest.fn();

  act(() => {
    render(
      <ButtonsToolbar
        form={testForm}
        literals={LITERALS}
        canSubmitStep={true}
        isLastStep={true}
        isCheckingLogic={false}
        onNavigatePrevPage={mockFunction}
        onFormSave={mockFunction}
        onLogout={mockFunction}
      />,
      container
    );
  });

  const buttons = container.getElementsByClassName('openforms-toolbar__list-item');

  expect(buttons.length).toEqual(3);
  expect(buttons[0].textContent).toEqual('Previous step');
  expect(buttons[1].textContent).toEqual('Save step');
  expect(buttons[2].textContent).toEqual('Next step');
});


it('Last step of non-submittable form with overview, button is present', () => {

  let testForm = cloneDeep(basicForm);
  testForm = {
    ...testForm,
    submissionAllowed: SUBMISSION_ALLOWED.noWithOverview,
    loginRequired: false,
  };

  const mockFunction = jest.fn();

  act(() => {
    render(
      <ButtonsToolbar
        form={testForm}
        literals={LITERALS}
        canSubmitStep={true}
        isLastStep={true}
        isCheckingLogic={false}
        onNavigatePrevPage={mockFunction}
        onFormSave={mockFunction}
        onLogout={mockFunction}
      />,
      container
    );
  });

  const buttons = container.getElementsByClassName('openforms-toolbar__list-item');

  expect(buttons.length).toEqual(3);
  expect(buttons[0].textContent).toEqual('Previous step');
  expect(buttons[1].textContent).toEqual('Save step');
  expect(buttons[2].textContent).toEqual('Next step');
});


it('Last step of non-submittable form without overview, button is NOT present', () => {
  let testForm = cloneDeep(basicForm);
  testForm = {
    ...testForm,
    submissionAllowed: SUBMISSION_ALLOWED.noWithoutOverview,
    loginRequired: false,
  };

  const mockFunction = jest.fn();

  act(() => {
    render(
      <ButtonsToolbar
        form={testForm}
        literals={LITERALS}
        canSubmitStep={true}
        isLastStep={true}
        isCheckingLogic={false}
        onNavigatePrevPage={mockFunction}
        onFormSave={mockFunction}
        onLogout={mockFunction}
      />,
      container
    );
  });

  const buttons = container.getElementsByClassName('openforms-toolbar__list-item');

  expect(buttons.length).toEqual(2);
  expect(buttons[0].textContent).toEqual('Previous step');
  expect(buttons[1].textContent).toEqual('Save step');
});


it('Non-last step of non-submittable form without overview, button IS present', () => {
  let testForm = cloneDeep(basicForm);
  testForm = {
    ...testForm,
    submissionAllowed: SUBMISSION_ALLOWED.noWithoutOverview,
    loginRequired: false,
  };

  const mockFunction = jest.fn();

  act(() => {
    render(
      <ButtonsToolbar
        form={testForm}
        literals={LITERALS}
        canSubmitStep={true}
        isLastStep={false}
        isCheckingLogic={false}
        onNavigatePrevPage={mockFunction}
        onFormSave={mockFunction}
        onLogout={mockFunction}
      />,
      container
    );
  });

  const buttons = container.getElementsByClassName('openforms-toolbar__list-item');

  expect(buttons.length).toEqual(3);
  expect(buttons[0].textContent).toEqual('Previous step');
  expect(buttons[1].textContent).toEqual('Save step');
  expect(buttons[2].textContent).toEqual('Next step');
});
