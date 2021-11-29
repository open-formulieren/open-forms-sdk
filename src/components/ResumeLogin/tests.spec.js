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

  const firstFormStepUrl = new URL('https://open-forms.nl/digid-form/step1/');
  const currentUrl = new URL('https://open-forms.nl/digid-form/resume');
  currentUrl.searchParams.set('next', firstFormStepUrl.href);
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

  currentUrl.searchParams.set('_start', 1);
  const expectedUrl = new URL(option.url);
  expectedUrl.searchParams.set('next', currentUrl.href);

  const actualUrl = container.getElementsByClassName('openforms-button')[0].href;

  expect(actualUrl).toEqual(expectedUrl.toString());
  window.location = location;
});
