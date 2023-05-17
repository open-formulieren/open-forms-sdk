import {FormFieldDescription, FormLabel, Paragraph} from '@utrecht/component-library-react';
import {Field} from 'formik';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import Select from 'react-select';

import {getBEMClassName} from 'utils';

const SelectField = ({
  name,
  label = '',
  id = '',
  isRequired = false,
  description = '',
  disabled = false,
  invalid = false,
  options = [],
  valueProperty = 'value',
  ...props
}) => {
  const labelClassName = getBEMClassName('label', [isRequired && 'required'].filter(Boolean));
  return (
    <>
      <Paragraph className={labelClassName}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </Paragraph>
      <Field
        name={name}
        component={Select}
        inputId={id}
        components={{DropdownIndicator: () => null, IndicatorSeparator: () => null}}
        classNames={{
          control: state => {
            return getBEMClassName('rs-select', [
              state.isFocused && 'focus',
              disabled && 'disabled',
              invalid && 'invalid',
              isRequired && 'required',
            ]);
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
      />
      {description && <FormFieldDescription invalid={invalid}>{description}</FormFieldDescription>}
    </>
  );
};

export const SelectFieldPropTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  description: PropTypes.string,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  valueProperty: PropTypes.string,
};

SelectField.propTypes = {
  ...SelectFieldPropTypes,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SelectField;
