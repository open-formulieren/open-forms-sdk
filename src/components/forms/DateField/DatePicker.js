import {Paragraph, Textbox} from '@utrecht/component-library-react';
import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {useIntl} from 'react-intl';

import FAIcon from 'components/FAIcon';
import {FloatingWidget, Label, useFloatingWidget} from 'components/forms';
import {getBEMClassName} from 'utils';

import DatePickerCalendar from './DatePickerCalendar';
import {parseDate} from './utils';

const DatePicker = ({name, label, isRequired, onChange, id, disabled, calendarProps, ...extra}) => {
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
      <Label id={id} isRequired={isRequired} disabled={disabled}>
        {label}
      </Label>
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
  label: PropTypes.node,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  disabled: PropTypes.bool,
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

export default DatePicker;
