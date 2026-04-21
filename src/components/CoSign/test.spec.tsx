import {IntlProvider} from 'react-intl';
import {expect, test} from 'vitest';
import {render} from 'vitest-browser-react';

import {buildForm} from '@/api-mocks';
import messagesNL from '@/i18n/compiled/nl.json';

import {CoSignAuthentication} from './CoSignOld';

test('CoSign component constructs the right auth URL', async () => {
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
        visible: true,
      },
    ],
  });

  const screen = await render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <CoSignAuthentication form={form} submissionUuid="111-222-333" authPlugin="digid" />
    </IntlProvider>
  );

  const loginButton = screen.getByRole('link', {name: 'Inloggen met DigiD'});
  await expect.element(loginButton).toBeVisible();

  const loginButtonElement = loginButton.element();
  if (!(loginButtonElement instanceof HTMLAnchorElement)) throw new Error('Expected anchor');
  const loginUrl = new URL(loginButtonElement.href);

  expect(loginUrl.searchParams.get('next')).toEqual(`http://${window.location.host}/`);
  expect(loginUrl.searchParams.get('coSignSubmission')).toEqual('111-222-333');
});
