import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messagesEN from 'i18n/compiled/en.json';
import {useState} from 'react';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm, buildSubmission} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {mockSubmissionPost} from 'api-mocks/submissions';
import SubmissionProvider from 'components/SubmissionProvider';
import {FUTURE_FLAGS} from 'routes';

import FormStart from './index';

let scrollIntoViewMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

afterAll(() => {
  vi.clearAllMocks();
});

const Wrap = ({
  form = buildForm(),
  currentUrl = '/startpagina',
  initialSubmission = null,
  onSubmissionObtained = undefined,
}) => {
  const parsedUrl = new URL(currentUrl, 'http://dummy');
  const routes = [
    {path: parsedUrl.pathname, element: <FormStart />},
    {path: '/stap/:slug', element: <h1>Step page</h1>},
  ];
  const router = createMemoryRouter(routes, {initialEntries: [currentUrl], future: FUTURE_FLAGS});
  const [submission, setSubmission] = useState(initialSubmission);
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
          <SubmissionProvider
            submission={submission}
            onSubmissionObtained={submission => {
              setSubmission(submission);
              onSubmissionObtained?.();
            }}
            onDestroySession={() => {}}
            removeSubmissionId={vi.fn()}
          >
            <RouterProvider router={router} />
          </SubmissionProvider>
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

test('Start form without having logged in', async () => {
  const user = userEvent.setup();
  mswServer.use(mockSubmissionPost());
  let startSubmissionRequest;
  mswServer.events.on('request:match', async ({request}) => {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname.endsWith('/api/v2/submissions')) {
      startSubmissionRequest = request;
    }
  });
  // form with only anonymous login option
  const form = buildForm({loginOptions: [], loginRequired: false});

  render(<Wrap form={form} />);

  const startButton = screen.getByRole('button', {name: 'Begin'});
  await user.click(startButton);

  expect(startSubmissionRequest).not.toBeUndefined();
  const requestBody = await startSubmissionRequest.json();
  expect(requestBody.anonymous).toBe(true);
});

test('Start form with having logged in', async () => {
  const form = buildForm({
    loginOptions: [
      {
        identifier: 'digid',
        label: 'DigiD',
        url: 'https://openforms.nl/auth/form-name/digid/start',
        logo: {
          title: 'DigiD',
          imageSrc: 'https://openforms.nl/static/img/digid-46x46.71ea68346bbb.png',
          href: 'https://www.digid.nl/',
          appearance: 'dark',
        },
        isForGemachtigde: false,
      },
    ],
    loginRequired: true,
  });
  mswServer.use(mockSubmissionPost());
  let startSubmissionRequest;
  mswServer.events.on('request:match', async ({request}) => {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname.endsWith('/api/v2/submissions')) {
      startSubmissionRequest = request;
    }
  });

  // we simulate the redirect flow by the backend
  render(<Wrap form={form} />);
  const digidLink = await screen.findByRole('link', {name: 'Login with DigiD'});
  const parsedDigidLink = new URL(digidLink.getAttribute('href'));
  const nextUrl = new URL(parsedDigidLink.searchParams.get('next'));
  expect(nextUrl).not.toBeNull();
  render(<Wrap form={form} currentUrl={`${nextUrl.pathname}${nextUrl.search}`} />);

  await waitFor(() => {
    expect(startSubmissionRequest).not.toBeUndefined();
  });
  const requestBody = await startSubmissionRequest.json();
  expect(requestBody.anonymous).toBe(false);
});

