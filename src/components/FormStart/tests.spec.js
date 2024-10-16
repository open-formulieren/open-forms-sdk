import {render as renderTest, screen} from '@testing-library/react';
import messagesEN from 'i18n/compiled/en.json';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router-dom';

import {buildSubmission} from 'api-mocks';
import useQuery from 'hooks/useQuery';

import FormStart from '.';
import {testForm, testLoginForm} from './fixtures';

jest.mock('hooks/useQuery');
let scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

let container = null;
let root = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  // cleanup on exiting
  act(() => {
    root.unmount();
    container.remove();
    root = null;
    container = null;
  });
});

const Wrap = ({children}) => (
  <IntlProvider locale="en" messages={messagesEN}>
    <MemoryRouter>{children}</MemoryRouter>
  </IntlProvider>
);

it('Form start page start if _start parameter is present', () => {
  const testLocation = new URLSearchParams('?_start=1');
  useQuery.mockReturnValue(testLocation);

  const onFormStart = jest.fn();
  const onDestroySession = jest.fn();

  act(() => {
    root.render(
      <Wrap>
        <FormStart form={testForm} onFormStart={onFormStart} onDestroySession={onDestroySession} />
      </Wrap>
    );
  });

  expect(onFormStart).toHaveBeenCalled();
});

it('Form start does not start if there are auth errors', () => {
  const onFormStart = jest.fn();
  const onDestroySession = jest.fn();

  const testQueries = {
    '_digid-message=error':
      'Inloggen bij deze organisatie is niet gelukt. Probeert u ' +
      'het later nog een keer. Lukt het nog steeds niet? Log in bij Mijn DigiD. Zo ' +
      'controleert u of uw DigiD goed werkt. Mogelijk is er een storing bij ' +
      'de organisatie waar u inlogt.',
    '_digid-message=login-cancelled': 'Je hebt het inloggen met DigiD geannuleerd.',
    '_eherkenning-message=error':
      'Er is een fout opgetreden bij het inloggen met EHerkenning. Probeer het later opnieuw.',
    '_eherkenning-message=login-cancelled': 'Je hebt het inloggen met EHerkenning geannuleerd.',
  };

  for (const [testQuery, expectedMessage] of Object.entries(testQueries)) {
    const testLocation = new URLSearchParams(`?_start=1&${testQuery}`);
    useQuery.mockReturnValue(testLocation);

    act(() => {
      root.render(
        <Wrap>
          <FormStart
            form={testForm}
            onFormStart={onFormStart}
            onDestroySession={onDestroySession}
          />
        </Wrap>
      );
    });

    expect(container.textContent).toContain(expectedMessage);
    expect(onFormStart).toHaveBeenCalledTimes(0);
  }
});

it('Form start page does not show login buttons if an active submission is present', () => {
  useQuery.mockReturnValue(new URLSearchParams());
  const onFormStart = jest.fn();
  const onDestroySession = jest.fn();

  renderTest(
    <Wrap>
      <FormStart
        form={testForm}
        onFormStart={onFormStart}
        onDestroySession={onDestroySession}
        submission={buildSubmission({isAuthenticated: false})}
      />
    </Wrap>,
    container
  );

  expect(screen.queryByRole('button', {name: 'Continue existing submission'})).toBeInTheDocument();
  expect(screen.queryByRole('button', {name: 'Abort submission'})).toBeInTheDocument();
});

it('Form start page with initial_data_reference', () => {
  useQuery.mockReturnValue(new URLSearchParams());
  const onFormStart = jest.fn();
  const onDestroySession = jest.fn();

  renderTest(
    <Wrap>
      <FormStart
        form={testLoginForm}
        onFormStart={onFormStart}
        onDestroySession={onDestroySession}
        initialDataReference="1234"
      />
    </Wrap>,
    container
  );
  const loginLink = screen.getByRole('link', {name: 'Login with DigiD'});
  expect(loginLink).toHaveAttribute(
    'href',
    'https://openforms.nl/auth/form-name/digid/start?initial_data_reference=1234&next=http%3A%2F%2Flocalhost%2F%3F_start%3D1'
  );
});
