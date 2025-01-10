import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm, mockAnalyticsToolConfigGet} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {mockSubmissionPost, mockSubmissionStepGet} from 'api-mocks/submissions';
import {routes} from 'components/App';

window.scrollTo = vi.fn();

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

afterAll(() => {
  vi.clearAllMocks();
});

const Wrapper = ({form = buildForm(), initialEntry = '/startpagina'}) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialEntry],
    initialIndex: 0,
  });

  return (
    <ConfigContext.Provider
      value={{
        baseUrl: BASE_URL,
        clientBaseUrl: 'http://localhost/',
        basePath: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
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
          loginOptions: [{identifier: 'digid', label: 'DigiD', url: 'http://mock-digid.nl/login'}],
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
  const formInput = await screen.findByLabelText('Component 1');
  expect(formInput).toBeVisible();
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
  const formInput = await screen.findByLabelText('Component 1');
  expect(formInput).toBeVisible();
});
