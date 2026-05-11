import {HttpResponse, http} from 'msw';
import {NuqsTestingAdapter} from 'nuqs/adapters/testing';
import {useState} from 'react';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {afterEach, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm} from '@/api-mocks';
import {mockAnalyticsToolConfigGet} from '@/api-mocks';
import {SINGLE_STEP_FORM_DEFAULTS} from '@/api-mocks/forms';
import {mockFormGet, mockFormStepGet} from '@/api-mocks/forms';
import mswWorker from '@/api-mocks/msw-worker';
import FormDisplay from '@/components/FormDisplay';
import AnalyticsToolsConfigProvider from '@/components/analytics/AnalyticsToolConfigProvider';
import type {Form} from '@/data/forms';
import type {Submission} from '@/data/submissions';
import messagesEN from '@/i18n/compiled/en.json';
import {FUTURE_FLAGS} from '@/routes';

import SingleFormStepNewRenderer from './SingleFormStepNewRenderer';

afterEach(() => {
  vi.clearAllMocks();
});

const FORM = buildForm(SINGLE_STEP_FORM_DEFAULTS);
mswWorker.use(mockAnalyticsToolConfigGet(), mockFormGet(FORM), mockFormStepGet());

interface WrapperProps {
  form?: Form;
  currentUrl?: string;
  initialSubmission?: Submission | null;
  searchParams?: string;
}

const Wrap: React.FC<WrapperProps> = ({
  form = FORM,
  currentUrl = '/sp',
  initialSubmission = null,
  searchParams = '',
}) => {
  const routes = [
    // {path: '', element: <SingleStepForm />},
    {path: '/sp', element: <SingleFormStepNewRenderer />},
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: [currentUrl],
    future: FUTURE_FLAGS,
  });
  const [submission, setSubmission] = useState(initialSubmission);

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
            <AnalyticsToolsConfigProvider>
              <NuqsTestingAdapter searchParams={searchParams}>
                <RouterProvider router={router} />
              </NuqsTestingAdapter>
            </AnalyticsToolsConfigProvider>
          </FormDisplay>
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

test('Start single step form', async () => {
  http.all('*', ({request}) => {
    console.log('REQUEST:', request.method, request.url);
    return HttpResponse.json({});
  });
  let startSingleStepFormRequest: Request | undefined;

  mswWorker.events.on('request:match', async ({request}) => {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname.endsWith('/api/v2/forms')) {
      startSingleStepFormRequest = request;
    }
  });
  // // form with only anonymous login option
  const form = buildForm(SINGLE_STEP_FORM_DEFAULTS);
  const screen = await render(<Wrap />);
  // const nextButton = screen.getByRole('button', {name: 'Next'});
  // await nextButton.click();
  // await expect.poll(() => startSingleStepFormRequest).not.toBeUndefined();
  // const requestBody = await startSingleStepFormRequest!.json();
  // expect(requestBody.anonymous).toBe(true);
});
