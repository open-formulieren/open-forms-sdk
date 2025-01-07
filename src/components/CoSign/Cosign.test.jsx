import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {mockSubmissionPost, mockSubmissionStepGet} from 'api-mocks/submissions';

import Cosign from './Cosign';
import {default as nestedRoutes} from './routes';

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
    children: nestedRoutes,
  },
];

const Wrapper = () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/cosign/start'],
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
        <FormContext.Provider value={TEST_FORM}>
          <RouterProvider router={router} />
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

test('Cosign start route renders start/login page', async () => {
  render(<Wrapper />);

  expect(await screen.findByRole('link', {name: 'Login with DigiD Cosign'})).toBeVisible();
});
