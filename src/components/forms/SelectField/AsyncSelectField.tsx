import {SelectField} from '@open-formulieren/formio-renderer';
import type {Option} from '@open-formulieren/formio-renderer/components/forms/Select/Select.js';
import {useAsync} from 'react-use';

export interface AsyncSelectFieldProps<OptionT extends Option>
  extends Omit<React.ComponentProps<typeof SelectField>, 'options'> {
  getOptions: () => Promise<OptionT[]>;
}

function AsyncSelectField<OptionT extends Option>({
  getOptions,
  ...props
}: AsyncSelectFieldProps<OptionT>) {
  const {loading, error, value: options = []} = useAsync(getOptions, [getOptions]);
  // re-throw any error, it's up to the error boundary to handle it
  if (error) {
    throw error;
  }
  return <SelectField options={options} isLoading={loading} {...props} />;
}

export default AsyncSelectField;
