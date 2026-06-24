import {NuqsAdapter} from 'nuqs/adapters/react-router/v7';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {afterEach, beforeEach, expect, test} from 'vitest';
import {render} from 'vitest-browser-react';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm} from '@/api-mocks';
import mswWorker from '@/api-mocks/msw-worker';
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
      visible: true,
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
      visible: true,
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
        showFormTitle: true,
        clientBaseUrl: 'http://localhost/',
        basePath: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
        debug: false,
      }}
    >
      <IntlProvider locale="en" messages={messagesEN}>
        <FormContext.Provider value={TEST_FORM}>
          <NuqsAdapter>
            <RouterProvider router={router} />
          </NuqsAdapter>
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

test('Cosign start route renders start/login page', async () => {
  const screen = await render(<Wrapper relativeUrl="start" />);

  await expect.element(screen.getByRole('link', {name: 'Login with DigiD Cosign'})).toBeVisible();
});

test('Load submission summary after backend authentication', async () => {
  mswWorker.use(mockSubmissionGet(), mockSubmissionSummaryGet());

  // the submission ID is taken from the query params
  const screen = await render(
    <Wrapper relativeUrl="check?submission_uuid=458b29ae-5baa-4132-a0d7-8c7071b8152a" />
  );

  await expect
    .element(screen.getByRole('heading', {name: 'Check and co-sign submission', level: 1}))
    .toBeVisible();
  // wait for summary to load from the backend
  await expect.element(screen.getByText('Component 1 value')).toBeVisible();
});
