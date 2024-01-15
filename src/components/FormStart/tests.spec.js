import {render as renderTest, screen} from '@testing-library/react';
import messagesEN from 'i18n/compiled/en.json';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router-dom';

import useQuery from 'hooks/useQuery';

import FormStart from '.';
import {testForm} from './fixtures';

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
        <FormStart
          form={testForm}
          onFormStart={onFormStart}
          onDestroySession={onDestroySession}
          hasActiveSubmission={false}
        />
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
      'Er is een fout opgetreden in de communicatie met DigiD. Probeert u het later nogmaals. Indien deze fout blijft aanhouden, kijk dan op de website https://www.digid.nl voor de laatste informatie.',
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
            hasActiveSubmission={false}
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
        hasActiveSubmission={true}
      />
    </Wrap>,
    container
  );

  expect(screen.queryByRole('button', {name: 'Continue existing submission'})).toBeInTheDocument();
  expect(screen.queryByRole('button', {name: 'Abort existing submission'})).toBeInTheDocument();
});
