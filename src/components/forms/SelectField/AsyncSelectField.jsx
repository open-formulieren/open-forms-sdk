import PropTypes from 'prop-types';
import React from 'react';
import {useAsync} from 'react-use';

import SelectField, {SelectFieldPropTypes} from './SelectField';

const AsyncSelectField = ({getOptions, ...props}) => {
  const {loading, error, value: options} = useAsync(getOptions, [getOptions]);
  // re-throw any error, it's up to the error boundary to handle it
  if (error) {
    throw error;
  }
  return <SelectField options={options || []} isLoading={loading} {...props} />;
};

AsyncSelectField.propTypes = {
  ...SelectFieldPropTypes,
  getOptions: PropTypes.func.isRequired,
};

export default AsyncSelectField;
