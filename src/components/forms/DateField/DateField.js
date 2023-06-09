import {FormField, Paragraph, Textbox} from '@utrecht/component-library-react';
import parse from 'date-fns/parse';
import {Field, useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {useIntl} from 'react-intl';

import FAIcon from 'components/FAIcon';
import {
  FloatingWidget,
  HelpText,
  Label,
  ValidationErrors,
  useFloatingWidget,
} from 'components/forms';
import {getBEMClassName} from 'utils';

import DatePickerCalendar from './DatePickerCalendar';

const parseDate = value => {
  if (!value) return undefined;
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  // Invalid Date is apparently a thing :ThisIsFine:
  if (isNaN(parsed)) return undefined;
  return parsed;
};

const DatePicker = ({name, onChange, id, calendarProps, ...extra}) => {
  const intl = useIntl();
  const {getFieldProps} = useFormikContext();
  const {
    refs,
    floatingStyles,
    context,
    getFloatingProps,
    getReferenceProps,
    isOpen,
    setIsOpen,
    arrowRef,
  } = useFloatingWidget();

  const calendarIconClassName = getBEMClassName('datepicker-textbox__calendar-toggle');
  const {value} = getFieldProps(name);
  const currentDate = parseDate(value);

  const {onFocus, ...referenceProps} = getReferenceProps();
  return (
    <>
      <Paragraph className={getBEMClassName('datepicker-textbox')}>
        <Textbox
          ref={refs.setReference}
          name={name}
          id={id}
          className="utrecht-textbox--openforms"
          autoComplete="off"
          placeholder={intl.formatMessage({
            description: 'Datepicker text input placeholder',
            // See open-formulieren/open-forms-sdk#433 for locale-aware formats support
            defaultMessage: 'yyyy-mm-dd',
          })}
          {...extra}
          onChange={onChange}
          onFocus={event => {
            onFocus(event);
            extra?.onFocus?.(event);
          }}
          {...referenceProps}
        />
        <FAIcon
          icon="calendar-days"
          extraClassName={calendarIconClassName}
          noAriaHidden
          aria-label={intl.formatMessage({
            description: 'Datepicker: accessible calendar toggle label',
            defaultMessage: 'Toggle calendar',
          })}
          aria-controls={referenceProps['aria-controls']}
          aria-expanded={referenceProps['aria-expanded']}
          aria-haspopup={referenceProps['aria-haspopup']}
          onClick={() => !isOpen && setIsOpen(true)}
        />
      </Paragraph>
      <FloatingWidget
        isOpen={isOpen}
        context={context}
        setFloating={refs.setFloating}
        floatingStyles={floatingStyles}
        getFloatingProps={getFloatingProps}
        arrowRef={arrowRef}
      >
        <DatePickerCalendar
          onCalendarClick={selectedDate => {
            // TODO: shouldn't this return a Date instance? -> question asked in nl-ds Slack
            const truncated = selectedDate.substring(0, 10);
            onChange({target: {name, value: truncated}});
            setIsOpen(false, {keepDismissed: true});
          }}
          currentDate={currentDate}
          {...calendarProps}
        />
      </FloatingWidget>
    </>
  );
};

DatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  calendarProps: PropTypes.shape({
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    events: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
        emphasis: PropTypes.bool,
        selected: PropTypes.bool,
        disabled: PropTypes.bool,
      })
    ),
  }),
};

/**
 * Implements a form field to select dates.
 *
 * For accessibility reasons, there should always be a text field allowing users to
 * manually type in the date. However, when the field is focused, this toggles the
 * calendar where a date can be selected using a pointer device.
 *
 * TODO: on mobile devices, use the native date picker?
 * TODO: add prop/option to use a split date field for day/month/year? See
 * https://design-system.service.gov.uk/patterns/dates/
 * TODO: when typing in the value, use the pattern/mask approach like form.io?
 *
 * NL DS tickets:
 *  - https://github.com/nl-design-system/backlog/issues/189
 *  - https://github.com/nl-design-system/backlog/issues/188
 *  - https://github.com/nl-design-system/backlog/issues/35#issuecomment-1547704753
 *
 * Other references: https://medium.com/samsung-internet-dev/making-input-type-date-complicated-a544fd27c45a
 */
const DateField = ({
  name,
  label = '',
  isRequired = false,
  description = '',
  id = '',
  disabled = false,
  minDate,
  maxDate,
  disabledDates = [],
}) => {
  const {getFieldMeta} = useFormikContext();
  const {error} = getFieldMeta(name);
  const invalid = !!error;

  const generatedId = React.useId();
  id = id || generatedId;

  const calendarEvents = disabledDates.map(date => ({
    date: date,
    emphasis: false,
    selected: false,
    disabled: true,
  }));

  return (
    <FormField type="text" invalid={invalid} className="utrecht-form-field--openforms">
      <Label id={id} isRequired={isRequired} disabled={disabled}>
        {label}
      </Label>
      <Field
        as={DatePicker}
        name={name}
        id={id}
        disabled={disabled}
        invalid={invalid}
        calendarProps={{minDate, maxDate, events: calendarEvents}}
      />
      <HelpText>{description}</HelpText>
      <ValidationErrors error={error} />
    </FormField>
  );
};

DateField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  description: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  disabledDates: PropTypes.arrayOf(PropTypes.string),
};

export default DateField;
