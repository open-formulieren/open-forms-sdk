import {NuqsAdapter} from 'nuqs/adapters/react-router/v7';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {afterEach, beforeEach, describe, expect, test} from 'vitest';
import {render} from 'vitest-browser-react';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm, mockAnalyticsToolConfigGet} from '@/api-mocks';
import mswWorker from '@/api-mocks/msw-worker';
import {buildSubmission, mockSubmissionPost} from '@/api-mocks/submissions';
import type {Form} from '@/data/forms';
import messagesEN from '@/i18n/compiled/en.json';
import routes, {FUTURE_FLAGS} from '@/routes';

const renderApp = async (form: Form, initialRoute: string = '/') => {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
    initialIndex: 0,
    future: FUTURE_FLAGS,
  });
  return await render(
    <ConfigContext.Provider
      value={{
        baseUrl: BASE_URL,
        clientBaseUrl: 'http://localhost/',
        basePath: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
        debug: false,
      }}
    >
      <IntlProvider locale="en" messages={messagesEN}>
        <FormContext.Provider value={form}>
          <NuqsAdapter>
            <RouterProvider router={router} />
          </NuqsAdapter>
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
  test('displays the available submission/form steps and hardcoded steps (without payment)', async () => {
    mswWorker.use(mockSubmissionPost(buildSubmission()), mockAnalyticsToolConfigGet());
    const form = buildForm();

    const screen = await renderApp(form);

    const startFormLink = screen.getByRole('link', {name: 'Start page'});
    await startFormLink.click();

    const progressIndicator = screen.getByText('Progress');
    await expect.element(progressIndicator).toBeVisible();

    const startPageItem = screen.getByText('Start page');
    await expect.element(startPageItem).toBeVisible();
    const stepPageItem = screen.getByText('Step 1');
    await expect.element(stepPageItem).toBeVisible();
    const summaryPageItem = screen.getByText('Summary');
    await expect.element(summaryPageItem).toBeVisible();
  });

  test('displays the available submission/form steps and hardcoded steps (with payment)', async () => {
    mswWorker.use(mockSubmissionPost(buildSubmission()), mockAnalyticsToolConfigGet());
    const form = buildForm({paymentRequired: true});

    const screen = await renderApp(form);

    const startFormLink = screen.getByRole('link', {name: 'Start page'});
    await startFormLink.click();

    const progressIndicator = screen.getByText('Progress');
    await expect.element(progressIndicator).toBeVisible();

    const startPageItem = screen.getByText('Start page');
    await expect.element(startPageItem).toBeVisible();
    const stepPageItem = screen.getByText('Step 1');
    await expect.element(stepPageItem).toBeVisible();
    const summaryPageItem = screen.getByText('Summary');
    await expect.element(summaryPageItem).toBeVisible();
    const paymentPageItem = screen.getByText('Payment');
    await expect.element(paymentPageItem).toBeVisible();
  });

  test('renders steps in the correct order', async () => {
    mswWorker.use(mockSubmissionPost(buildSubmission()), mockAnalyticsToolConfigGet());
    const form = buildForm();

    const screen = await renderApp(form);

    const startFormLink = screen.getByRole('link', {name: 'Start page'});
    await startFormLink.click();

    const progressIndicatorSteps = screen.getByRole('listitem').all();

    await expect.element(progressIndicatorSteps[0]).toHaveTextContent('Start page');
    await expect.element(progressIndicatorSteps[1]).toHaveTextContent('Step 1');
    await expect.element(progressIndicatorSteps[2]).toHaveTextContent('Step 2');
    await expect.element(progressIndicatorSteps[3]).toHaveTextContent('Summary');
  });
});
