import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {IntlProvider} from 'react-intl';
import {useAsync} from 'react-use';

import Summary from 'components/Summary';
import messagesNL from 'i18n/compiled/nl.json';
import {testForm} from 'components/FormStart/fixtures';
import useRefreshSubmission from 'hooks/useRefreshSubmission';
import {SUBMISSION_ALLOWED} from 'components/constants';

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
};

jest.mock('react-use');
jest.mock('hooks/useRefreshSubmission');

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

it('Summary displays logout button if isAuthenticated is true', () => {
  const submissionIsAuthenticated = {
    ...SUBMISSION,
    isAuthenticated: true,
  };
  const onLogout = jest.fn();
  const onConfirm = jest.fn();

  useAsync.mockReturnValue({loading: false, value: []});
  useRefreshSubmission.mockReturnValue(submissionIsAuthenticated);

  act(() => {
    render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <Summary
          form={testForm}
          submission={SUBMISSION}
          onConfirm={onConfirm}
          onLogout={onLogout}
        />
      </IntlProvider>,
      container
    );
  });

  expect(container.textContent).toContain('Uitloggen');
});

it('Summary does not display logout button if loginRequired is false', () => {
  const formLoginRequired = {
    ...testForm,
    loginRequired: false,
  };
  const onLogout = jest.fn();
  const onConfirm = jest.fn();

  useAsync.mockReturnValue({loading: false, value: []});
  useRefreshSubmission.mockReturnValue(SUBMISSION);

  act(() => {
    render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <Summary
          form={formLoginRequired}
          submission={SUBMISSION}
          onConfirm={onConfirm}
          onLogout={onLogout}
        />
      </IntlProvider>,
      container
    );
  });

  expect(container.textContent).not.toContain('Uitloggen');
});
