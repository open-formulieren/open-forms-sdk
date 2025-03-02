import {HelpText, ValidationErrors} from '@open-formulieren/formio-renderer';
import DateInputGroup from '@open-formulieren/formio-renderer/components/forms/DateField/DateInputGroup';
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
 * TODO: on mobile devices, use the native date picker?
 * TODO: when typing in the value, use the pattern/mask approach like form.io?
 */
const DateField = ({
  name,
  label = '',
  isRequired = false,
  description = '',
  id = '',
  disabled = false,
  widget = 'inputGroup',
  minDate,
  maxDate,
  disabledDates = [],
  showFormattedDate = false,
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

  let Widget = DateInputGroup;
  let fieldProps = {};
  switch (widget) {
    case 'datepicker': {
      Widget = DatePicker;
      fieldProps = {
        calendarProps: {minDate, maxDate, events: calendarEvents},
      };
      break;
    }
    default:
    case 'inputGroup': {
      Widget = DateInputGroup;
      fieldProps = {showFormattedDate};
      break;
    }
  }
  const errorMessageId = invalid ? `${id}-error-message` : undefined;

  return (
    <FormField type="text" invalid={invalid} className="utrecht-form-field--openforms">
      <Field
        as={Widget}
        name={name}
        label={label}
        isRequired={isRequired}
        id={id}
        disabled={disabled}
        invalid={invalid}
        extraOnChange={onChange}
        aria-describedby={errorMessageId}
        {...fieldProps}
        {...props}
      />
      <HelpText>{description}</HelpText>
      {touched && <ValidationErrors error={error} id={errorMessageId} />}
    </FormField>
  );
};

export const WIDGETS = ['datepicker', 'inputGroup'];

DateField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  isRequired: PropTypes.bool,
  description: PropTypes.node,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  disabledDates: PropTypes.arrayOf(PropTypes.string),
  widget: PropTypes.oneOf(WIDGETS),
  showFormattedDate: PropTypes.bool,
  onChange: PropTypes.func,
};

export default DateField;
