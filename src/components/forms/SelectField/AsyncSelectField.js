import React from 'react';
import {useAsync} from 'react-use';

import {SelectField} from './SelectField';

const withOptions = WrappedComponent => {
  return ({optionsRetriever, ...props}) => {
    const {loading, error, value: options} = useAsync(optionsRetriever);

    if (loading) {
      return (
        <WrappedComponent
          options={[{label: 'Loading...', value: null}]} // Display loading message
          {...props}
        />
      );
    }

    if (error) {
      return <div>Error loading options: {error.message}</div>; // Display error message
    }

    return <WrappedComponent options={options} {...props} />;
  };
};

const AsyncSelectField = withOptions(SelectField);

export default AsyncSelectField;
