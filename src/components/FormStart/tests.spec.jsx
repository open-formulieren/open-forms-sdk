import {render, screen, waitFor} from '@testing-library/react';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {buildSubmission} from 'api-mocks';

import {testForm, testLoginForm} from './fixtures';
import FormStart from './index';

let scrollIntoViewMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

const Wrap = ({children, currentUrl = '/startpagina'}) => {
  const parsedUrl = new URL(currentUrl, 'http://dummy');
  const routes = [{path: parsedUrl.pathname, element: <>{children}</>}];
  const router = createMemoryRouter(routes, {initialEntries: [currentUrl]});
  return (
    <IntlProvider locale="en" messages={messagesEN}>
      <RouterProvider router={router} />
    </IntlProvider>
  );
};

it('Form start page start if _start parameter is present', async () => {
  const onFormStart = vi.fn();
  const onDestroySession = vi.fn();

  render(
    <Wrap currentUrl="/startpagina?_start=1">
      <FormStart form={testForm} onFormStart={onFormStart} onDestroySession={onDestroySession} />
    </Wrap>
  );

  // waitFor required to not have act(...) warnings!
  await waitFor(() => {
    expect(onFormStart).toHaveBeenCalled();
  });
});

it.each([
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
    const onFormStart = vi.fn();
    const onDestroySession = vi.fn();

    const url = `/startpagina?_start=1&${testQuery}`;
    render(
      <Wrap currentUrl={url}>
        <FormStart form={testForm} onFormStart={onFormStart} onDestroySession={onDestroySession} />
      </Wrap>
    );

    expect(await screen.findByText(expectedMessage)).toBeVisible();
    expect(onFormStart).toHaveBeenCalledTimes(0);
  }
);

it('Form start page does not show login buttons if an active submission is present', async () => {
  const onFormStart = vi.fn();
  const onDestroySession = vi.fn();

  render(
    <Wrap>
      <FormStart
        form={testForm}
        onFormStart={onFormStart}
        onDestroySession={onDestroySession}
        submission={buildSubmission({isAuthenticated: false})}
      />
    </Wrap>
  );

  const continueButton = await screen.findByRole('button', {name: 'Continue existing submission'});
  expect(continueButton).toBeInTheDocument();
  expect(screen.queryByRole('button', {name: 'Cancel submission'})).toBeInTheDocument();
});

it('Form start page with initial_data_reference', async () => {
  const onFormStart = vi.fn();
  const onDestroySession = vi.fn();

  render(
    <Wrap currentUrl="/startpagina?initial_data_reference=1234">
      <FormStart
        form={testLoginForm}
        onFormStart={onFormStart}
        onDestroySession={onDestroySession}
      />
    </Wrap>
  );

  const loginLink = await screen.findByRole('link', {name: 'Login with DigiD'});
  const href = loginLink.getAttribute('href');
  expect(href).toBeTruthy();

  const nextParam = new URL(href).searchParams.get('next');
  expect(nextParam).toBeTruthy();

  const next = new URL(nextParam);
  expect(next.searchParams.get('initial_data_reference')).toBe('1234');
});

it('Form start page without initial_data_reference', async () => {
  const onFormStart = vi.fn();
  const onDestroySession = vi.fn();

  render(
    <Wrap currentUrl="/startpagina?initial_data_reference=">
      <FormStart
        form={testLoginForm}
        onFormStart={onFormStart}
        onDestroySession={onDestroySession}
      />
    </Wrap>
  );

  const loginLink = await screen.findByRole('link', {name: 'Login with DigiD'});
  const href = loginLink.getAttribute('href');
  expect(href).toBeTruthy();

  const nextParam = new URL(href).searchParams.get('next');
  expect(nextParam).toBeTruthy();

  const next = new URL(nextParam);
  expect(nextParam).not.toContain('initial_data_reference');
  expect(next.searchParams.get('initial_data_reference')).toBeNull();
});
