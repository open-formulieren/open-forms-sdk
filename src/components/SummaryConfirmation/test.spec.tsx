import {Formik} from 'formik';
import {MemoryRouter} from 'react-router';
import {expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';

import {LiteralsProvider} from '@/components/Literal';
import type {Form} from '@/data/forms';

import SummaryConfirmation from './index';

const LITERALS: Form['literals'] = {
  confirmText: {resolved: 'Submit form'},
  previousText: {resolved: 'Previous step'},
  beginText: {resolved: ''},
  changeText: {resolved: ''},
};

const Wrapper: React.FC<React.PropsWithChildren> = ({children}) => (
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

test('Summary of non-submittable form, button is NOT present', async () => {
  const screen = await render(
    <Wrapper>
      <SummaryConfirmation
        submissionAllowed="no_with_overview"
        prevPage="some-page"
        hideAbortButton
      />
    </Wrapper>
  );

  const button = screen.getByRole('button');

  await expect.element(button).not.toBeInTheDocument();
});

test('Summary of submittable form, button IS present', async () => {
  const screen = await render(
    <Wrapper>
      <SummaryConfirmation submissionAllowed="yes" prevPage="some-page" hideAbortButton />
    </Wrapper>
  );

  const button = screen.getByRole('button', {name: 'Submit form'});

  await expect.element(button).toBeVisible();
});
