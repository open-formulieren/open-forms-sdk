import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messagesEN from 'i18n/compiled/en.json';
import messagesNL from 'i18n/compiled/nl.json';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {IntlProvider} from 'react-intl';
import {MemoryRouter, RouterProvider, createMemoryRouter} from 'react-router-dom';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {buildSubmission, mockSubmissionPost} from 'api-mocks/submissions';
import App, {routes as nestedRoutes} from 'components/App';

import ProgressIndicator from '.';
import {addFixedSteps, getStepsInfo} from './utils';

let container = null;
let root = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  sessionStorage.clear();
});

afterEach(() => {
  // cleanup on exiting
  act(() => {
    root.unmount();
    container.remove();
    root = null;
    container = null;
    sessionStorage.clear();
  });
});

const submissionDefaults = {
  id: 'some-id',
  url: 'https://some-url',
  form: 'https://some-form',
  steps: [
    {
      uuid: 'd6cab0dd',
      slug: 'first-step',
      to: 'first-step',
      formDefinition: 'Stap 1',
      isCompleted: false,
      isApplicable: true,
      isCurrent: false,
      canNavigateTo: true,
    },
  ],
  payment: {
    isRequired: false,
    amount: '',
    hasPaid: false,
  },
};

let steps = [
  {
    uuid: 'd6cab0dd',
    slug: 'first-step',
    to: 'first-step',
    formDefinition: 'Stap 1',
    isCompleted: false,
    isApplicable: true,
    isCurrent: false,
    canNavigateTo: true,
  },
];

const routes = [
  {
    path: '*',
    element: <App />,
    children: nestedRoutes,
  },
];

const renderApp = (initialRoute = '/') => {
  const form = buildForm({});
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

describe('Form', () => {
  it('renders the form and checks the expected steps', async () => {
    const user = userEvent.setup({delay: null});

    mswServer.use(mockSubmissionPost(buildSubmission()));
    // initially render the app
    renderApp();

    // wait for submission to be created and recorded in the local storage
    await waitFor(() => {
      const submission = sessionStorage.getItem('submission');
      expect(submission).not.toBe('null');
    });

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
});

describe('Progress Indicator component', () => {
  it('component renders expected steps', () => {
    steps = getStepsInfo(steps, submissionDefaults, 'https://some-form/startpagina');
    const updatedSteps = addFixedSteps(
      steps,
      submissionDefaults,
      'https://some-form/startpagina',
      true,
      true
    );

    act(() => {
      root.render(
        <MemoryRouter initialEntries={['/']}>
          <IntlProvider locale="nl" messages={messagesNL}>
            <ProgressIndicator
              progressIndicatorTitle="Progress"
              formTitle="Test Name"
              steps={updatedSteps}
              ariaMobileIconLabel="test aria mobile"
              accessibleToggleStepsLabel="test mobile"
            />
          </IntlProvider>
        </MemoryRouter>
      );
    });

    const progressIndicatorSteps = container.getElementsByTagName('ol')[0];
    expect(progressIndicatorSteps.textContent).toContain('Startpagina');
    expect(progressIndicatorSteps.textContent).toContain('Stap 1');
    expect(progressIndicatorSteps.textContent).toContain('Overzicht');
    expect(progressIndicatorSteps.textContent).toContain('Bevestiging');
  });
});
