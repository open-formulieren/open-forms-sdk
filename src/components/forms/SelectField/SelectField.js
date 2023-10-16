import {FormField} from '@utrecht/component-library-react';
import classNames from 'classnames';
import {Field, useFormikContext} from 'formik';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {FormattedMessage} from 'react-intl';
import Select from 'react-select';

import {HelpText, Label, ValidationErrors, Wrapper} from 'components/forms';

const SelectField = ({
  name,
  label = '',
  id = '',
  isRequired = false,
  description = '',
  disabled = false,
  options = [],
  valueProperty = 'value',
  autoSelectOnlyOption = false,
  validateOnChange = false,
  onChange,
  ...props
}) => {
  const {getFieldProps, getFieldHelpers, getFieldMeta} = useFormikContext();
  const generatedId = React.useId();
  id = id || generatedId;

  const {error, touched} = getFieldMeta(name);
  const {value: formikValue} = getFieldProps(name);
  const {setValue, setTouched} = getFieldHelpers(name);

  const invalid = touched && !!error;

  // map the formik value back to the value object for react-select
  let value = undefined;
  const isSingle = !Array.isArray(formikValue);
  if (isSingle) {
    value = options.find(opt => opt[valueProperty] === formikValue) || null;
  } else {
    value = options.filter(opt => formikValue.includes(opt[valueProperty]));
  }

  useEffect(
    () => {
      if (!autoSelectOnlyOption) return;
      // do nothing if more than one option exists
      if (options.length !== 1) return;
      // do nothing if a value is set
      if ((isSingle && value) || (!isSingle && value.length > 1)) return;
      setValue(options[0][valueProperty]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autoSelectOnlyOption, isSingle, value, JSON.stringify(options), setValue, valueProperty]
  );

  // Taken from snippet posted in react-select issue:
  // https://github.com/JedWatson/react-select/issues/3562#issuecomment-518841754
  const handleKeyDown = evt => {
    switch (evt.key) {
      case 'Home':
        evt.preventDefault();
        if (evt.shiftKey) evt.target.selectionStart = 0;
        else evt.target.setSelectionRange(0, 0);
        break;
      case 'End':
        evt.preventDefault();
        const len = evt.target.value.length;
        if (evt.shiftKey) evt.target.selectionEnd = len;
        else evt.target.setSelectionRange(len, len);
        break;
      // no default
    }
  };

  return (
    <Wrapper>
      <FormField invalid={invalid} className="utrecht-form-field--openforms">
        <Label id={id} isRequired={isRequired} disabled={disabled}>
          {label}
        </Label>
        <Field
          name={name}
          component={Select}
          inputId={id}
          classNames={{
            control: state =>
              classNames('utrecht-select', 'utrecht-select--openforms', {
                'utrecht-select--focus': state.isFocused,
                'utrecht-select--focus-visible': state.isFocused,
                'utrecht-select--disabled': disabled,
                'utrecht-select--invalid': invalid,
                'utrecht-select--required': isRequired,
              }),
            menu: () => 'rs-menu',
            option: state =>
              classNames('rs-menu__option', {
                'rs-menu__option--focus': state.isFocused,
                'rs-menu__option--visible-focus': state.isFocused,
              }),
            singleValue: () => 'rs-value rs-value--single',
            multiValue: () => 'rs-value rs-value--multi',
            noOptionsMessage: () => 'rs-no-options',
          }}
          styles={{
            control: (baseStyles, state) => {
              return omit(baseStyles, 'outline');
            },
          }}
          unstyled
          options={options}
          getOptionValue={opt => opt[valueProperty]}
          isDisabled={disabled}
          loadingMessage={() => (
            <FormattedMessage
              description="(Async) select options loading message"
              defaultMessage="Loading..."
            />
          )}
          noOptionsMessage={() => (
            <FormattedMessage
              description="Select 'no options' message"
              defaultMessage="No results found"
            />
          )}
          onKeyDown={handleKeyDown}
          {...props}
          onChange={newValue => {
            const isSingle = !Array.isArray(newValue);
            const normalized = isSingle ? [newValue] : newValue;
            const rawValues = normalized.map(val => val?.[valueProperty] ?? null);
            const rawValue = isSingle ? rawValues[0] : rawValues;
            setValue(rawValue, validateOnChange);
            onChange?.({target: {name, value: rawValue}});
          }}
          value={value}
          onBlur={() => setTouched(true)}
        />
        <HelpText>{description}</HelpText>
        {touched && <ValidationErrors error={error} />}
      </FormField>
    </Wrapper>
  );
};

export const SelectFieldPropTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  description: PropTypes.node,
  disabled: PropTypes.bool,
  valueProperty: PropTypes.string,
  autoSelectOnlyOption: PropTypes.bool,
  validateOnChange: PropTypes.bool,
  /**
   * Optional additional onChange callback.
   */
  onChange: PropTypes.func,
};

SelectField.propTypes = {
  ...SelectFieldPropTypes,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SelectField;
