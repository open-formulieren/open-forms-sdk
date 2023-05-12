import {FormFieldDescription, FormLabel, Paragraph} from '@utrecht/component-library-react';
import SelectAsync from 'react-select';

import {getBEMClassName} from '../../../utils';

export const SelectField = ({
  label = '',
  id = '',
  isRequired = false,
  description = '',
  disabled = false,
  invalid = false,
  options = [],
}) => {
  const labelClassName = getBEMClassName('label', [isRequired && 'required'].filter(Boolean));

  return (
    <>
      <Paragraph className={labelClassName}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </Paragraph>
      <SelectAsync
        inputId={id}
        name={id}
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
        unstyled
        isDisabled={disabled}
      ></SelectAsync>
      {description && <FormFieldDescription invalid={invalid}>{description}</FormFieldDescription>}
    </>
  );
};
