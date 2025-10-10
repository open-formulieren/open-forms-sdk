import {render, screen} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm} from '@/api-mocks';
import mswServer from '@/api-mocks/msw-server';
import {mockSubmissionGet, mockSubmissionSummaryGet} from '@/api-mocks/submissions';
import messagesEN from '@/i18n/compiled/en.json';
import {FUTURE_FLAGS} from '@/routes';
import cosignRoutes from '@/routes/cosign';

import Cosign from './Cosign';

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  sessionStorage.clear();
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
    path: '/cosign',
    children: [
      {
        path: '*',
        element: <Cosign />,
        children: cosignRoutes,
      },
    ],
  },
];

interface WrapperProps {
  relativeUrl: string;
}

const Wrapper: React.FC<WrapperProps> = ({relativeUrl}) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [`/cosign/${relativeUrl}`],
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
        backToTopText: '',
        backToTopRef: '',
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
  await screen.findByText('Component 1 value');
});
