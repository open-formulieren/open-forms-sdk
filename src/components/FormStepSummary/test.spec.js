import messagesNL from 'i18n/compiled/nl.json';
import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {IntlProvider} from 'react-intl';

import {testEmptyFields} from './fixtures';
import FormStepSummary, {LabelValueRow} from './index';

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
    key: 'dateOfBirth',
    type: 'date',
    format: 'dd-MM-yyyy',
  };

  act(() => {
    render(<LabelValueRow name="Date of birth" value="" component={dateComponent} />, container);
  });

  const value = container.getElementsByClassName('openforms-summary-row__value')[0].textContent;
  expect(value).toEqual('');
});

it('Multi-value select field displayed properly', () => {
  const selectBoxesComponent = {
    key: 'selectPets',
    type: 'select',
    multiple: true,
    data: {
      values: [
        {
          label: 'Cat',
          value: 'cat',
        },
        {
          label: 'Dog',
          value: 'dog',
        },
        {
          label: 'Fish',
          value: 'fish',
        },
      ],
    },
  };

  act(() => {
    render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <LabelValueRow
          name="Select Pets"
          value={['dog', 'fish']}
          component={selectBoxesComponent}
        />
      </IntlProvider>,
      container
    );
  });

  const value = container.getElementsByClassName('openforms-summary-row__value')[0].textContent;
  expect(value).toEqual('Dog; Fish');
});

it('Empty fields', () => {
  act(() => {
    render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <FormStepSummary
          name="Form Step 1"
          slug="fs-1"
          editStepText="Change"
          data={testEmptyFields}
        />
      </IntlProvider>,
      container
    );
  });

  const emptyValues = container.getElementsByClassName('openforms-summary-row__value');

  for (const emptyValue of emptyValues) {
    expect(emptyValue.textContent).toEqual('');
  }
});

it('Columns without labels are not rendered', () => {
  const columnComponent = {
    key: 'columns',
    type: 'columns',
    columns: [],
  };

  act(() => {
    render(<LabelValueRow name="" value={null} component={columnComponent} />, container);
  });

  const tableRows = container.getElementsByClassName('openforms-summary-row');

  expect(tableRows.length).toEqual(0);
});

it('Number fields with zero values are displayed', () => {
  const numberComponent = {
    key: 'numberComponent',
    type: 'number',
    multiple: false,
  };

  act(() => {
    render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <LabelValueRow name="Number zero" value={0} component={numberComponent} />
      </IntlProvider>,
      container
    );
  });

  const value = container.getElementsByClassName('openforms-summary-row__value')[0].textContent;
  expect(value).toEqual('0');
});

it('Number fields with zero values are displayed', () => {
  const numberComponent = {
    key: 'currencyComponent',
    type: 'currency',
    multiple: false,
  };

  act(() => {
    render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <LabelValueRow name="Currency zero" value={0} component={numberComponent} />
      </IntlProvider>,
      container
    );
  });

  const value = container.getElementsByClassName('openforms-summary-row__value')[0].textContent;
  expect(value).toEqual('€ 0,00');
});

it('Checkboxes are capitalised', () => {
  const dateComponent = {
    key: 'checkbox',
    type: 'checkbox',
  };

  act(() => {
    render(
      <IntlProvider locale="nl" messages={messagesNL}>
        <LabelValueRow name="Date of birth" value={true} component={dateComponent} />
        <LabelValueRow name="Date of birth" value={false} component={dateComponent} />
      </IntlProvider>,
      container
    );
  });

  const valueTrue = container.getElementsByClassName('openforms-summary-row__value')[0].textContent;
  expect(valueTrue).toEqual('Ja');

  const valueFalse = container.getElementsByClassName('openforms-summary-row__value')[1]
    .textContent;
  expect(valueFalse).toEqual('Nee');
});
