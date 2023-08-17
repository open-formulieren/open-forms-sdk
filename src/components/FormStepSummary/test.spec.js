import messagesNL from 'i18n/compiled/nl.json';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router-dom';

import {testEmptyFields} from './fixtures';
import FormStepSummary, {LabelValueRow} from './index';

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
  act(() => {
    root.unmount();
    container.remove();
    root = null;
    container = null;
  });
});

const Wrap = ({children}) => (
  <IntlProvider locale="nl" messages={messagesNL}>
    <MemoryRouter>{children}</MemoryRouter>
  </IntlProvider>
);

it('Unfilled dates displayed properly', () => {
  const dateComponent = {
    key: 'dateOfBirth',
    type: 'date',
    format: 'dd-MM-yyyy',
  };

  act(() => {
    root.render(<LabelValueRow name="Date of birth" value="" component={dateComponent} />);
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
    root.render(
      <Wrap>
        <LabelValueRow
          name="Select Pets"
          value={['dog', 'fish']}
          component={selectBoxesComponent}
        />
      </Wrap>
    );
  });

  const value = container.getElementsByClassName('openforms-summary-row__value')[0].textContent;
  expect(value).toEqual('Dog; Fish');
});

it('Empty fields', () => {
  act(() => {
    root.render(
      <Wrap>
        <FormStepSummary
          name="Form Step 1"
          slug="fs-1"
          editStepText="Change"
          data={testEmptyFields}
        />
      </Wrap>
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
    root.render(<LabelValueRow name="" value={null} component={columnComponent} />);
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
    root.render(
      <Wrap>
        <LabelValueRow name="Number zero" value={0} component={numberComponent} />
      </Wrap>
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
    root.render(
      <Wrap>
        <LabelValueRow name="Currency zero" value={0} component={numberComponent} />
      </Wrap>
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
    root.render(
      <Wrap>
        <LabelValueRow name="Date of birth" value={true} component={dateComponent} />
        <LabelValueRow name="Date of birth" value={false} component={dateComponent} />
      </Wrap>
    );
  });

  const valueTrue = container.getElementsByClassName('openforms-summary-row__value')[0].textContent;
  expect(valueTrue).toEqual('Ja');

  const valueFalse = container.getElementsByClassName('openforms-summary-row__value')[1]
    .textContent;
  expect(valueFalse).toEqual('Nee');
});
