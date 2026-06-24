import {NuqsTestingAdapter} from 'nuqs/adapters/testing';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {afterAll, afterEach, beforeEach, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm, buildSubmission, mockAnalyticsToolConfigGet} from '@/api-mocks';
import mswWorker from '@/api-mocks/msw-worker';
import {
  mockSubmissionCompletePost,
  mockSubmissionGet,
  mockSubmissionPaymentStartPost,
  mockSubmissionPost,
  mockSubmissionProcessingStatusErrorGet,
  mockSubmissionProcessingStatusGet,
  mockSubmissionStepGet,
  mockSubmissionSummaryGet,
} from '@/api-mocks/submissions';
import {type Form} from '@/data/forms';
import messagesEN from '@/i18n/compiled/en.json';
import routes, {FUTURE_FLAGS} from '@/routes';

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  if (vi.isFakeTimers()) {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  }
  sessionStorage.clear();
});

afterAll(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

interface WrapperProps {
  form?: Form;
  initialEntry?: string;
  searchParams?: string;
}

const Wrapper: React.FC<WrapperProps> = ({
  form = buildForm(),
  initialEntry = '/startpagina',
  searchParams = '',
}) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialEntry],
    initialIndex: 0,
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
      <IntlProvider locale="en" messages={messagesEN}>
        <FormContext.Provider value={form}>
          <NuqsTestingAdapter searchParams={searchParams}>
            <RouterProvider router={router} />
          </NuqsTestingAdapter>
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

// Regression test for https://github.com/open-formulieren/open-forms/issues/4918
test.each([
  {
    introductionPageContent: '',
    buttonText: 'Login with DigiD',
    expectedUrl:
      'http://mock-digid.nl/login?next=' +
      `http%3A%2F%2F${window.encodeURIComponent(window.location.host)}%2F%3F_start%3D1%26initial_data_reference%3Dfoo`,
  },
  {
    introductionPageContent: 'foo',
    buttonText: 'Continue',
    expectedUrl: '/startpagina?initial_data_reference=foo',
  },
])(
  'Redirect to start page or introduction page should preserve initial_data_reference param',
  async ({introductionPageContent, buttonText, expectedUrl}) => {
    mswWorker.use(mockAnalyticsToolConfigGet(), mockSubmissionPost(), mockSubmissionStepGet());

    const screen = await render(
      <Wrapper
        form={buildForm({
          loginOptions: [
            {
              identifier: 'digid',
              label: 'DigiD',
              url: 'http://mock-digid.nl/login',
              logo: {title: 'logo', imageSrc: '', href: '', appearance: 'dark'},
              isForGemachtigde: false,
              visible: true,
            },
          ],
          introductionPageContent: introductionPageContent,
        })}
        initialEntry="/?initial_data_reference=foo"
        searchParams="?initial_data_reference=foo"
      />
    );

    const loginLink = screen.getByRole('link', {name: buttonText});
    await expect.element(loginLink).toHaveAttribute('href', expectedUrl);

    // wait for network requests to settle before exiting
    await expect.element(screen.getByTestId('analytics-config-loaded')).toBeInTheDocument();
  }
);

test('Navigation through form with introduction page', async () => {
  mswWorker.use(mockSubmissionPost(), mockAnalyticsToolConfigGet(), mockSubmissionStepGet());
  const form = buildForm({
    introductionPageContent: '<p>Introduction page content</p>',
    loginRequired: false,
  });

  // initial render should display the introduction page
  const screen = await render(<Wrapper form={form} initialEntry="" />);
  await expect.element(screen.getByText('Introduction page content')).toBeVisible();

  // navigating to the next page takes you to the start page
  const continueLink = screen.getByRole('link', {name: 'Continue'});
  await continueLink.click();
  const startButton = screen.getByRole('button', {name: 'Begin'});
  await expect.element(startButton).toBeVisible();

  // clicking the start button starts the submission and navigates to step 1
  await startButton.click();

  // not sure why this is flaky :(
  const stepTitle = screen.getByRole('heading', {name: 'Step 1'});
  await expect.element(stepTitle).toBeVisible();

  await expect.element(screen.getByLabelText('Component 1')).toBeVisible();
});

test('Navigation through form without introduction page', async () => {
  mswWorker.use(mockSubmissionPost(), mockAnalyticsToolConfigGet(), mockSubmissionStepGet());
  const form = buildForm({
    introductionPageContent: '',
    loginRequired: false,
  });

  // initial render should display the introduction page
  const screen = await render(<Wrapper form={form} initialEntry="" />);

  const startButton = screen.getByRole('button', {name: 'Begin'});
  await expect.element(startButton).toBeVisible();

  // clicking the start button starts the submission and navigates to step 1
  await startButton.click();
  const stepTitle = screen.getByRole('heading', {name: 'Step 1'});
  await expect.element(stepTitle).toBeVisible();
  await expect.element(screen.getByLabelText('Component 1')).toBeVisible();
});

