import {render, screen} from '@testing-library/react';
import messagesNL from 'i18n/compiled/nl.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm, buildSubmission} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {mockSubmissionGet, mockSubmissionSummaryGet} from 'api-mocks/submissions';
import SubmissionProvider from 'components/SubmissionProvider';
import {SubmissionSummary} from 'components/Summary';
import {FUTURE_FLAGS, PROVIDER_FUTURE_FLAGS} from 'routes';

const Wrapper = ({form, submission}) => {
  const routes = [
    {
      path: '/overzicht',
      element: (
        <SubmissionProvider
          submission={submission}
          onSubmissionObtained={vi.fn()}
          onDestroySession={vi.fn()}
          removeSubmissionId={vi.fn()}
        >
          <SubmissionSummary />
        </SubmissionProvider>
      ),
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/overzicht'],
    future: FUTURE_FLAGS,
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
          <RouterProvider router={router} future={PROVIDER_FUTURE_FLAGS} />
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
      submissionAllowed: 'yes',
      isAuthenticated: true,
    });
    mswServer.use(mockSubmissionGet(submissionIsAuthenticated), mockSubmissionSummaryGet());

    render(<Wrapper form={form} submission={submissionIsAuthenticated} />);

    const logoutButton = await screen.findByRole('button', {name: 'Uitloggen'});
    expect(logoutButton).toBeVisible();
  }
);

test('Summary when isAuthenticated and loginRequired are false', async () => {
  const form = buildForm({loginRequired: false});
  const submissionNotAuthenticated = buildSubmission({
    submissionAllowed: 'yes',
    isAuthenticated: false,
  });
  mswServer.use(mockSubmissionGet(submissionNotAuthenticated), mockSubmissionSummaryGet());

  render(<Wrapper form={form} submission={submissionNotAuthenticated} />);

  // we expect an abort button instead of log out
  const cancelButton = await screen.findByRole('button', {name: 'Annuleren'});
  expect(cancelButton).toBeVisible();
  const logoutButton = screen.queryByRole('button', {name: 'Uitloggen'});
  expect(logoutButton).toBeNull();
});
