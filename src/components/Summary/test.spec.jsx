import {render as renderTest, screen} from '@testing-library/react';
import messagesNL from 'i18n/compiled/nl.json';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router-dom';
import {useAsync} from 'react-use';

import {testForm} from 'components/FormStart/fixtures';
import SubmissionSummary from 'components/Summary';
import {SUBMISSION_ALLOWED} from 'components/constants';
import useRefreshSubmission from 'hooks/useRefreshSubmission';

const SUBMISSION = {
  id: 'random-id',
  url: 'https://example.com',
  form: 'https://example.com',
  steps: [
    {
      formStep:
        'http://testserver/api/v1/forms/33af5a1c-552e-4e8f-8b19-287cf35b9edd/steps/0c2a1816-a7d7-4193-b431-918956744038',
    },
  ],
  submissionAllowed: SUBMISSION_ALLOWED.yes,
  payment: {
    isRequired: false,
    amount: '',
    hasPaid: false,
  },
  isAuthenticated: false,
};

vi.mock('react-use');
vi.mock('hooks/useRefreshSubmission');

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

const Wrap = ({children}) => (
  <IntlProvider locale="nl" messages={messagesNL}>
    <MemoryRouter>{children}</MemoryRouter>
  </IntlProvider>
);

it('Summary displays logout button if isAuthenticated is true', () => {
  const submissionIsAuthenticated = {
    ...SUBMISSION,
    isAuthenticated: true,
  };
  const onDestroySession = vi.fn();
  const onConfirm = vi.fn();

  useAsync.mockReturnValue({loading: false, value: []});
  useRefreshSubmission.mockReturnValue(submissionIsAuthenticated);

  act(() => {
    root.render(
      <Wrap>
        <SubmissionSummary
          form={testForm}
          submission={SUBMISSION}
          onConfirm={onConfirm}
          onDestroySession={onDestroySession}
          onClearProcessingErrors={() => {}}
        />
      </Wrap>
    );
  });

  expect(container.textContent).toContain('Uitloggen');
});

it('Summary does not display logout button if loginRequired is false', () => {
  const formLoginRequired = {
    ...testForm,
    loginRequired: false,
  };
  const onDestroySession = vi.fn();
  const onConfirm = vi.fn();

  useAsync.mockReturnValue({loading: false, value: []});
  useRefreshSubmission.mockReturnValue({...SUBMISSION, isAuthenticated: false});

  act(() => {
    root.render(
      <Wrap>
        <SubmissionSummary
          form={formLoginRequired}
          submission={SUBMISSION}
          onConfirm={onConfirm}
          onDestroySession={onDestroySession}
          onClearProcessingErrors={() => {}}
        />
      </Wrap>
    );
  });

  expect(container.textContent).not.toContain('Uitloggen');
});

it('Summary displays abort button if isAuthenticated is false', () => {
  const onDestroySession = vi.fn();
  const onConfirm = vi.fn();

  useAsync.mockReturnValue({loading: false, value: []});
  useRefreshSubmission.mockReturnValue({...SUBMISSION, isAuthenticated: false});

  renderTest(
    <Wrap>
      <SubmissionSummary
        form={testForm}
        submission={SUBMISSION}
        onConfirm={onConfirm}
        onDestroySession={onDestroySession}
        onClearProcessingErrors={() => {}}
      />
    </Wrap>
  );

  expect(screen.queryByRole('button', {name: 'Afbreken'})).toBeInTheDocument();
});
