import {render, screen} from '@testing-library/react';
import messagesNL from 'i18n/compiled/nl.json';
import {IntlProvider} from 'react-intl';

import {testLoginForm} from 'components/FormStart/fixtures';

import {CoSignAuthentication} from './index';

it('CoSign component constructs the right auth URL', () => {
  // Control the location that the test will use
  const {location} = window;
  delete window.location;
  window.location = {
    href: 'https://openforms.nl/form-name/step/step-name',
  };

  render(
    <IntlProvider locale="nl" messages={messagesNL}>
      <CoSignAuthentication
        form={testLoginForm}
        submissionUuid="111-222-333"
        authPlugin="digid"
        saveStepData={() => {}}
      />
    </IntlProvider>
  );

  // Reset location
  window.location = location;

  const loginButton = screen.getByRole('link', {name: 'Inloggen met DigiD'});
  expect(loginButton).toBeVisible();

  const loginUrl = new URL(loginButton.href);

  expect(loginUrl.searchParams.get('next')).toEqual(
    'https://openforms.nl/form-name/step/step-name'
  );
  expect(loginUrl.searchParams.get('coSignSubmission')).toEqual('111-222-333');
});
