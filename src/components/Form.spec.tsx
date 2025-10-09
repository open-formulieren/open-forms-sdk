import {render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm, buildSubmission, mockAnalyticsToolConfigGet} from '@/api-mocks';
import mswServer from '@/api-mocks/msw-server';
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

window.scrollTo = vi.fn();

beforeAll(() => {
  vi.stubGlobal('jest', {
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
  });
});

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
}

const Wrapper: React.FC<WrapperProps> = ({form = buildForm(), initialEntry = '/startpagina'}) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialEntry],
    initialIndex: 0,
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
        debug: false,
        backToTopText: '',
      }}
    >
      <IntlProvider locale="en" messages={messagesEN}>
        <FormContext.Provider value={form}>
          <RouterProvider router={router} />
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
      'http://mock-digid.nl/login?next=http%3A%2F%2Flocalhost%2F%3F_start%3D1%26initial_data_reference%3Dfoo',
  },
  {
    introductionPageContent: 'foo',
    buttonText: 'Continue',
    expectedUrl: '/startpagina?initial_data_reference=foo',
  },
])(
  'Redirect to start page or introduction page should preserve initial_data_reference param',
  async ({introductionPageContent, buttonText, expectedUrl}) => {
    mswServer.use(mockAnalyticsToolConfigGet(), mockSubmissionPost(), mockSubmissionStepGet());

    render(
      <Wrapper
        form={buildForm({
          loginOptions: [
            {
              identifier: 'digid',
              label: 'DigiD',
              url: 'http://mock-digid.nl/login',
              logo: {title: 'logo', imageSrc: '', href: '', appearance: 'dark'},
              isForGemachtigde: false,
            },
          ],
          introductionPageContent: introductionPageContent,
        })}
        initialEntry="/?initial_data_reference=foo"
      />
    );

    const loginLink = await screen.findByRole('link', {name: buttonText});
    expect(loginLink).toHaveAttribute('href', expectedUrl);
  }
);

test('Navigation through form with introduction page', async () => {
  const user = userEvent.setup();
  mswServer.use(mockSubmissionPost(), mockAnalyticsToolConfigGet(), mockSubmissionStepGet());
  const form = buildForm({
    introductionPageContent: '<p>Introduction page content</p>',
    loginRequired: false,
  });

  // initial render should display the introduction page
  render(<Wrapper form={form} initialEntry="" />);
  await screen.findByText('Introduction page content');

  // navigating to the next page takes you to the start page
  const continueLink = screen.getByRole('link', {name: 'Continue'});
  await user.click(continueLink);
  const startButton = await screen.findByRole('button', {name: 'Begin'});
  expect(startButton).toBeVisible();

  // clicking the start button starts the submission and navigates to step 1
  await user.click(startButton);
  const stepTitle = await screen.findByRole('heading', {name: 'Step 1'});
  expect(stepTitle).toBeVisible();
  // formio...
  await waitFor(async () => {
    expect(await screen.findByLabelText('Component 1')).toBeVisible();
  });
});

test('Navigation through form without introduction page', async () => {
  const user = userEvent.setup();
  mswServer.use(mockSubmissionPost(), mockAnalyticsToolConfigGet(), mockSubmissionStepGet());
  const form = buildForm({
    introductionPageContent: '',
    loginRequired: false,
  });

  // initial render should display the introduction page
  render(<Wrapper form={form} initialEntry="" />);

  const startButton = await screen.findByRole('button', {name: 'Begin'});
  expect(startButton).toBeVisible();

  // clicking the start button starts the submission and navigates to step 1
  await user.click(startButton);
  const stepTitle = await screen.findByRole('heading', {name: 'Step 1'});
  expect(stepTitle).toBeVisible();
  // formio...
  await waitFor(async () => {
    expect(await screen.findByLabelText('Component 1')).toBeVisible();
  });
});

test('Submitting the form with failing background processing', async () => {
  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
  });
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
  mswServer.use(
    mockAnalyticsToolConfigGet(),
    mockSubmissionGet(submission),
    mockSubmissionSummaryGet(),
    mockSubmissionCompletePost(),
    mockSubmissionProcessingStatusErrorGet
  );

  render(<Wrapper form={form} initialEntry={`/overzicht?submission_uuid=${submission.id}`} />);

  expect(await screen.findByRole('heading', {name: 'Check and confirm'})).toBeVisible();

  // confirm the submission and complete it
  vi.useFakeTimers();
  await user.click(screen.getByRole('button', {name: 'Confirm'}));
  expect(await screen.findByRole('heading', {name: 'Processing...'})).toBeVisible();
  const loader = await screen.findByRole('status');
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  await waitForElementToBeRemoved(loader);

  // due to the error we get redirected back to the summary page.
  expect(await screen.findByRole('heading', {name: 'Check and confirm'})).toBeVisible();
  expect(screen.getByText('Computer says no.')).toBeVisible();
});

test('Submitting the form with successful background processing', async () => {
  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
  });
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
  mswServer.use(
    mockAnalyticsToolConfigGet(),
    mockSubmissionGet(submission),
    mockSubmissionSummaryGet(),
    mockSubmissionCompletePost(),
    mockSubmissionProcessingStatusGet
  );

  render(<Wrapper form={form} initialEntry={`/overzicht?submission_uuid=${submission.id}`} />);

  expect(await screen.findByRole('heading', {name: 'Check and confirm'})).toBeVisible();

  // confirm the submission and complete it
  vi.useFakeTimers();
  await user.click(await screen.findByRole('button', {name: 'Confirm'}));
  expect(await screen.findByRole('heading', {name: 'Processing...'})).toBeVisible();
  const loader = await screen.findByRole('status');
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  await waitForElementToBeRemoved(loader);

  // on success, the summary page must display the reference obtained from the backend
  expect(await screen.findByRole('heading', {name: 'Confirmation: OF-L337'})).toBeVisible();
});

test('Submitting form with payment requirement', async () => {
  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
  });
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
  mswServer.use(
    mockAnalyticsToolConfigGet(),
    mockSubmissionGet(submission),
    mockSubmissionSummaryGet(),
    mockSubmissionCompletePost(),
    mockSubmissionProcessingStatusGet,
    mockSubmissionPaymentStartPost(undefined)
  );

  render(<Wrapper form={form} initialEntry={`/overzicht?submission_uuid=${submission.id}`} />);
  expect(await screen.findByRole('heading', {name: 'Check and confirm'})).toBeVisible();

  // confirm the submission and complete it
  vi.useFakeTimers();
  await user.click(screen.getByRole('button', {name: 'Confirm'}));
  expect(await screen.findByRole('heading', {name: 'Processing...'})).toBeVisible();
  const loader = await screen.findByRole('status');
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  await waitForElementToBeRemoved(loader);

  expect(await screen.findByText('A payment is required for this product.')).toBeVisible();
});
