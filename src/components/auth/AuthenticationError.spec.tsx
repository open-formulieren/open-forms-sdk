import {IntlProvider} from 'react-intl';
import {expect, test} from 'vitest';
import {render} from 'vitest-browser-react';

import messagesNL from '@/i18n/compiled/nl.json';

import AuthenticationError from './AuthenticationError';

test('Renders DigiD default error', async () => {
  const screen = await render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_digid-message" errorCode="error" />
    </IntlProvider>
  );

  await expect
    .element(
      screen.getByText(
        'Inloggen bij deze organisatie is niet gelukt. Probeert u ' +
          'het later nog een keer. Lukt het nog steeds niet? Log in bij Mijn DigiD. Zo ' +
          'controleert u of uw DigiD goed werkt. Mogelijk is er een storing bij ' +
          'de organisatie waar u inlogt.'
      )
    )
    .toBeVisible();
});

test('Renders DigiD cancel login error', async () => {
  const screen = await render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_digid-message" errorCode="login-cancelled" />
    </IntlProvider>
  );

  expect(screen.getByText('Je hebt het inloggen met DigiD geannuleerd.')).toBeVisible();
});

test('Renders EHerkenning default error', async () => {
  const screen = await render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_eherkenning-message" errorCode="error" />
    </IntlProvider>
  );

  await expect
    .element(
      screen.getByText(
        'Er is een fout opgetreden bij het inloggen met EHerkenning. Probeer het later opnieuw.'
      )
    )
    .toBeVisible();
});

test('Renders EHerkenning cancel login error', async () => {
  const screen = await render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_eherkenning-message" errorCode="login-cancelled" />
    </IntlProvider>
  );

  await expect
    .element(screen.getByText('Je hebt het inloggen met EHerkenning geannuleerd.'))
    .toBeVisible();
});

test('Renders eIDAS default error', async () => {
  const screen = await render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_eidas-message" errorCode="error" />
    </IntlProvider>
  );

  await expect
    .element(
      screen.getByText(
        'Er is een fout opgetreden bij het inloggen met eIDAS. Probeer het later opnieuw.'
      )
    )
    .toBeVisible();
});

test('Renders eIDAS cancel login error', async () => {
  const screen = await render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_eidas-message" errorCode="login-cancelled" />
    </IntlProvider>
  );

  await expect
    .element(screen.getByText('Je hebt het inloggen met eIDAS geannuleerd.'))
    .toBeVisible();
});

test('Renders Yivi default error', async () => {
  const screen = await render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_yivi-message" errorCode="error" />
    </IntlProvider>
  );

  await expect
    .element(
      screen.getByText(
        'Er is een fout opgetreden bij het inloggen met Yivi. Probeer het later opnieuw.'
      )
    )
    .toBeVisible();
});

test('Renders Yivi cancel login error', async () => {
  const screen = await render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationError parameter="_yivi-message" errorCode="login-cancelled" />
    </IntlProvider>
  );

  await expect
    .element(screen.getByText('Je hebt het inloggen met Yivi geannuleerd.'))
    .toBeVisible();
});
