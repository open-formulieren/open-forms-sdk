import {Formik} from 'formik';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';

import {LiteralsProvider} from 'components/Literal';
import {SUBMISSION_ALLOWED} from 'components/constants';

import SummaryConfirmation from './index';

let container = null;
let root = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  // cleanup on exiting
  root.unmount();
  container.remove();
  root = null;
  container = null;
});

const PRIVACY = {
  requiresPrivacyConsent: false,
  privacyLabel: 'This is privacy',
};

const LITERALS = {
  confirmText: {value: '', resolved: 'Submit form'},
  previousText: {value: '', resolved: 'Previous step'},
};

const Wrapper = ({children}) => (
  <LiteralsProvider literals={LITERALS}>
    <Formik initialValues={{privacy: false}} onSubmit={jest.fn()}>
      {children}
    </Formik>
  </LiteralsProvider>
);

it('Summary of non-submittable form, button is NOT present', () => {
  const mockFunction = jest.fn();

  act(() => {
    root.render(
      <Wrapper>
        <SummaryConfirmation
          submissionAllowed={SUBMISSION_ALLOWED.noWithOverview}
          privacy={PRIVACY}
          onPrevPage={mockFunction}
        />
      </Wrapper>
    );
  });

  const buttons = container.getElementsByClassName('openforms-toolbar__list-item');

  expect(buttons.length).toEqual(1);
  expect(buttons[0].textContent).toEqual('Previous step');
});

it('Summary of submittable form, button IS present', () => {
  const mockFunction = jest.fn();

  act(() => {
    root.render(
      <Wrapper>
        <SummaryConfirmation
          submissionAllowed={SUBMISSION_ALLOWED.yes}
          privacy={PRIVACY}
          onPrevPage={mockFunction}
        />
      </Wrapper>
    );
  });

  const buttons = container.getElementsByClassName('openforms-toolbar__list-item');

  expect(buttons.length).toEqual(2);
  expect(buttons[0].textContent).toEqual('Previous step');
  expect(buttons[1].textContent).toEqual('Submit form');
});
