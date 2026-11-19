import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm, buildSubmission} from '@/api-mocks';
import mswWorker from '@/api-mocks/msw-worker';
import {
  mockSubmissionCompleteInvalidPost,
  mockSubmissionCompletePost,
  mockSubmissionGet,
  mockSubmissionSummaryGet,
} from '@/api-mocks/submissions';
import SubmissionProvider from '@/components/SubmissionProvider';
import type {Form} from '@/data/forms';
import type {Submission} from '@/data/submissions';
import messagesNL from '@/i18n/compiled/nl.json';
import {FUTURE_FLAGS} from '@/routes';
import {sleep} from '@/utils';

import SubmissionSummary from './SubmissionSummary';

interface WrapperProps {
  form: Form;
  submission: Submission;
}

const Wrapper: React.FC<WrapperProps> = ({form, submission}) => {
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
    {
      path: '/bevestiging',
      element: <p>Confirmation</p>,
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
        showFormTitle: true,
        clientBaseUrl: 'http://localhost/',
        basePath: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
        debug: false,
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
      submissionAllowed: 'yes',
      isAuthenticated: true,
    });
    mswWorker.use(mockSubmissionGet(submissionIsAuthenticated), mockSubmissionSummaryGet());

    const screen = await render(<Wrapper form={form} submission={submissionIsAuthenticated} />);

    const logoutButton = screen.getByRole('button', {name: 'Uitloggen'});
    await expect.element(logoutButton).toBeVisible();
  }
);

test('Summary when isAuthenticated and loginRequired are false', async () => {
  const form = buildForm({loginRequired: false});
  const submissionNotAuthenticated = buildSubmission({
    submissionAllowed: 'yes',
    isAuthenticated: false,
  });
  mswWorker.use(mockSubmissionGet(submissionNotAuthenticated), mockSubmissionSummaryGet());

  const screen = await render(<Wrapper form={form} submission={submissionNotAuthenticated} />);

  // we expect an abort button instead of log out
  const cancelButton = screen.getByRole('button', {name: 'Annuleren'});
  await expect.element(cancelButton).toBeVisible();
  const logoutButton = screen.getByRole('button', {name: 'Uitloggen'});
  await expect.element(logoutButton).not.toBeInTheDocument();
});

test('Long submission completion API call', async () => {
  const form = buildForm();
  const submission = buildSubmission();
  mswWorker.use(
    mockSubmissionGet(submission),
    mockSubmissionSummaryGet(),
    mockSubmissionCompletePost(submission.id, 1000)
  );

  const screen = await render(<Wrapper form={form} submission={submission} />);

  await screen.getByRole('checkbox', {name: 'Privacy'}).click();
  const confirmButton = screen.getByTestId('form-submit-button');
  await expect.element(confirmButton).toBeEnabled();

  // Form navigation should be disabled during the completion call
  await confirmButton.click();
  await expect.element(confirmButton).toBeDisabled();
  await expect.element(screen.getByRole('link', {name: 'Previous'})).toBeDisabled();
  await expect.element(screen.getByRole('button', {name: 'Annuleren'})).toBeDisabled();

  // After which the confirmation screen should be visible
  await sleep(100);
  await expect.element(screen.getByText('Confirmation')).toBeVisible();
});

test('Long submission completion API call with error', async () => {
  const form = buildForm();
  const submission = buildSubmission();
  mswWorker.use(
    mockSubmissionGet(submission),
    mockSubmissionSummaryGet(),
    mockSubmissionCompleteInvalidPost([], 100)
  );

  const screen = await render(<Wrapper form={form} submission={submission} />);

  await screen.getByRole('checkbox', {name: 'Privacy'}).click();
  const confirmButton = screen.getByTestId('form-submit-button');
  await expect.element(confirmButton).toBeEnabled();

  // Button should be disabled during the completion call
  await confirmButton.click();
  await expect.element(confirmButton).toBeDisabled();
  await expect.element(screen.getByRole('link', {name: 'Previous'})).toBeDisabled();
  await expect.element(screen.getByRole('button', {name: 'Annuleren'})).toBeDisabled();

  // After which is should be enabled again
  await sleep(100);
  await expect.element(confirmButton).toBeEnabled();
  await expect.element(screen.getByRole('link', {name: 'Previous'})).toBeEnabled();
  await expect.element(screen.getByRole('button', {name: 'Annuleren'})).toBeEnabled();
});
