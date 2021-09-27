import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';

import FormStepSummary from './index';
import messagesNL from 'i18n/compiled/nl.json';
import {testStepDataEmptyDate} from './fixtures';


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


it('Unfilled dates displayed properly', () => {

  act(() => {
    render(
      <IntlProvider
        locale="nl"
        messages={messagesNL}
      >
        <FormStepSummary
          stepData={testStepDataEmptyDate}
          editStepUrl="http://test-url.nl"
          editStepText="Change"
        />
      </IntlProvider>,
      container
    );
  });

  const value = container.getElementsByClassName("openforms-table__cell")[0].textContent;
  expect(value).toEqual('');
});
