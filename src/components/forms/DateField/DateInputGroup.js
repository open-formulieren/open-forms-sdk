import {FormLabel, Paragraph, Textbox} from '@utrecht/component-library-react';
import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React, {forwardRef, useEffect, useId, useMemo, useState} from 'react';
import {FormattedDate, FormattedMessage, useIntl} from 'react-intl';

import {InputGroup, InputGroupItem} from 'components/forms';

import {useDateLocaleMeta} from './hooks';
import {convertMonth, dateFromParts, parseDate} from './utils';

const DatePartInput = forwardRef(({name, value, onChange, ...props}, ref) => (
  <Textbox
    ref={ref}
    name={name}
    inputMode="numeric"
    value={value}
    onChange={onChange}
    className={`utrecht-textbox--openforms utrecht-textbox--openforms-date-${name}`}
    {...props}
  />
));

DatePartInput.propTypes = {
  name: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const DateInputs = ({day, month, year, disabled, onChange}) => {
  const intl = useIntl();
  const meta = useDateLocaleMeta();
  const [dayId, monthId, yearId] = [useId(), useId(), useId()];
  const parts = {
    day: (
      <InputGroupItem key="day">
        <FormLabel htmlFor={dayId} disabled={disabled} className="openforms-input-group__label">
          <FormattedMessage description="Date input group: day label" defaultMessage="Day" />
        </FormLabel>
        <DatePartInput
          name="day"
          disabled={disabled}
          value={day}
          onChange={onChange}
          placeholder={intl.formatMessage({
            description: 'Placeholder for day part of a date',
            defaultMessage: 'd',
          })}
          id={dayId}
        />
      </InputGroupItem>
    ),
    month: (
      <InputGroupItem key="month">
        <FormLabel htmlFor={monthId} disabled={disabled} className="openforms-input-group__label">
          <FormattedMessage description="Date input group: month label" defaultMessage="Month" />
        </FormLabel>
        <DatePartInput
          name="month"
          disabled={disabled}
          value={month}
          onChange={onChange}
          placeholder={intl.formatMessage({
            description: 'Placeholder for month part of a date',
            defaultMessage: 'm',
          })}
          id={monthId}
        />
      </InputGroupItem>
    ),
    year: (
      <InputGroupItem key="year">
        <FormLabel htmlFor={yearId} disabled={disabled} className="openforms-input-group__label">
          <FormattedMessage description="Date input group: year label" defaultMessage="Year" />
        </FormLabel>
        <DatePartInput
          name="year"
          disabled={disabled}
          value={year}
          onChange={onChange}
          placeholder={intl.formatMessage({
            description: 'Placeholder for year part of a date',
            defaultMessage: 'yyyy',
          })}
          id={yearId}
        />
      </InputGroupItem>
    ),
  };
  const orderedParts = Object.keys(parts)
    .sort((a, b) => meta[a] - meta[b])
    .map(part => parts[part]);
  return <>{orderedParts}</>;
};

DateInputs.propTypes = {
  day: PropTypes.string.isRequired,
  /**
   * Month part of the date. Keep in mind that this is the JS date month, so January is '0'.
   */
  month: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

const DateInputGroup = ({
  name,
  label,
  isRequired,
  onChange,
  id,
  disabled = false,
  showFormattedDate = false,
}) => {
  const {getFieldProps, getFieldMeta} = useFormikContext();
  const {value} = getFieldProps(name);
  const {error} = getFieldMeta(name);
  const currentDate = parseDate(value);

  // keep in mind the first month is 0 in JS...
  const [dateParts, setDateParts] = useState({
    year: currentDate ? String(currentDate.getFullYear()) : '',
    month: currentDate ? convertMonth(currentDate.getMonth(), 1) : '',
    day: currentDate ? String(currentDate.getDate()) : '',
  });

  const enteredDate = dateFromParts(dateParts.year, dateParts.month, dateParts.day);
  useEffect(() => {
    if (!enteredDate || enteredDate === value) return;
    onChange({target: {name, value: enteredDate}});
  }, [onChange, name, value, enteredDate]);

  return (
    <>
      <InputGroup label={label} isRequired={isRequired} disabled={disabled} invalid={!!error}>
        <DateInputs
          year={dateParts.year}
          month={dateParts.month}
          day={dateParts.day}
          disabled={disabled}
          onChange={({target: {name, value}}) => setDateParts({...dateParts, [name]: value})}
        />
      </InputGroup>
      {showFormattedDate && (
        <Paragraph style={{marginTop: '8px'}}>
          <FormattedDate value={parseDate(enteredDate)} year="numeric" month="long" day="numeric" />
        </Paragraph>
      )}
    </>
  );
};

DateInputGroup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  showFormattedDate: PropTypes.bool,
};

export default DateInputGroup;
