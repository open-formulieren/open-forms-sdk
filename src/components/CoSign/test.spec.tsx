import {render, screen} from '@testing-library/react';
import messagesNL from 'i18n/compiled/nl.json';
import {IntlProvider} from 'react-intl';

import {buildForm} from 'api-mocks';

import {CoSignAuthentication} from './CoSignOld';

it('CoSign component constructs the right auth URL', () => {
  // Control the location that the test will use
  const {location} = window;
  // @ts-expect-error monkeypatching
  delete window.location;
  // @ts-expect-error monkeypatching
  window.location = {
    href: 'https://openforms.nl/form-name/step/step-name',
  };

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
  });

  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <CoSignAuthentication form={form} submissionUuid="111-222-333" authPlugin="digid" />
    </IntlProvider>
  );

  // Reset location
  window.location = location;

  const loginButton = screen.getByRole<HTMLAnchorElement>('link', {name: 'Inloggen met DigiD'});
  expect(loginButton).toBeVisible();

  const loginUrl = new URL(loginButton.href);

  expect(loginUrl.searchParams.get('next')).toEqual(
    'https://openforms.nl/form-name/step/step-name'
  );
  expect(loginUrl.searchParams.get('coSignSubmission')).toEqual('111-222-333');
});