test('Submitting the form with failing background processing', async () => {
  // The summary page submits the form and needs to trigger the appropriate redirects.
  // When the status check reports failure, we need to be redirected back to the summary
  // page for a retry.
  const form = buildForm({loginRequired: false, submissionStatementsConfiguration: []});
  const submission = buildSubmission({
    submissionAllowed: 'yes',
    payment: {
      isRequired: false,
      amount: null,
      hasPaid: false,
    },
  });
  mswWorker.use(
    mockAnalyticsToolConfigGet(),
    mockSubmissionGet(submission),
    mockSubmissionSummaryGet(),
    mockSubmissionCompletePost(),
    mockSubmissionProcessingStatusErrorGet
  );

  const screen = await render(
    <Wrapper form={form} initialEntry={`/overzicht?submission_uuid=${submission.id}`} />
  );

  await expect.element(screen.getByRole('heading', {name: 'Check and confirm'})).toBeVisible();

  // confirm the submission and complete it
  vi.useFakeTimers();
  await screen.getByRole('button', {name: 'Confirm'}).click();
  await expect.element(screen.getByRole('heading', {name: 'Processing...'})).toBeVisible();
  const loader = screen.getByRole('status');
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  await expect.element(loader).not.toBeInTheDocument();

  // due to the error we get redirected back to the summary page.
  await expect.element(screen.getByRole('heading', {name: 'Check and confirm'})).toBeVisible();
  await expect.element(screen.getByText('Computer says no.')).toBeVisible();
});

test('Submitting the form with successful background processing', async () => {
  // The summary page submits the form and needs to trigger the appropriate redirects.
  // When the status check reports failure, we need to be redirected back to the summary
  // page for a retry.
  const form = buildForm({loginRequired: false, submissionStatementsConfiguration: []});
  const submission = buildSubmission({
    submissionAllowed: 'yes',
    payment: {
      isRequired: false,
      amount: null,
      hasPaid: false,
    },
  });
  mswWorker.use(
    mockAnalyticsToolConfigGet(),
    mockSubmissionGet(submission),
    mockSubmissionSummaryGet(),
    mockSubmissionCompletePost(),
    mockSubmissionProcessingStatusGet
  );

  const screen = await render(
    <Wrapper form={form} initialEntry={`/overzicht?submission_uuid=${submission.id}`} />
  );

  await expect.element(screen.getByRole('heading', {name: 'Check and confirm'})).toBeVisible();

  // confirm the submission and complete it
  vi.useFakeTimers();
  await screen.getByRole('button', {name: 'Confirm'}).click();
  await expect.element(screen.getByRole('heading', {name: 'Processing...'})).toBeVisible();
  const loader = screen.getByRole('status');
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  await expect.element(loader).not.toBeInTheDocument();

  // on success, the summary page must display the reference obtained from the backend
  await expect.element(screen.getByRole('heading', {name: 'Confirmation: OF-L337'})).toBeVisible();
});

test('Submitting form with payment requirement', async () => {
  // The summary page submits the form and needs to trigger the appropriate redirects.
  // When the status check reports failure, we need to be redirected back to the summary
  // page for a retry.
  const form = buildForm({loginRequired: false, submissionStatementsConfiguration: []});
  const submission = buildSubmission({
    submissionAllowed: 'yes',
    payment: {
      isRequired: true,
      amount: '42.69',
      hasPaid: false,
    },
  });
  mswWorker.use(
    mockAnalyticsToolConfigGet(),
    mockSubmissionGet(submission),
    mockSubmissionSummaryGet(),
    mockSubmissionCompletePost(),
    mockSubmissionProcessingStatusGet,
    mockSubmissionPaymentStartPost(undefined)
  );

  const screen = await render(
    <Wrapper form={form} initialEntry={`/overzicht?submission_uuid=${submission.id}`} />
  );
  await expect.element(screen.getByRole('heading', {name: 'Check and confirm'})).toBeVisible();

  // confirm the submission and complete it
  vi.useFakeTimers();
  await screen.getByRole('button', {name: 'Confirm'}).click();
  await expect.element(screen.getByRole('heading', {name: 'Processing...'})).toBeVisible();
  const loader = screen.getByRole('status');
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  await expect.element(loader).not.toBeInTheDocument();

  await expect.element(screen.getByText('A payment is required for this product.')).toBeVisible();
});

test('Redirect to start page or introduction page should preserve "auth_visible" param', async () => {
  mswWorker.use(mockAnalyticsToolConfigGet(), mockSubmissionPost(), mockSubmissionStepGet());

  const screen = await render(
    <Wrapper
      form={buildForm({
        loginOptions: [
          {
            identifier: 'digid',
            label: 'DigiD',
            url: 'http://mock-digid.nl/login',
            logo: {title: 'logo', imageSrc: '', href: '', appearance: 'dark'},
            isForGemachtigde: false,
            visible: true,
          },
        ],
        introductionPageContent: 'foo',
      })}
      initialEntry="/?auth_visible=all"
      searchParams="?auth_visible=all"
    />
  );

  const loginLink = screen.getByRole('link', {name: 'Continue'});
  await expect.element(loginLink).toHaveAttribute('href', '/startpagina?auth_visible=all');

  // wait for network requests to settle before exiting
  await expect.element(screen.getByTestId('analytics-config-loaded')).toBeInTheDocument();
});
