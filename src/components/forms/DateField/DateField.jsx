import {
  HelpText,
  DateField as RendererDateField,
  ValidationErrors,
} from '@open-formulieren/formio-renderer';
import {FormField} from '@utrecht/component-library-react';
import {Field, useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import DatePicker from './DatePicker';

/**
 * Implements a form field to select dates.
 *
 * For accessibility reasons, there should always be a text field allowing users to
 * manually type in the date. However, when the field is focused, this toggles the
 * calendar where a date can be selected using a pointer device.
 *
 * The input group widget is implemented in the renderer package, the date picker not
 * yet, so if the input group widget is specified, we defer to the existing component.
 *
 * TODO: on mobile devices, use the native date picker?
 * TODO: when typing in the value, use the pattern/mask approach like form.io?
 */
const DatepickerDateField = ({
  name,
  label = '',
  isRequired = false,
  description = '',
  id = '',
  disabled = false,
  minDate,
  maxDate,
  disabledDates = [],
  onChange,
  ...props
}) => {
  const {getFieldMeta} = useFormikContext();
  const {error, touched} = getFieldMeta(name);
  const invalid = touched && !!error;

  const generatedId = React.useId();
  id = id || generatedId;

  const calendarEvents = disabledDates.map(date => ({
    date: date,
    emphasis: false,
    selected: false,
    disabled: true,
  }));
  const errorMessageId = invalid ? `${id}-error-message` : undefined;

  return (
    <FormField type="text" invalid={invalid} className="utrecht-form-field--openforms">
      <Field
        as={DatePicker}
        name={name}
        label={label}
        isRequired={isRequired}
        id={id}
        disabled={disabled}
        invalid={invalid}
        extraOnChange={onChange}
        aria-describedby={errorMessageId}
        calendarProps={{minDate, maxDate, events: calendarEvents}}
        {...props}
      />
      <HelpText>{description}</HelpText>
      {touched && <ValidationErrors error={error} id={errorMessageId} />}
    </FormField>
  );
};

DatepickerDateField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  isRequired: PropTypes.bool,
  description: PropTypes.node,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  disabledDates: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export const WIDGETS = ['datepicker', 'inputGroup'];

// Temporary wrapper until the calendar/date picker is also supported in the renderer.
const DateFieldWrapper = ({widget = 'inputGroup', ...props}) => {
  if (widget === 'inputGroup') {
    return <RendererDateField widget={widget} {...props} />;
  }
  return <DatepickerDateField widget={widget} {...props} />;
};

DateFieldWrapper.propTypes = {
  widget: PropTypes.oneOf(WIDGETS),
};

export default DateFieldWrapper;
