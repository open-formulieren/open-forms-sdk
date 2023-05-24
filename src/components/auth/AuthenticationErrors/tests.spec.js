import messagesNL from 'i18n/compiled/nl.json';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {IntlProvider} from 'react-intl';

import {AuthenticationErrors} from '.';

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
  root.unmount();
  container.remove();
  root = null;
  container = null;
});

it('Renders DigiD default error', () => {
  act(() => {
    root.render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <AuthenticationErrors parameters={{'_digid-message': 'error'}} />
      </IntlProvider>
    );
  });

  expect(container.textContent).toBe(
    'Er is een fout opgetreden in de communicatie met DigiD. Probeert u het later nogmaals. Indien deze fout blijft aanhouden, kijk dan op de website https://www.digid.nl voor de laatste informatie.'
  );
});

it('Renders DigiD cancel login error', () => {
  act(() => {
    root.render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <AuthenticationErrors parameters={{'_digid-message': 'login-cancelled'}} />
      </IntlProvider>
    );
  });

  expect(container.textContent).toBe('Je hebt het inloggen met DigiD geannuleerd.');
});

it('Renders EHerkenning default error', () => {
  act(() => {
    root.render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <AuthenticationErrors parameters={{'_eherkenning-message': 'error'}} />
      </IntlProvider>
    );
  });

  expect(container.textContent).toBe(
    'Er is een fout opgetreden bij het inloggen met EHerkenning. Probeer het later opnieuw.'
  );
});

it('Renders EHerkenning cancel login error', () => {
  act(() => {
    root.render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <AuthenticationErrors parameters={{'_eherkenning-message': 'login-cancelled'}} />
      </IntlProvider>
    );
  });

  expect(container.textContent).toBe('Je hebt het inloggen met EHerkenning geannuleerd.');
});

it('Renders eIDAS default error', () => {
  act(() => {
    root.render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <AuthenticationErrors parameters={{'_eidas-message': 'error'}} />
      </IntlProvider>
    );
  });

  expect(container.textContent).toBe(
    'Er is een fout opgetreden bij het inloggen met eIDAS. Probeer het later opnieuw.'
  );
});

it('Renders eIDAS cancel login error', () => {
  act(() => {
    root.render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <AuthenticationErrors parameters={{'_eidas-message': 'login-cancelled'}} />
      </IntlProvider>
    );
  });

  expect(container.textContent).toBe('Je hebt het inloggen met eIDAS geannuleerd.');
});
