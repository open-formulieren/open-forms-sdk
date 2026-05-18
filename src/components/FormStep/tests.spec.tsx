import {NuqsTestingAdapter} from 'nuqs/adapters/testing';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {afterEach, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm, mockAnalyticsToolConfigGet} from '@/api-mocks';
import {SINGLE_STEP_FORM_DEFAULTS, mockFormGet, mockFormStepGet} from '@/api-mocks/forms';
import mswWorker from '@/api-mocks/msw-worker';
import {
  SINGLE_STEP_SUBMISSION_DETAILS,
  SINGLE_STEP_SUBMISSION_STEP_DETAILS,
  buildSubmission,
  mockSubmissionCompletePost,
  mockSubmissionPost,
  mockSubmissionProcessingStatusGet,
  mockSubmissionStepPut,
} from '@/api-mocks/submissions';
import FormDisplay from '@/components/FormDisplay';
import type {Form} from '@/data/forms';
import messagesEN from '@/i18n/compiled/en.json';
import routes, {FUTURE_FLAGS} from '@/routes';

afterEach(() => {
  vi.clearAllMocks();
});

const FORM_DATA = buildForm(SINGLE_STEP_FORM_DEFAULTS);

interface WrapperProps {
  form: Form;
  currentUrl?: string;
  searchParams?: string;
}

const Wrap: React.FC<WrapperProps> = ({form, currentUrl = '/sp', searchParams = ''}) => {
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

test('Single step form happy flow', async () => {
  mswWorker.use(
    mockFormGet(FORM_DATA),
    mockAnalyticsToolConfigGet(),
    mockFormStepGet(),
    mockSubmissionPost(buildSubmission(SINGLE_STEP_SUBMISSION_DETAILS)),
    mockSubmissionStepPut(SINGLE_STEP_SUBMISSION_STEP_DETAILS, 201),
    mockSubmissionCompletePost(SINGLE_STEP_SUBMISSION_DETAILS.id),
    mockSubmissionProcessingStatusGet
  );

  const screen = await render(<Wrap form={FORM_DATA} />);

  const statementCheckbox = screen.getByRole('checkbox');

  await expect.element(statementCheckbox).toBeVisible();
  await statementCheckbox.click();
  await expect.element(statementCheckbox).toBeChecked();

  const nextButton = screen.getByRole('button', {name: 'Next'});

  await expect.element(nextButton).toBeEnabled();
  await nextButton.click();
  await expect.element(screen.getByText(/Confirmation/)).toBeVisible();
});

test('Single step form with missing statement checkbox', async () => {
  mswWorker.use(mockFormGet(FORM_DATA), mockAnalyticsToolConfigGet(), mockFormStepGet());

  const screen = await render(<Wrap form={FORM_DATA} />);

  const statementCheckbox = screen.getByRole('checkbox');

  await expect.element(statementCheckbox).toBeVisible();
  await expect.element(statementCheckbox).not.toBeChecked();

  const nextButton = screen.getByRole('button', {name: 'Next'});
  await expect.element(nextButton).toBeDisabled();
});
