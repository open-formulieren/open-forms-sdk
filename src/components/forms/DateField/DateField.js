import {FormField} from '@utrecht/component-library-react';
import {Field, useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import {HelpText, ValidationErrors, Wrapper} from 'components/forms';

import DateInputGroup from './DateInputGroup';
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

  return (
    <Wrapper>
      <FormField type="text" invalid={invalid} className="utrecht-form-field--openforms">
        <Field
          as={Widget}
          name={name}
          label={label}
          isRequired={isRequired}
          id={id}
          disabled={disabled}
          invalid={invalid}
          {...fieldProps}
        />
        <HelpText>{description}</HelpText>
        <ValidationErrors error={error} />
      </FormField>
    </Wrapper>
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
};

export default DateField;
