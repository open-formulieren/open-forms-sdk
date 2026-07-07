import {NuqsTestingAdapter} from 'nuqs/adapters/testing';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {afterEach, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm, buildSubmission} from '@/api-mocks';
import SubmissionProvider from '@/components/SubmissionProvider';
import type {Form} from '@/data/forms';
import messagesEN from '@/i18n/compiled/en.json';
import {FUTURE_FLAGS} from '@/routes';

import HelpCalloutPage from './index';

const DEFAULT_CONTENT = `
  <h2>Hulp nodig?</h2>

  <p>Heeft u hulp nodig? Klik op de mooie knop hierboven!</p>
`;

afterEach(() => {
  vi.clearAllMocks();
});

interface WrapperProps {
  form?: Form;
  searchParams?: string;
}

const Wrap: React.FC<WrapperProps> = ({form = buildForm(), searchParams = ''}) => {
  const submission = buildSubmission();
  const routes = [
    {path: '/startpagina', element: <h1>Start page</h1>},
    {path: '/hulp', element: <HelpCalloutPage />},
    {path: '/stap/:slug', element: <h1>Step page</h1>},
  ];
  const router = createMemoryRouter(routes, {initialEntries: ['/hulp'], future: FUTURE_FLAGS});
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
          <SubmissionProvider
            submission={submission}
            onSubmissionObtained={() => {}}
            onDestroySession={async () => {}}
            removeSubmissionId={() => {}}
          >
            <NuqsTestingAdapter searchParams={searchParams}>
              <RouterProvider router={router} />
            </NuqsTestingAdapter>
          </SubmissionProvider>
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

test('Before start page', async () => {
  const form = buildForm({
    helpCalloutPageDisplay: 'before_start_page',
    helpCalloutPageContent: DEFAULT_CONTENT,
  });

  const screen = await render(<Wrap form={form} />);
  const continueButton = screen.getByRole('link', {name: 'Continue'});
  await expect.element(continueButton).toHaveAttribute('href', `/startpagina`);
});

test('Before start page with query param', async () => {
  const form = buildForm({
    helpCalloutPageDisplay: 'before_start_page',
    helpCalloutPageContent: DEFAULT_CONTENT,
  });

  const screen = await render(<Wrap searchParams="?initial_data_reference=foo" form={form} />);
  const continueButton = screen.getByRole('link', {name: 'Continue'});
  await expect
    .element(continueButton)
    .toHaveAttribute('href', `/startpagina?initial_data_reference=foo`);
});

test('After start page', async () => {
  const form = buildForm({
    helpCalloutPageDisplay: 'after_start_page',
    helpCalloutPageContent: DEFAULT_CONTENT,
  });

  const screen = await render(<Wrap form={form} />);
  const continueButton = screen.getByRole('link', {name: 'Continue'});
  await expect.element(continueButton).toHaveAttribute('href', `/stap/${form.steps[0].slug}`);
});

test('No content configured', async () => {
  const form = buildForm({
    helpCalloutPageDisplay: 'after_start_page',
    helpCalloutPageContent: '',
  });

  const screen = await render(<Wrap form={form} />);
  expect(screen.getByText('Start page')).toBeVisible();
});

test('Callout page should not be displayed', async () => {
  const form = buildForm({
    helpCalloutPageDisplay: 'never',
    helpCalloutPageContent: DEFAULT_CONTENT,
  });

  const screen = await render(<Wrap form={form} />);
  expect(screen.getByText('Start page')).toBeVisible();
});
