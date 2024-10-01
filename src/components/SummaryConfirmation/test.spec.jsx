import {render as renderTest, screen} from '@testing-library/react';
import {Formik} from 'formik';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {MemoryRouter} from 'react-router-dom';

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
  act(() => {
    root.unmount();
    container.remove();
    root = null;
    container = null;
  });
});

const LITERALS = {
  confirmText: {value: '', resolved: 'Submit form'},
  previousText: {value: '', resolved: 'Previous step'},
};

const Wrapper = ({children}) => (
  <MemoryRouter>
    <LiteralsProvider literals={LITERALS}>
      <Formik
        initialValues={{privacyPolicyAccepted: false, statementOfTruthAccepted: false}}
        onSubmit={jest.fn()}
      >
        {children}
      </Formik>
    </LiteralsProvider>
  </MemoryRouter>
);

it('Summary of non-submittable form, button is NOT present', () => {
  const mockFunction = jest.fn();

  renderTest(
    <Wrapper>
      <SummaryConfirmation
        submissionAllowed={SUBMISSION_ALLOWED.noWithOverview}
        prevPage="some-page"
        onPrevPage={mockFunction}
      />
    </Wrapper>
  );

  const buttons = screen.queryByRole('button');

  expect(buttons).toBeNull();
});

it('Summary of submittable form, button IS present', () => {
  const mockFunction = jest.fn();

  renderTest(
    <Wrapper>
      <SummaryConfirmation
        submissionAllowed={SUBMISSION_ALLOWED.yes}
        prevPage="some-page"
        onPrevPage={mockFunction}
      />
    </Wrapper>
  );

  const button = screen.getByRole('button');

  expect(button).toBeDefined();
  expect(button.textContent).toEqual('Submit form');
});
