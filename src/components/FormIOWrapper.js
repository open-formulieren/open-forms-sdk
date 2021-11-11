import React from 'react';
import { Form } from 'react-formio';
import _ from 'lodash';

const FormIOWrapper = React.forwardRef((props, ref) => {
  const updatedProps = {...props, submission: _.cloneDeep(props.submission)};
  return (<Form {...updatedProps} ref={ref} />);
});

export default FormIOWrapper;
