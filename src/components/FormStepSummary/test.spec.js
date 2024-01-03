import {render, screen} from '@testing-library/react';
import messagesNL from 'i18n/compiled/nl.json';
import React from 'react';
import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router-dom';

import {testEmptyFields} from './fixtures';
import FormStepSummary, {LabelValueRow} from './index';

const Wrap = ({children}) => (
  <IntlProvider locale="nl" messages={messagesNL}>
    <MemoryRouter>{children}</MemoryRouter>
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

it('Unfilled dates displayed properly', () => {
  const dateComponent = {
    key: 'dateOfBirth',
    type: 'date',
    format: 'dd-MM-yyyy',
  };

  render(<LabelValueRow name="Date of birth" value="" component={dateComponent} />);

  expect(screen.getByRole('definition')).toHaveTextContent('');
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

  render(
    <Wrap>
      <LabelValueRow name="Select Pets" value={['dog', 'fish']} component={selectBoxesComponent} />
    </Wrap>
  );

  expect(screen.getByRole('definition')).toHaveTextContent('Dog; Fish');
});

it.each(testEmptyFields)('Empty fields (%s)', dataEntry => {
  render(
    <Wrap>
      <FormStepSummary name="Form Step 1" slug="fs-1" editStepText="Change" data={[dataEntry]} />
    </Wrap>
  );

  expect(screen.getByRole('definition')).toHaveTextContent('');
});

it('Columns without labels are not rendered', () => {
  const columnComponent = {
    key: 'columns',
    type: 'columns',
    columns: [],
  };

  render(<LabelValueRow name="" value={null} component={columnComponent} />);

  expect(screen.queryByRole('definition')).not.toBeInTheDocument();
  expect(screen.queryByRole('term')).not.toBeInTheDocument();
});

it('Number fields with zero values are displayed', () => {
  const numberComponent = {
    key: 'numberComponent',
    type: 'number',
    multiple: false,
  };
  render(
    <Wrap>
      <LabelValueRow name="Number zero" value={0} component={numberComponent} />
    </Wrap>
  );
  expect(screen.getByRole('definition')).toHaveTextContent('0');
});

it('Currency fields with zero values are displayed', () => {
  const numberComponent = {
    key: 'currencyComponent',
    type: 'currency',
    multiple: false,
  };
  render(
    <Wrap>
      <LabelValueRow name="Currency zero" value={0} component={numberComponent} />
    </Wrap>
  );

  expect(screen.getByRole('definition')).toHaveTextContent('€ 0,00');
});

it.each([
  [true, 'Ja'],
  [false, 'Nee'],
])("Checkboxes are capitalised (value '%s' -> %s)", (value, text) => {
  const checkbox = {
    key: 'checkbox',
    type: 'checkbox',
  };

  render(
    <Wrap>
      <LabelValueRow name="Date of birth" value={value} component={checkbox} />
    </Wrap>
  );

  expect(screen.getByRole('definition')).toHaveTextContent(text);
});
