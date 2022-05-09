import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';

import FormStepSummary from './index';
import messagesNL from 'i18n/compiled/nl.json';
import {
  testStepDataEmptyDate,
  testStepDataSelectMultivalue,
  testStepEmptyFields,
  testStepColumns,
  testStepHiddenFieldsetHeader,
} from './fixtures';


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

  const value = container.getElementsByClassName('openforms-table__cell')[0].textContent;
  expect(value).toEqual('');
});

it('Multi-value select field displayed properly', () => {

  act(() => {
    render(
      <IntlProvider
        locale="nl"
        messages={messagesNL}
      >
        <FormStepSummary
          stepData={testStepDataSelectMultivalue}
          editStepUrl="http://test-url.nl"
          editStepText="Change"
        />
      </IntlProvider>,
      container
    );
  });

  const value = container.getElementsByClassName("openforms-table__cell")[0].textContent;
  expect(value).toEqual('Dog; Fish');
});

it('Empty fields', () => {

  act(() => {
    render(
      <IntlProvider
        locale="nl"
        messages={messagesNL}
      >
        <FormStepSummary
          stepData={testStepEmptyFields}
          editStepUrl="http://test-url.nl"
          editStepText="Change"
        />
      </IntlProvider>,
      container
    );
  });

  const emptyValues = container.getElementsByClassName("openforms-table__cell");

  for (const emptyValue of emptyValues) {
    expect(emptyValue.textContent).toEqual('');
  }
});

it('Columns without labels are not rendered', () => {
  act(() => {
    render(
      <IntlProvider
        locale="nl"
        messages={messagesNL}
      >
        <FormStepSummary
          stepData={testStepColumns}
          editStepUrl="http://test-url.nl"
          editStepText="Change"
        />
      </IntlProvider>,
      container
    );
  });

  const tableRows = container.getElementsByClassName('openforms-table__row');

  expect(tableRows.length).toEqual(2);
  expect(tableRows[0].querySelector('.openforms-table__head').textContent).toEqual('Input 1');
  expect(tableRows[1].querySelector('.openforms-table__head').textContent).toEqual('Input 2');
});

it('Columns without labels are not rendered', () => {
  act(() => {
    render(
      <IntlProvider
        locale="nl"
        messages={messagesNL}
      >
        <FormStepSummary
          stepData={testStepHiddenFieldsetHeader}
          editStepUrl="http://test-url.nl"
          editStepText="Change"
        />
      </IntlProvider>,
      container
    );
  });

  const tableRows = container.getElementsByClassName('openforms-table__row');

  expect(tableRows.length).toEqual(2);
  expect(tableRows[0].querySelector('.openforms-table__head').textContent).toEqual('Input 1');
  expect(tableRows[1].querySelector('.openforms-table__head').textContent).toEqual('Input 2');
});
