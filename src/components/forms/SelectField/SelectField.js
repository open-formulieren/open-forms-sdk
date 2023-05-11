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
  return (
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
    ></SelectAsync>
  );
};
