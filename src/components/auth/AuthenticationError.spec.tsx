import {render, screen} from '@testing-library/react';
import {IntlProvider} from 'react-intl';

import messagesNL from '@/i18n/compiled/nl.json';

import AuthenticationError from './AuthenticationError';

const scrollIntoViewMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

it('Renders DigiD default error', () => {
  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_digid-message" errorCode="error" />
    </IntlProvider>
  );

  expect(
    screen.getByText(
      'Inloggen bij deze organisatie is niet gelukt. Probeert u ' +
        'het later nog een keer. Lukt het nog steeds niet? Log in bij Mijn DigiD. Zo ' +
        'controleert u of uw DigiD goed werkt. Mogelijk is er een storing bij ' +
        'de organisatie waar u inlogt.'
    )
  ).toBeVisible();
});

it('Renders DigiD cancel login error', () => {
  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_digid-message" errorCode="login-cancelled" />
    </IntlProvider>
  );

  expect(screen.getByText('Je hebt het inloggen met DigiD geannuleerd.')).toBeVisible();
});

it('Renders EHerkenning default error', () => {
  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_eherkenning-message" errorCode="error" />
    </IntlProvider>
  );

  expect(
    screen.getByText(
      'Er is een fout opgetreden bij het inloggen met EHerkenning. Probeer het later opnieuw.'
    )
  ).toBeVisible();
});

it('Renders EHerkenning cancel login error', () => {
  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_eherkenning-message" errorCode="login-cancelled" />
    </IntlProvider>
  );

  expect(screen.getByText('Je hebt het inloggen met EHerkenning geannuleerd.')).toBeVisible();
});

it('Renders eIDAS default error', () => {
  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_eidas-message" errorCode="error" />
    </IntlProvider>
  );

  expect(
    screen.getByText(
      'Er is een fout opgetreden bij het inloggen met eIDAS. Probeer het later opnieuw.'
    )
  ).toBeVisible();
});

it('Renders eIDAS cancel login error', () => {
  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_eidas-message" errorCode="login-cancelled" />
    </IntlProvider>
  );

  expect(screen.getByText('Je hebt het inloggen met eIDAS geannuleerd.')).toBeVisible();
});

it('Renders Yivi default error', () => {
  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_yivi-message" errorCode="error" />
    </IntlProvider>
  );

  expect(
    screen.getByText(
      'Er is een fout opgetreden bij het inloggen met Yivi. Probeer het later opnieuw.'
    )
  ).toBeVisible();
});

it('Renders Yivi cancel login error', () => {
  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_yivi-message" errorCode="login-cancelled" />
    </IntlProvider>
  );

  expect(screen.getByText('Je hebt het inloggen met Yivi geannuleerd.')).toBeVisible();
});
