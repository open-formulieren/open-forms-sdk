import {DateField} from '@open-formulieren/formio-renderer';
import {render, screen} from '@testing-library/react';
import {Formik} from 'formik';
import messagesNL from 'i18n/compiled/nl.json';
import {IntlProvider} from 'react-intl';

const Wrapper = ({initialValues, children}) => (
  <IntlProvider locale="nl" messages={messagesNL}>
    <Formik initialValues={initialValues}>{children}</Formik>
  </IntlProvider>
);

describe('The date input group', () => {
  it('renders dates as d/m/Y in NL locale', () => {
    render(
      <Wrapper initialValues={{aDate: '2023-07-25'}}>
        <DateField name="aDate" widget="inputGroup" />
      </Wrapper>
    );

    const inputNames = screen.getAllByRole('textbox').map(i => i.name);
    expect(inputNames).toEqual(['day', 'month', 'year']);
    expect(screen.getByLabelText('Dag')).toHaveDisplayValue('25');
    expect(screen.getByLabelText('Maand')).toHaveDisplayValue('7');
    expect(screen.getByLabelText('Jaar')).toHaveDisplayValue('2023');
  });

  it('handles January correctly', () => {
    render(
      <Wrapper initialValues={{aDate: '2023-01-01'}}>
        <DateField name="aDate" widget="inputGroup" />
      </Wrapper>
    );

    expect(screen.getByLabelText('Dag')).toHaveDisplayValue('1');
    expect(screen.getByLabelText('Maand')).toHaveDisplayValue('1');
    expect(screen.getByLabelText('Jaar')).toHaveDisplayValue('2023');
  });
});
