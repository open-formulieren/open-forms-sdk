import {render, screen, waitFor} from '@testing-library/react';
import messagesEN from 'i18n/compiled/en.json';
import React from 'react';
import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router-dom';

import {buildSubmission} from 'api-mocks';
import useQuery from 'hooks/useQuery';

import {testForm, testLoginForm} from './fixtures';
import FormStart from './index';

vi.mock('hooks/useQuery');
let scrollIntoViewMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

const Wrap = ({children}) => (
  <IntlProvider locale="en" messages={messagesEN}>
    <MemoryRouter>{children}</MemoryRouter>
  </IntlProvider>
);

it('Form start page start if _start parameter is present', async () => {
  const testLocation = new URLSearchParams('?_start=1');
  useQuery.mockReturnValue(testLocation);

  const onFormStart = vi.fn();
  const onDestroySession = vi.fn();

  render(
    <Wrap>
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

    const testLocation = new URLSearchParams(`?_start=1&${testQuery}`);
    useQuery.mockReturnValue(testLocation);

    render(
      <Wrap>
        <FormStart form={testForm} onFormStart={onFormStart} onDestroySession={onDestroySession} />
      </Wrap>
    );

    expect(await screen.findByText(expectedMessage)).toBeVisible();
    expect(onFormStart).toHaveBeenCalledTimes(0);
  }
);

it('Form start page does not show login buttons if an active submission is present', async () => {
  useQuery.mockReturnValue(new URLSearchParams());
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
  expect(screen.queryByRole('button', {name: 'Abort submission'})).toBeInTheDocument();
});

it('Form start page with initial_data_reference', async () => {
  useQuery.mockReturnValue(new URLSearchParams());
  const onFormStart = vi.fn();
  const onDestroySession = vi.fn();

  render(
    <Wrap>
      <FormStart
        form={testLoginForm}
        onFormStart={onFormStart}
        onDestroySession={onDestroySession}
        initialDataReference="1234"
      />
    </Wrap>
  );

  const loginLink = await screen.findByRole('link', {name: 'Login with DigiD'});
  expect(loginLink).toHaveAttribute(
    'href',
    'https://openforms.nl/auth/form-name/digid/start?next=http%3A%2F%2Flocalhost%2F%3F_start%3D1%26initial_data_reference%3D1234'
  );
});

it('Form start page without initial_data_reference', async () => {
  useQuery.mockReturnValue(new URLSearchParams());
  const onFormStart = vi.fn();
  const onDestroySession = vi.fn();

  render(
    <Wrap>
      <FormStart
        form={testLoginForm}
        onFormStart={onFormStart}
        onDestroySession={onDestroySession}
        initialDataReference={null}
      />
    </Wrap>
  );

  const loginLink = await screen.findByRole('link', {name: 'Login with DigiD'});
  expect(loginLink).toHaveAttribute(
    'href',
    'https://openforms.nl/auth/form-name/digid/start?next=http%3A%2F%2Flocalhost%2F%3F_start%3D1'
  );
});
