import {render, screen} from '@testing-library/react';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {mockSubmissionGet, mockSubmissionSummaryGet} from 'api-mocks/submissions';
import cosignRoutes from 'routes/cosign';

import Cosign from './Cosign';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

const TEST_FORM = buildForm({
  loginOptions: [
    {
      identifier: 'digid',
      label: 'DigiD',
      url: '#',
      logo: {
        title: 'DigiD simulatie',
        imageSrc: './digid.png',
        href: 'https://www.digid.nl/',
        appearance: 'dark',
      },
      isForGemachtigde: false,
    },
  ],
  cosignLoginOptions: [
    {
      identifier: 'digid',
      label: 'DigiD Cosign',
      url: 'http://localhost:8000/auth/digid/?next=http://localhost:8000/cosign&amp;code=123',
      logo: {
        title: 'DigiD simulatie',
        imageSrc: './digid.png',
        href: 'https://www.digid.nl/',
        appearance: 'dark',
      },
      isForGemachtigde: false,
    },
  ],
  loginRequired: true,
});

const routes = [
  {
    path: '/cosign/*',
    element: <Cosign />,
    children: cosignRoutes,
  },
];

const Wrapper = ({relativeUrl}) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [`/cosign/${relativeUrl}`],
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
        <FormContext.Provider value={TEST_FORM}>
          <RouterProvider router={router} />
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

test('Cosign start route renders start/login page', async () => {
  render(<Wrapper relativeUrl="start" />);

  expect(await screen.findByRole('link', {name: 'Login with DigiD Cosign'})).toBeVisible();
});

test('Load submission summary after backend authentication', async () => {
  mswServer.use(mockSubmissionGet(), mockSubmissionSummaryGet());

  // the submission ID is taken from the query params
  render(<Wrapper relativeUrl="check?submission_uuid=458b29ae-5baa-4132-a0d7-8c7071b8152a" />);

  await screen.findByRole('heading', {name: 'Check and co-sign submission', level: 1});
  // wait for summary to load from the backend
  await screen.findByText('Compnent 1 value');
});
