import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';

import FormStepSummary, {LabelValueRow} from './index';
import messagesNL from 'i18n/compiled/nl.json';
import {
  testEmptyFields,
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
  const dateComponent = {
    "key": "dateOfBirth",
    "type": "date",
    "format": "dd-MM-yyyy",
  };

  act(() => {
    render(
      <LabelValueRow
        name="Date of birth"
        value=""
        component={dateComponent}
      />,
      container
    );
  });

  const value = container.getElementsByClassName('openforms-summary-row__value')[0].textContent;
  expect(value).toEqual('');
});

it('Multi-value select field displayed properly', () => {
  const selectBoxesComponent = {
    "key": "selectPets",
    "type": "select",
    "multiple": true,
    "data": {
      "values": [
        {
          "label": "Cat",
          "value": "cat"
        },
        {
          "label": "Dog",
          "value": "dog"
        },
        {
          "label": "Fish",
          "value": "fish"
        }
      ]
    }
  };

  act(() => {
    render(
      <IntlProvider
        locale="nl"
        messages={messagesNL}
      >
        <LabelValueRow
          name="Select Pets"
          value={["dog", "fish"]}
          component={selectBoxesComponent}
        />
      </IntlProvider>,
      container
    );
  });

  const value = container.getElementsByClassName("openforms-summary-row__value")[0].textContent;
  expect(value).toEqual('Dog; Fish');
});

it('Empty fields', () => {
  act(() => {
    render(
      <FormStepSummary
        name="Form Step 1"
        slug="fs-1"
        editStepText="Change"
        data={testEmptyFields}
      />,
      container
    );
  });

  const emptyValues = container.getElementsByClassName("openforms-summary-row__value");

  for (const emptyValue of emptyValues) {
    expect(emptyValue.textContent).toEqual('');
  }
});

it('Columns without labels are not rendered', () => {
  const columnComponent = {
    key: 'columns',
    type: 'columns',
    columns: []
  };

  act(() => {
    render(
      <LabelValueRow
        name=""
        value={null}
        component={columnComponent}
      />,
      container
    );
  });

  const tableRows = container.getElementsByClassName('openforms-summary-row');

  expect(tableRows.length).toEqual(0);
});

