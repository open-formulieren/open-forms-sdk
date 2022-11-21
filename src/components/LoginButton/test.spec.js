import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {IntlProvider} from 'react-intl';

import LoginButton from './index';
import messagesNL from 'i18n/compiled/nl.json';

let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('Login button has the right URL after cancelling log in', () => {
  const option = {
    identifier: 'digid',
    label: 'DigiD',
    url: 'https://open-forms.nl/auth/digid-form/digid/start',
  };

  const {location} = window;
  delete window.location;
  window.location = {
    href: 'https://open-forms.nl/digid-form/?_start=1&_digid-message=login-cancelled',
  };

  act(() => {
    render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <LoginButton option={option} />
      </IntlProvider>,
      container
    );
  });

  const expectedUrl = new URL(option.url);
  expectedUrl.searchParams.set('next', 'https://open-forms.nl/digid-form/?_start=1');

  const actualUrl = container.getElementsByClassName('openforms-button')[0].href;

  expect(actualUrl).toEqual(expectedUrl.toString());
  window.location = location;
});