test('Start form with object reference query param', async () => {
  const form = buildForm({
    loginOptions: [
      {
        identifier: 'digid',
        label: 'DigiD',
        url: 'https://openforms.nl/auth/form-name/digid/start',
        logo: {
          title: 'DigiD',
          imageSrc: 'https://openforms.nl/static/img/digid-46x46.71ea68346bbb.png',
          href: 'https://www.digid.nl/',
          appearance: 'dark',
        },
        isForGemachtigde: false,
      },
    ],
    loginRequired: true,
  });
  mswServer.use(mockSubmissionPost());
  let startSubmissionRequest;
  mswServer.events.on('request:match', async ({request}) => {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname.endsWith('/api/v2/submissions')) {
      startSubmissionRequest = request;
    }
  });

  // we simulate the redirect flow by the backend
  render(<Wrap form={form} currentUrl="/startpagina?initial_data_reference=foo" />);
  const digidLink = await screen.findByRole('link', {name: 'Login with DigiD'});
  const parsedDigidLink = new URL(digidLink.getAttribute('href'));
  const nextUrl = new URL(parsedDigidLink.searchParams.get('next'));
  expect(nextUrl).not.toBeNull();
  render(<Wrap form={form} currentUrl={`${nextUrl.pathname}${nextUrl.search}`} />);

  await waitFor(() => {
    expect(startSubmissionRequest).not.toBeUndefined();
  });
  const requestBody = await startSubmissionRequest.json();
  expect(requestBody.initialDataReference).toBe('foo');
});

test('Start form without object reference query param', async () => {
  const form = buildForm({
    loginOptions: [
      {
        identifier: 'digid',
        label: 'DigiD',
        url: 'https://openforms.nl/auth/form-name/digid/start',
        logo: {
          title: 'DigiD',
          imageSrc: 'https://openforms.nl/static/img/digid-46x46.71ea68346bbb.png',
          href: 'https://www.digid.nl/',
          appearance: 'dark',
        },
        isForGemachtigde: false,
      },
    ],
    loginRequired: true,
  });
  mswServer.use(mockSubmissionPost());
  let startSubmissionRequest;
  mswServer.events.on('request:match', async ({request}) => {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname.endsWith('/api/v2/submissions')) {
      startSubmissionRequest = request;
    }
  });

  // we simulate the redirect flow by the backend
  render(<Wrap form={form} currentUrl="/startpagina" />);
  const digidLink = await screen.findByRole('link', {name: 'Login with DigiD'});
  const parsedDigidLink = new URL(digidLink.getAttribute('href'));
  const nextUrl = new URL(parsedDigidLink.searchParams.get('next'));
  expect(nextUrl).not.toBeNull();
  render(<Wrap form={form} currentUrl={`${nextUrl.pathname}${nextUrl.search}`} />);

  await waitFor(() => {
    expect(startSubmissionRequest).not.toBeUndefined();
  });
  const requestBody = await startSubmissionRequest.json();
  expect(requestBody.initialDataReference).toBeUndefined();
});

test.each([
  [
    '_digid-message=error',
    'Inloggen bij deze organisatie is niet gelukt. Probeert u het later nog een keer. ' +
      'Lukt het nog steeds niet? Log in bij Mijn DigiD. Zo controleert u of uw DigiD goed ' +
      'werkt. Mogelijk is er een storing bij de organisatie waar u inlogt.',
  ],
  ['_digid-message=login-cancelled', 'Je hebt het inloggen met DigiD geannuleerd.'],
  [
    '_eherkenning-message=error',
    'Er is een fout opgetreden bij het inloggen met EHerkenning. Probeer het later opnieuw.',
  ],
  ['_eherkenning-message=login-cancelled', 'Je hebt het inloggen met EHerkenning geannuleerd.'],
])(
  'Form start does not start if there are auth errors / %s',
  async (testQuery, expectedMessage) => {
    let requestsMade = false;
    mswServer.events.on('request:start', async () => {
      requestsMade = true;
    });
    const onSubmissionObtained = vi.fn();

    render(
      <Wrap
        currentUrl={`/startpagina?_start=1&${testQuery}`}
        onSubmissionObtained={onSubmissionObtained}
      />
    );

    expect(await screen.findByText(expectedMessage)).toBeVisible();
    expect(requestsMade).toBe(false);
    expect(onSubmissionObtained).not.toHaveBeenCalled();
  }
);

test('Form start page does not show login buttons if an active submission is present', async () => {
  const submission = buildSubmission({isAuthenticated: false});

  render(<Wrap initialSubmission={submission} />);

  const continueButton = await screen.findByRole('button', {name: 'Continue existing submission'});
  expect(continueButton).toBeInTheDocument();
  expect(screen.getByRole('button', {name: 'Cancel submission'})).toBeInTheDocument();
});
