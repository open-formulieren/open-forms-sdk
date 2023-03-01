import {fireEvent} from '@testing-library/react';
import messagesNL from 'i18n/compiled/nl.json';
import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {IntlProvider} from 'react-intl';

import {buildForm} from 'api-mocks';
import {LiteralsProvider} from 'components/Literal';

import LoginOptions from './index';

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

it('Login not required, options wrapped in form tag', () => {
  const form = buildForm({loginRequired: false, loginOptions: []});
  const onFormStart = jest.fn(e => e.preventDefault());

  act(() => {
    render(
      <LiteralsProvider literals={{beginText: {resolved: 'Begin Form'}}}>
        <LoginOptions form={form} onFormStart={onFormStart} />
      </LiteralsProvider>,
      container
    );
  });

  expect(container.firstChild.nodeName).toEqual('FORM');
  const anonymousStartButton = container.getElementsByTagName('button')[0];
  expect(anonymousStartButton).not.toBeUndefined();

  fireEvent.click(anonymousStartButton);

  expect(onFormStart).toHaveBeenCalled();
});

it('Login required, options not wrapped in form tag', () => {
  const form = buildForm({
    loginRequired: true,
    loginOptions: [
      {
        identifier: 'digid',
        label: 'DigiD',
        url: 'https://open-forms.nl/auth/form-slug/digid/start',
        logo: {
          title: 'DigiD simulatie',
          imageSrc: '/digid.png',
          href: 'https://www.digid.nl/',
          appearance: 'light',
        },
        isForGemachtigde: false,
      },
    ],
  });
  const onFormStart = jest.fn(e => e.preventDefault());

  const {location} = window;
  delete window.location;
  window.location = {
    href: 'https://open-forms.nl/digid-form/',
  };

  act(() => {
    render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <LoginOptions form={form} onFormStart={onFormStart} />
      </IntlProvider>,
      container
    );
  });

  const expectedUrl = new URL(form.loginOptions[0].url);
  expectedUrl.searchParams.set('next', 'https://open-forms.nl/digid-form/?_start=1');

  expect(container.firstChild.nodeName).toEqual('DIV');
  const anonymousStartButton = container.getElementsByTagName('button')[0];
  expect(anonymousStartButton).toBeUndefined();

  const digidLoginButton = container.getElementsByTagName('a')[0];
  expect(digidLoginButton.href).toEqual(expectedUrl.toString());

  window.location = location;
});

it('Login button has the right URL after cancelling log in', () => {
  const form = buildForm({
    loginRequired: true,
    loginOptions: [
      {
        identifier: 'digid',
        label: 'DigiD',
        url: 'https://open-forms.nl/auth/form-slug/digid/start',
        logo: {
          title: 'DigiD simulatie',
          imageSrc: '/digid.png',
          href: 'https://www.digid.nl/',
          appearance: 'light',
        },
        isForGemachtigde: false,
      },
    ],
  });

  const onFormStart = jest.fn(e => e.preventDefault());

  const {location} = window;
  delete window.location;
  window.location = {
    href: 'https://open-forms.nl/digid-form/?_start=1&_digid-message=login-cancelled',
  };

  act(() => {
    render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <LoginOptions form={form} onFormStart={onFormStart} />
      </IntlProvider>,
      container
    );
  });

  const expectedUrl = new URL(form.loginOptions[0].url);
  expectedUrl.searchParams.set('next', 'https://open-forms.nl/digid-form/?_start=1');

  expect(container.firstChild.nodeName).toEqual('DIV');
  const anonymousStartButton = container.getElementsByTagName('button')[0];
  expect(anonymousStartButton).toBeUndefined();

  const digidLoginButton = container.getElementsByTagName('a')[0];
  expect(digidLoginButton.href).toEqual(expectedUrl.toString());

  window.location = location;
});
