import {render, screen} from '@testing-library/react';
import messagesNL from 'i18n/compiled/nl.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm, buildSubmission} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {mockSubmissionGet, mockSubmissionSummaryGet} from 'api-mocks/submissions';
import {SubmissionSummary} from 'components/Summary';
import {SUBMISSION_ALLOWED} from 'components/constants';

const Wrap = ({form, children}) => {
  const routes = [
    {
      path: '/overzicht',
      element: children,
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/overzicht'],
  });
  return (
    <ConfigContext.Provider
      value={{
        baseUrl: BASE_URL,
        clientBaseUrl: 'http://localhost/',
        basePath: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
      }}
    >
      <IntlProvider locale="nl" messages={messagesNL}>
        <FormContext.Provider value={form}>
          <RouterProvider router={router} />
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

test.each([true, false])(
  'Summary displays logout button if isAuthenticated is true (loginRequired: %s)',
  async loginRequired => {
    const form = buildForm({loginRequired});
    const submissionIsAuthenticated = buildSubmission({
      submissionAllowed: SUBMISSION_ALLOWED.yes,
      isAuthenticated: true,
    });
    mswServer.use(mockSubmissionGet(submissionIsAuthenticated), mockSubmissionSummaryGet());
    const onDestroySession = vi.fn();
    const onConfirm = vi.fn();

    render(
      <Wrap form={form}>
        <SubmissionSummary
          form={form}
          submission={submissionIsAuthenticated}
          onConfirm={onConfirm}
          onDestroySession={onDestroySession}
          onClearProcessingErrors={() => {}}
        />
      </Wrap>
    );

    const logoutButton = await screen.findByRole('button', {name: 'Uitloggen'});
    expect(logoutButton).toBeVisible();
  }
);

test('Summary when isAuthenticated and loginRequired are false', async () => {
  const form = buildForm({loginRequired: false});
  const submissionIsAuthenticated = buildSubmission({
    submissionAllowed: SUBMISSION_ALLOWED.yes,
    isAuthenticated: false,
  });
  mswServer.use(mockSubmissionGet(submissionIsAuthenticated), mockSubmissionSummaryGet());
  const onDestroySession = vi.fn();
  const onConfirm = vi.fn();

  render(
    <Wrap form={form}>
      <SubmissionSummary
        form={form}
        submission={submissionIsAuthenticated}
        onConfirm={onConfirm}
        onDestroySession={onDestroySession}
        onClearProcessingErrors={() => {}}
      />
    </Wrap>
  );

  // we expect an abort button instead of log out
  const cancelButton = await screen.findByRole('button', {name: 'Annuleren'});
  expect(cancelButton).toBeVisible();
  const logoutButton = screen.queryByRole('button', {name: 'Uitloggen'});
  expect(logoutButton).toBeNull();
});
