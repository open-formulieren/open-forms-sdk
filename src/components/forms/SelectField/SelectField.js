import {FormField, FormFieldDescription} from '@utrecht/component-library-react';
import {Field, useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import Select from 'react-select';

import {Label, ValidationErrors} from 'components/forms';
import {getBEMClassName} from 'utils';

const SelectField = ({
  name,
  label = '',
  id = '',
  isRequired = false,
  description = '',
  disabled = false,
  options = [],
  valueProperty = 'value',
  ...props
}) => {
  const {getFieldProps, getFieldHelpers, getFieldMeta} = useFormikContext();
  const generatedId = React.useId();
  id = id || generatedId;

  const {error} = getFieldMeta(name);
  const {value: formikValue} = getFieldProps(name);
  const {setValue} = getFieldHelpers(name);

  const invalid = !!error;

  // map the formik value back to the value object for react-select
  let value = undefined;
  const isSingle = !Array.isArray(formikValue);
  if (isSingle) {
    value = options.find(opt => opt[valueProperty] === formikValue) || null;
  } else {
    value = options.filter(opt => formikValue.includes(opt[valueProperty]));
  }

  return (
    <FormField invalid={invalid} className="utrecht-form-field--openforms">
      <Label id={id} isRequired={isRequired} disabled={disabled}>
        {label}
      </Label>
      <Field
        name={name}
        component={Select}
        inputId={id}
        components={{DropdownIndicator: () => null, IndicatorSeparator: () => null}}
        classNames={{
          control: state => {
            const ofClassname = getBEMClassName(
              'rs-select',
              [
                state.isFocused && 'focus',
                disabled && 'disabled',
                invalid && 'invalid',
                isRequired && 'required',
              ].filter(Boolean)
            );
            return ['utrecht-select', ofClassname].join(' ');
          },
          menu: () => {
            return getBEMClassName('rs-select-menu');
          },
          option: state => {
            return getBEMClassName('rs-select-option', [state.isFocused && 'focus']);
          },
        }}
        options={options}
        getOptionValue={opt => opt[valueProperty]}
        unstyled
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
        {...props}
        onChange={newValue => {
          const isSingle = !Array.isArray(newValue);
          const normalized = isSingle ? [newValue] : newValue;
          const rawValues = normalized.map(val => val?.[valueProperty] ?? null);
          const rawValue = isSingle ? rawValues[0] : rawValues;
          setValue(rawValue);
        }}
        value={value}
      />
      {description && <FormFieldDescription>{description}</FormFieldDescription>}
      <ValidationErrors error={error} />
    </FormField>
  );
};

export const SelectFieldPropTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  description: PropTypes.string,
  disabled: PropTypes.bool,
  valueProperty: PropTypes.string,
};

SelectField.propTypes = {
  ...SelectFieldPropTypes,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SelectField;
