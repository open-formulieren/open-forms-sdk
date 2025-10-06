import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm, mockAnalyticsToolConfigGet} from '@/api-mocks';
import mswServer from '@/api-mocks/msw-server';
import {buildSubmission, mockSubmissionPost} from '@/api-mocks/submissions';
import type {Form} from '@/data/forms';
import messagesEN from '@/i18n/compiled/en.json';
import routes, {FUTURE_FLAGS} from '@/routes';

const renderApp = (form: Form, initialRoute: string = '/') => {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
    initialIndex: 0,
    future: FUTURE_FLAGS,
  });
  render(
    <ConfigContext.Provider
      value={{
        baseUrl: BASE_URL,
        clientBaseUrl: 'http://localhost/',
        basePath: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
        debug: false,
        backToTopText: '',
        backToTopRef: '',
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

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

describe('The progress indicator component', () => {
  it('displays the available submission/form steps and hardcoded steps (without payment)', async () => {
    mswServer.use(mockSubmissionPost(buildSubmission()), mockAnalyticsToolConfigGet());
    const user = userEvent.setup({delay: null});
    const form = buildForm();

    renderApp(form);

    const startFormLink = await screen.findByRole('link', {name: 'Start page'});
    user.click(startFormLink);

    const progressIndicator = await screen.findByText('Progress');
    expect(progressIndicator).toBeVisible();

    const startPageItem = await screen.findByText('Start page');
    expect(startPageItem).toBeVisible();
    const stepPageItem = await screen.findByText('Step 1');
    expect(stepPageItem).toBeVisible();
    const summaryPageItem = await screen.findByText('Summary');
    expect(summaryPageItem).toBeVisible();
  });

  it('displays the available submission/form steps and hardcoded steps (with payment)', async () => {
    mswServer.use(mockSubmissionPost(buildSubmission()), mockAnalyticsToolConfigGet());
    const user = userEvent.setup({delay: null});
    const form = buildForm({paymentRequired: true});

    renderApp(form);

    const startFormLink = await screen.findByRole('link', {name: 'Start page'});
    await user.click(startFormLink);

    const progressIndicator = await screen.findByText('Progress');
    expect(progressIndicator).toBeVisible();

    const startPageItem = await screen.findByText('Start page');
    expect(startPageItem).toBeVisible();
    const stepPageItem = await screen.findByText('Step 1');
    expect(stepPageItem).toBeVisible();
    const summaryPageItem = await screen.findByText('Summary');
    expect(summaryPageItem).toBeVisible();
    const paymentPageItem = await screen.findByText('Payment');
    expect(paymentPageItem).toBeVisible();
  });

  it('renders steps in the correct order', async () => {
    mswServer.use(mockSubmissionPost(buildSubmission()), mockAnalyticsToolConfigGet());
    const user = userEvent.setup({delay: null});
    const form = buildForm();

    renderApp(form);

    const startFormLink = await screen.findByRole('link', {name: 'Start page'});
    await user.click(startFormLink);

    const progressIndicatorSteps = screen.getAllByRole('listitem');

    expect(progressIndicatorSteps[0]).toHaveTextContent('Start page');
    expect(progressIndicatorSteps[1]).toHaveTextContent('Step 1');
    expect(progressIndicatorSteps[2]).toHaveTextContent('Summary');
  });
});
