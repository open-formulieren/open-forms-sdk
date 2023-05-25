import messagesNL from 'i18n/compiled/nl.json';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {IntlProvider} from 'react-intl';

import {testLoginForm} from 'components/FormStart/fixtures';

import {CoSignAuthentication} from './index';

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

it('CoSign component constructs the right auth URL', () => {
  // Control the location that the test will use
  const {location} = window;
  delete window.location;
  window.location = {
    href: 'https://openforms.nl/form-name/step/step-name',
  };

  act(() => {
    root.render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <CoSignAuthentication
          form={testLoginForm}
          submissionUuid="111-222-333"
          authPlugin="digid"
          saveStepData={() => {}}
        />
      </IntlProvider>
    );
  });

  // Reset location
  window.location = location;

  const loginButton = container.getElementsByTagName('a')[0];

  expect(loginButton.textContent).toEqual('Inloggen met DigiD');

  const loginUrl = new URL(loginButton.href);

  expect(loginUrl.searchParams.get('next')).toEqual(
    'https://openforms.nl/form-name/step/step-name'
  );
  expect(loginUrl.searchParams.get('coSignSubmission')).toEqual('111-222-333');
});
