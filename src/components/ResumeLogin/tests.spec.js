import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';

import messagesNL from 'i18n/compiled/nl.json';
import LoginButton from 'components/LoginButton';
import {getLoginUrl} from './index';


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


it('Generate next URL for ResumeLogin', () => {
  const option = {
    identifier: 'digid',
    label: 'DigiD',
    url: 'https://open-forms.nl/auth/digid-form/digid/start',
  };

  const { location } = window;
  delete window.location;

  const currentUrl = new URL('https://open-forms.nl/resume');
  currentUrl.searchParams.set(
    'next',
    'https://open-forms.nl/digid-form/?_start=1&submission_uuid=54713201-1a69-46c9-be9e-d26129e1ca14'
  );
  window.location = { href: currentUrl.href };

  act(() => {
    render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <LoginButton
          option={option}
          getLoginUrl={getLoginUrl}
        />
      </IntlProvider>,
      container
    );
  });

  const expectedUrl = new URL(option.url);
  expectedUrl.searchParams.set(
    'next',
    'https://open-forms.nl/digid-form/?_start=1&submission_uuid=54713201-1a69-46c9-be9e-d26129e1ca14'
  );

  const actualUrl = container.getElementsByClassName('openforms-button')[0].href;

  expect(actualUrl).toEqual(expectedUrl.toString());
  window.location = location;
});
