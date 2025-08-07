import type {
  CheckboxComponentSchema,
  ColumnsComponentSchema,
  CurrencyComponentSchema,
  DateComponentSchema,
  NumberComponentSchema,
  SelectComponentSchema,
} from '@open-formulieren/types';
import {render as realRender, screen} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router';

import messagesNL from '@/i18n/compiled/nl.json';

import {LabelValueRow} from './FormStepSummary';

const render = (ui: React.ReactNode) =>
  realRender(
    <IntlProvider locale="nl" messages={messagesNL}>
      <MemoryRouter>{ui}</MemoryRouter>
    </IntlProvider>
  );

// NOTE - ideally, in these tests we would query by the roles that speak more to the
// imagination than 'term' and 'definition', however these are still "too new" and not
// supported yet by testing-library (if they will ever be).
//
// In practice, you should read `*byRole('definition')` as `*byRole('associationlistitemvalue')`,
// and a similar mapping applies between 'term' and 'associationlistitemkey'.
//
// MDN: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/structural_roles#structural_roles_with_html_equivalents

test('Unfilled dates displayed properly', () => {
  const dateComponent: DateComponentSchema = {
    id: 'dateOfBirth',
    key: 'dateOfBirth',
    type: 'date',
    label: 'Date of birth',
  };

  render(<LabelValueRow name="Date of birth" value="" component={dateComponent} />);

  expect(screen.getByRole('definition')).toHaveTextContent('');
});

test('Multi-value select field displayed properly', () => {
  const selectComponent: SelectComponentSchema = {
    id: 'selectPets',
    key: 'selectPets',
    type: 'select',
    label: 'Select pets',
    multiple: true,
    dataSrc: 'values',
    dataType: 'string',
    openForms: {translations: {}, dataSrc: 'manual'},
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

  render(<LabelValueRow name="Select Pets" value={['dog', 'fish']} component={selectComponent} />);

  expect(screen.getByRole('definition')).toHaveTextContent('Dog; Fish');
});

test('Columns without labels are not rendered', () => {
  const columnComponent: ColumnsComponentSchema = {
    id: 'columns',
    key: 'columns',
    type: 'columns',
    columns: [],
  };

  render(<LabelValueRow name="" value={null} component={columnComponent} />);

  expect(screen.queryByRole('definition')).not.toBeInTheDocument();
  expect(screen.queryByRole('term')).not.toBeInTheDocument();
});

test('Number fields with zero values are displayed', () => {
  const numberComponent: NumberComponentSchema = {
    id: 'numberComponent',
    key: 'numberComponent',
    type: 'number',
    label: 'Number',
  };
  render(<LabelValueRow name="Number zero" value={0} component={numberComponent} />);
  expect(screen.getByRole('definition')).toHaveTextContent('0');
});

test('Currency fields with zero values are displayed', () => {
  const currencyComponent: CurrencyComponentSchema = {
    id: 'currencyComponent',
    key: 'currencyComponent',
    type: 'currency',
    label: 'Currency',
    currency: 'EUR',
  };
  render(<LabelValueRow name="Currency zero" value={0} component={currencyComponent} />);

  expect(screen.getByRole('definition')).toHaveTextContent('€ 0,00');
});

test.each([
  [true, 'Ja'],
  [false, 'Nee'],
])("Checkboxes are capitalised (value '%s' -> %s)", (value, text) => {
  const checkbox: CheckboxComponentSchema = {
    id: 'checkbox',
    key: 'checkbox',
    type: 'checkbox',
    label: 'Checkbox',
    defaultValue: false,
  };

  render(<LabelValueRow name="Checkbox" value={value} component={checkbox} />);

  expect(screen.getByRole('definition')).toHaveTextContent(text);
});
