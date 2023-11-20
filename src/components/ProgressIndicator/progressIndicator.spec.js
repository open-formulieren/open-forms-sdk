import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {buildSubmission, mockSubmissionPost} from 'api-mocks/submissions';
import App, {routes as nestedRoutes} from 'components/App';

const routes = [
  {
    path: '*',
    element: <App />,
    children: nestedRoutes,
  },
];

const renderApp = (initialRoute = '/') => {
  const form = buildForm();
  const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
    initialIndex: [0],
  });
  render(
    <ConfigContext.Provider
      value={{
        baseUrl: BASE_URL,
        clientBaseUrl: 'http://localhost/',
        basePath: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
        displayComponents: {},
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
});

afterEach(() => {
  sessionStorage.clear();
});

it('renders the form and checks the expected steps', async () => {
  mswServer.use(mockSubmissionPost(buildSubmission()));
  const user = userEvent.setup({delay: null});

  renderApp();

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
  const confirmationPageItem = await screen.findByText('Confirmation');
  expect(confirmationPageItem).toBeVisible();
});

it('component renders expected steps', async () => {
  mswServer.use(mockSubmissionPost(buildSubmission()));
  const user = userEvent.setup({delay: null});

  renderApp();

  const startFormLink = await screen.findByRole('link', {name: 'Start page'});
  user.click(startFormLink);

  const progressIndicatorSteps = await screen.getAllByRole('listitem');

  expect(progressIndicatorSteps[0]).toHaveTextContent('Start page');
  expect(progressIndicatorSteps[1]).toHaveTextContent('Step 1');
  expect(progressIndicatorSteps[2]).toHaveTextContent('Summary');
  expect(progressIndicatorSteps[3]).toHaveTextContent('Confirmation');
});