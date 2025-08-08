import {render, screen} from '@testing-library/react';
import {Formik} from 'formik';
import {MemoryRouter} from 'react-router';

import {LiteralsProvider} from 'components/Literal';

import SummaryConfirmation from './index';

const LITERALS = {
  confirmText: {value: '', resolved: 'Submit form'},
  previousText: {value: '', resolved: 'Previous step'},
};

const Wrapper = ({children}) => (
  <MemoryRouter>
    <LiteralsProvider literals={LITERALS}>
      <Formik
        initialValues={{privacyPolicyAccepted: false, statementOfTruthAccepted: false}}
        onSubmit={vi.fn()}
      >
        {children}
      </Formik>
    </LiteralsProvider>
  </MemoryRouter>
);

it('Summary of non-submittable form, button is NOT present', () => {
  render(
    <Wrapper>
      <SummaryConfirmation
        submissionAllowed="no_with_overview"
        prevPage="some-page"
        hideAbortButton
      />
    </Wrapper>
  );

  const buttons = screen.queryByRole('button');

  expect(buttons).toBeNull();
});

it('Summary of submittable form, button IS present', () => {
  render(
    <Wrapper>
      <SummaryConfirmation submissionAllowed="yes" prevPage="some-page" hideAbortButton />
    </Wrapper>
  );

  const button = screen.getByRole('button');

  expect(button).toBeDefined();
  expect(button.textContent).toEqual('Submit form');
});
