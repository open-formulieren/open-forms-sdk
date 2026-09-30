import {NuqsTestingAdapter} from 'nuqs/adapters/testing';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {afterEach, beforeEach, expect, test} from 'vitest';
import {render} from 'vitest-browser-react';
import {userEvent} from 'vitest/browser';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm, mockAnalyticsToolConfigGet} from '@/api-mocks';
import {FORM_DEFAULTS} from '@/api-mocks/forms';
import mswWorker from '@/api-mocks/msw-worker';
import {
  buildSubmission,
  buildSubmissionStep,
  mockSubmissionCheckLogicPost,
  mockSubmissionGet,
  mockSubmissionPost,
  mockSubmissionStepGet,
} from '@/api-mocks/submissions';
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
        showFormTitle: true,
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

// gh-6718 regression
test('form field value assignment through logic resets validation errors', async () => {
  const formData = buildForm({
    steps: [
      {
        uuid: '9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5',
        slug: 'step-1',
        formDefinition: 'Step 1',
        index: 0,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
      },
    ],
  });
  const submissionStep = buildSubmissionStep({
    components: [
      {
        id: 'checkbox',
        type: 'checkbox',
        key: 'checkbox',
        label: 'Trigger',
      },
      {
        id: 'textfield',
        type: 'textfield',
        key: 'textfield',
        label: 'Textfield (required)',
        validate: {required: true},
      },
    ],
    formStepUuid: '9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5',
    requireBackendLogicEvaluation: false,
    logicRules: [
      {
        jsonLogicTrigger: {var: 'checkbox'},
        actions: [
          {
            action: {type: 'variable', value: 'set via logic'},
            variable: 'textfield',
          },
        ],
      },
    ],
  });
  mswWorker.use(
    mockAnalyticsToolConfigGet(),
    mockSubmissionPost(
      buildSubmission({
        steps: [
          {
            id: '6ca342af-86c7-451c-a19f-65050b2eee5c',
            name: 'Step 1',
            url: `${BASE_URL}submissions/458b29ae-5baa-4132-a0d7-8c7071b8152a/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
            formStep: `${BASE_URL}forms/mock/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
            defaultIsApplicable: true,
            isApplicable: true,
            completed: false,
            canSubmit: true,
          },
        ],
      })
    ),
    mockSubmissionStepGet(submissionStep)
  );

  const screen = await render(<Wrap form={formData} />);
  await screen.getByRole('button', {name: 'Begin'}).click();
  await expect.element(screen.getByRole('heading', {name: 'Step 1'})).toBeVisible();
  await screen.getByLabelText('Textfield (required)').click();
  await userEvent.keyboard('{Tab}');
  const errorMessage = 'The required field Textfield (required) must be filled in.';
  await expect.element(screen.getByText(errorMessage)).toBeVisible();

  // clicking the checkbox triggers the logic rule
  await screen.getByLabelText('Trigger').click();
  await expect
    .element(screen.getByLabelText('Textfield (required)'))
    .toHaveDisplayValue('set via logic');
  await expect.element(screen.getByText(errorMessage), {timeout: 2000}).not.toBeInTheDocument();
});

// gh-6718 regression
test('form field value assignment from backend logic resets validation errors', async () => {
  const formData = buildForm({
    steps: [
      {
        uuid: '9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5',
        slug: 'step-1',
        formDefinition: 'Step 1',
        index: 0,
        literals: {
          previousText: {resolved: 'Previous', value: ''},
          saveText: {resolved: 'Save', value: ''},
          nextText: {resolved: 'Next', value: ''},
        },
        url: `${BASE_URL}forms/mock/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
      },
    ],
  });
  const submission = buildSubmission({
    steps: [
      {
        id: '6ca342af-86c7-451c-a19f-65050b2eee5c',
        name: 'Step 1',
        url: `${BASE_URL}submissions/458b29ae-5baa-4132-a0d7-8c7071b8152a/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
        formStep: `${BASE_URL}forms/mock/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
        defaultIsApplicable: true,
        isApplicable: true,
        completed: false,
        canSubmit: true,
      },
    ],
  });
  const submissionStep = buildSubmissionStep({
    components: [
      {
        id: 'checkbox',
        type: 'checkbox',
        key: 'checkbox',
        label: 'Trigger',
      },
      {
        id: 'textfield',
        type: 'textfield',
        key: 'textfield',
        label: 'Textfield (required)',
        validate: {required: true},
      },
    ],
    formStepUuid: '9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5',
    requireBackendLogicEvaluation: true,
    logicRules: [],
  });

  mswWorker.use(
    mockAnalyticsToolConfigGet(),
    mockSubmissionPost(submission),
    mockSubmissionGet(submission),
    mockSubmissionStepGet(submissionStep),
    mockSubmissionCheckLogicPost(
      submission,
      {
        ...submissionStep,
        data: {textfield: 'set via backend logic'},
      },
      500
    )
  );

  const screen = await render(<Wrap form={formData} />);
  await screen.getByRole('button', {name: 'Begin'}).click();
  await expect.element(screen.getByRole('heading', {name: 'Step 1'})).toBeVisible();
  await screen.getByLabelText('Textfield (required)').click();
  await userEvent.keyboard('{Tab}');
  const errorMessage = 'The required field Textfield (required) must be filled in.';
  await expect.element(screen.getByText(errorMessage)).toBeVisible();

  // clicking the checkbox triggers the logic check
  await screen.getByLabelText('Trigger').click();
  await expect
    .element(screen.getByLabelText('Textfield (required)'))
    .toHaveDisplayValue('set via backend logic');
  await expect.element(screen.getByText(errorMessage), {timeout: 2000}).not.toBeInTheDocument();

  // another logic check is fired off, which puts the loader in the screen, which will be
  // removed once the logic check resolves
  await expect.element(screen.getByRole('status')).toBeVisible();
  await expect
    .element(screen.getByRole('button', {name: 'Next'}))
    .not.toHaveAttribute('aria-disabled', 'true');
});
