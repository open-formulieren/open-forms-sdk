import {FormLabel, Paragraph, Textbox} from '@utrecht/component-library-react';
import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import {forwardRef, useId, useState} from 'react';
import {FormattedDate, FormattedMessage, useIntl} from 'react-intl';

import {InputGroup, InputGroupItem} from 'components/forms';

import {useDateLocaleMeta} from './hooks';
import {PART_PLACEHOLDERS} from './messages';
import {convertMonth, dateFromParts, orderByPart, parseDate} from './utils';

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

DatePartInput.displayName = 'DatePartInput';

DatePartInput.propTypes = {
  name: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const DateInputs = ({day, month, year, disabled, onChange, onBlur, autoComplete}) => {
  const intl = useIntl();
  const meta = useDateLocaleMeta();
  const [dayId, monthId, yearId] = [useId(), useId(), useId()];
  // see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
  const isBdayAutoComplete = autoComplete === 'bday';
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
          placeholder={intl.formatMessage(PART_PLACEHOLDERS.day)}
          id={dayId}
          onBlur={onBlur}
          autoComplete={isBdayAutoComplete ? 'bday-day' : undefined}
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
          placeholder={intl.formatMessage(PART_PLACEHOLDERS.month)}
          id={monthId}
          onBlur={onBlur}
          autoComplete={isBdayAutoComplete ? 'bday-month' : undefined}
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
          placeholder={intl.formatMessage(PART_PLACEHOLDERS.year)}
          id={yearId}
          onBlur={onBlur}
          autoComplete={isBdayAutoComplete ? 'bday-year' : undefined}
        />
      </InputGroupItem>
    ),
  };
  const orderedParts = orderByPart(parts, meta);
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
  autoComplete: PropTypes.string,
  onBlur: PropTypes.func,
};

const DateInputGroup = ({
  name,
  label,
  isRequired,
  onChange,
  extraOnChange,
  disabled = false,
  showFormattedDate = false,
  autoComplete,
}) => {
  const {getFieldProps, getFieldMeta, getFieldHelpers} = useFormikContext();
  const {value} = getFieldProps(name);
  const {error} = getFieldMeta(name);
  const {setTouched} = getFieldHelpers(name);
  const currentDate = parseDate(value);

  // keep in mind the first month is 0 in JS...
  const [dateParts, setDateParts] = useState({
    year: currentDate ? String(currentDate.getFullYear()) : '',
    month: currentDate ? convertMonth(currentDate.getMonth(), 1) : '',
    day: currentDate ? String(currentDate.getDate()) : '',
  });

  const enteredDate = dateFromParts(dateParts.year, dateParts.month, dateParts.day);

  const onPartChange = event => {
    const {
      target: {name: partName, value},
    } = event;
    const newDateParts = {...dateParts, [partName]: value};
    // update internal state
    setDateParts(newDateParts);

    // calculate the nw formik state value for the "composite" field
    const {year, month, day} = newDateParts;
    const newDate = dateFromParts(year, month, day);

    // clear value if it's not a valid date or update it if it is valid
    const _event = {target: {name, value: newDate ?? ''}};
    onChange(_event);
    extraOnChange?.(_event);
  };

  return (
    <>
      <InputGroup label={label} isRequired={isRequired} disabled={disabled} invalid={!!error}>
        <DateInputs
          year={dateParts.year}
          month={dateParts.month}
          day={dateParts.day}
          disabled={disabled}
          onChange={onPartChange}
          autoComplete={autoComplete}
          onBlur={() => setTouched(true)}
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
  extraOnChange: PropTypes.func,
  disabled: PropTypes.bool,
  showFormattedDate: PropTypes.bool,
  autoComplete: PropTypes.string,
};

export default DateInputGroup;
