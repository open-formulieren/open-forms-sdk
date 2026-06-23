import {NuqsTestingAdapter} from 'nuqs/adapters/testing';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {afterEach, beforeEach, expect, test} from 'vitest';
import {render} from 'vitest-browser-react';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm, mockAnalyticsToolConfigGet} from '@/api-mocks';
import {FORM_DEFAULTS} from '@/api-mocks/forms';
import mswWorker from '@/api-mocks/msw-worker';
import {mockSubmissionPost, mockSubmissionStepGet} from '@/api-mocks/submissions';
import FormDisplay from '@/components/FormDisplay';
import type {Form} from '@/data/forms';
import messagesEN from '@/i18n/compiled/en.json';
import routes, {FUTURE_FLAGS} from '@/routes';

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  sessionStorage.clear();
});

const FORM_DATA = buildForm(FORM_DEFAULTS);

interface WrapperProps {
  form: Form;
  currentUrl?: string;
  searchParams?: string;
}

const Wrap: React.FC<WrapperProps> = ({form, currentUrl = '/startpagina', searchParams = ''}) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [currentUrl],
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
      }}
    >
      <IntlProvider locale="en" messages={messagesEN}>
        <FormContext.Provider value={form}>
          <FormDisplay progressIndicator={false}>
            <NuqsTestingAdapter searchParams={searchParams}>
              <RouterProvider router={router} />
            </NuqsTestingAdapter>
          </FormDisplay>
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

test('Navigating to form step shows step name in browser window title', async () => {
  mswWorker.use(mockAnalyticsToolConfigGet(), mockSubmissionPost(), mockSubmissionStepGet());

  const screen = await render(<Wrap form={FORM_DATA} />);

  await screen.getByRole('button', {name: 'Begin'}).click();
  await expect.element(screen.getByRole('heading', {name: 'Step 1'})).toBeVisible();

  await expect.poll(() => document.title).toBe('Step 1 | Mock form');
});
