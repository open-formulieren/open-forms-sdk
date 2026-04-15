import type {
  CheckboxComponentSchema,
  ColumnsComponentSchema,
  CurrencyComponentSchema,
  DateComponentSchema,
  NumberComponentSchema,
  SelectComponentSchema,
} from '@open-formulieren/types';
import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router';
import {expect, test} from 'vitest';
import {render as realRender} from 'vitest-browser-react';

import messagesNL from '@/i18n/compiled/nl.json';

import {LabelValueRow} from './FormStepSummary';

const render = async (ui: React.ReactNode) =>
  await realRender(
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

test('Unfilled dates displayed properly', async () => {
  const dateComponent: DateComponentSchema = {
    id: 'dateOfBirth',
    key: 'dateOfBirth',
    type: 'date',
    label: 'Date of birth',
  };

  const screen = await render(
    <LabelValueRow name="Date of birth" value="" component={dateComponent} />
  );

  await expect.element(screen.getByRole('definition')).toHaveTextContent('');
});

test('Multi-value select field displayed properly', async () => {
  const selectComponent: SelectComponentSchema = {
    id: 'selectPets',
    key: 'selectPets',
    type: 'select',
    label: 'Select pets',
    multiple: true,
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

  const screen = await render(
    <LabelValueRow name="Select Pets" value={['dog', 'fish']} component={selectComponent} />
  );

  await expect.element(screen.getByRole('definition')).toHaveTextContent('Dog; Fish');
});

test('Columns without labels are not rendered', async () => {
  const columnComponent: ColumnsComponentSchema = {
    id: 'columns',
    key: 'columns',
    type: 'columns',
    columns: [],
  };

  const screen = await render(<LabelValueRow name="" value={null} component={columnComponent} />);

  await expect.element(screen.getByRole('definition')).not.toBeInTheDocument();
  await expect.element(screen.getByRole('term')).not.toBeInTheDocument();
});

test('Number fields with zero values are displayed', async () => {
  const numberComponent: NumberComponentSchema = {
    id: 'numberComponent',
    key: 'numberComponent',
    type: 'number',
    label: 'Number',
  };
  const screen = await render(
    <LabelValueRow name="Number zero" value={0} component={numberComponent} />
  );
  await expect.element(screen.getByRole('definition')).toHaveTextContent('0');
});

test('Currency fields with zero values are displayed', async () => {
  const currencyComponent: CurrencyComponentSchema = {
    id: 'currencyComponent',
    key: 'currencyComponent',
    type: 'currency',
    label: 'Currency',
    currency: 'EUR',
  };
  const screen = await render(
    <LabelValueRow name="Currency zero" value={0} component={currencyComponent} />
  );

  await expect.element(screen.getByRole('definition')).toHaveTextContent('€ 0,00');
});

test.each([
  [true, 'Ja'],
  [false, 'Nee'],
])("Checkboxes are capitalised (value '%s' -> %s)", async (value, text) => {
  const checkbox: CheckboxComponentSchema = {
    id: 'checkbox',
    key: 'checkbox',
    type: 'checkbox',
    label: 'Checkbox',
    defaultValue: false,
  };

  const screen = await render(<LabelValueRow name="Checkbox" value={value} component={checkbox} />);

  await expect.element(screen.getByRole('definition')).toHaveTextContent(text);
});
