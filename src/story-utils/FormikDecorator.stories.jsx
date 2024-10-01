import {Field} from 'formik';

import {FormikDecorator} from './decorators';

export default {
  title: 'Private API / Story Utils / FormikDecorator',
  decorators: [FormikDecorator],
  parameters: {
    controls: {hideNoControlsWarning: true},
    formik: {
      initialValues: {test: 'some value'},
      initialErrors: {test: 'an error'},
    },
  },
};

export const Default = {
  render: () => (
    <>
      <p>The field state is managed with Formik</p>
      <Field type="text" as="input" name="test" />
    </>
  ),
};
