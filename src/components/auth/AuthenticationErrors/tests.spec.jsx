import {render, screen} from '@testing-library/react';
import messagesNL from 'i18n/compiled/nl.json';
import {IntlProvider} from 'react-intl';

import {AuthenticationErrors} from './index';

let scrollIntoViewMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

it('Renders DigiD default error', () => {
  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationErrors parameters={{'_digid-message': 'error'}} />
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
      <AuthenticationErrors parameters={{'_digid-message': 'login-cancelled'}} />
    </IntlProvider>
  );

  expect(screen.getByText('Je hebt het inloggen met DigiD geannuleerd.')).toBeVisible();
});

it('Renders EHerkenning default error', () => {
  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationErrors parameters={{'_eherkenning-message': 'error'}} />
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
      <AuthenticationErrors parameters={{'_eherkenning-message': 'login-cancelled'}} />
    </IntlProvider>
  );

  expect(screen.getByText('Je hebt het inloggen met EHerkenning geannuleerd.')).toBeVisible();
});

it('Renders eIDAS default error', () => {
  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <AuthenticationErrors parameters={{'_eidas-message': 'error'}} />
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
      <AuthenticationErrors parameters={{'_eidas-message': 'login-cancelled'}} />
    </IntlProvider>
  );

  expect(screen.getByText('Je hebt het inloggen met eIDAS geannuleerd.')).toBeVisible();
});
