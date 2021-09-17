import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';
import {useAsync} from 'react-use';

import Summary from 'components/Summary';
import messagesNL from 'i18n';
import {testForm} from 'components/FormStart/fixtures';
import {ConfigContext} from '../../Context';


jest.mock('react-use');

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


it('Summary displays logout button if loginRequired is true', () => {
  const formLoginRequired = {
    ...testForm,
    loginRequired: true,
  };
  const onLogout = jest.fn();
  const onConfirm = jest.fn();

  useAsync.mockReturnValue({loading: false});

  act(() => {
    render(
      <IntlProvider
        locale="nl"
        messages={messagesNL}
      >
        <ConfigContext.Provider value={{baseUrl: 'http://test.nl'}}>
          <Summary
            form={formLoginRequired}
            submission={{steps: [{formStep: 'http://testserver/api/v1/forms/33af5a1c-552e-4e8f-8b19-287cf35b9edd/steps/0c2a1816-a7d7-4193-b431-918956744038'}]}}
            onConfirm={onConfirm}
            onLogout={onLogout}
          />
        </ConfigContext.Provider>
      </IntlProvider>,
      container
    );
  });

  expect(container.textContent).toContain('Uitloggen');
});

it('Summary does not display logout button if loginRequired is false', () => {
  const formLoginRequired = {
    ...testForm,
    loginRequired: false,
  };
  const onLogout = jest.fn();
  const onConfirm = jest.fn();

  useAsync.mockReturnValue({loading: false});

  act(() => {
    render(
      <IntlProvider
        locale="nl"
        messages={messagesNL}
      >
        <ConfigContext.Provider value={{baseUrl: 'http://test.nl'}}>
          <Summary
            form={formLoginRequired}
            submission={{steps: [{formStep: 'http://testserver/api/v1/forms/33af5a1c-552e-4e8f-8b19-287cf35b9edd/steps/0c2a1816-a7d7-4193-b431-918956744038'}]}}
            onConfirm={onConfirm}
            onLogout={onLogout}
          />
        </ConfigContext.Provider>
      </IntlProvider>,
      container
    );
  });

  expect(container.textContent).not.toContain('Uitloggen');
});
