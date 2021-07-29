import React from 'react';
import { Form } from 'react-formio';

const FormIOWrapper = React.forwardRef((props, ref) => (
  <Form {...props} ref={ref} />
));

export default FormIOWrapper;
