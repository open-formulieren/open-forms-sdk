import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import {SUBMISSION_ALLOWED} from 'components/constants';
import {LiteralsProvider} from 'components/Literal';
import SummaryConfirmation from './index';


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


const PRIVACY = {
  requiresPrivacyConsent: false,
  policyAccepted: false,
  privacyLabel: 'This is privacy'
};

const LITERALS = {
  confirmText: {value: '', resolved: 'Submit form'},
  previousText: {value: '', resolved: 'Previous step'},
};


it('Summary of non-submittable form, button is NOT present', () => {
  const mockFunction = jest.fn();

  act(() => {
    render(
      <LiteralsProvider literals={LITERALS}>
        <SummaryConfirmation
          submissionAllowed={SUBMISSION_ALLOWED.noWithOverview}
          privacy={PRIVACY}
          onPrivacyCheckboxChange={mockFunction}
          onPrevPage={mockFunction}
        />
      </LiteralsProvider>,
      container
    );
  });

  const buttons = container.getElementsByClassName('openforms-toolbar__list-item');

  expect(buttons.length).toEqual(1);
  expect(buttons[0].textContent).toEqual('Previous step');
});


it('Summary of submittable form, button IS present', () => {
  const mockFunction = jest.fn();

  act(() => {
    render(
      <LiteralsProvider literals={LITERALS}>
        <SummaryConfirmation
          submissionAllowed={SUBMISSION_ALLOWED.yes}
          privacy={PRIVACY}
          onPrivacyCheckboxChange={mockFunction}
          onPrevPage={mockFunction}
        />
      </LiteralsProvider>,
      container
    );
  });

  const buttons = container.getElementsByClassName('openforms-toolbar__list-item');

  expect(buttons.length).toEqual(2);
  expect(buttons[0].textContent).toEqual('Previous step');
  expect(buttons[1].textContent).toEqual('Submit form');
});
