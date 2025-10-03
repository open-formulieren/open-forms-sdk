import {Formik} from 'formik';

import {LiteralsProvider} from 'components/Literal';

export const FormikDecorator = (Story, context) => {
  const isDisabled = context.parameters?.formik?.disable ?? false;
  if (isDisabled) {
    return <Story />;
  }
  const initialValues = context.parameters?.formik?.initialValues || {};
  const initialErrors = context.parameters?.formik?.initialErrors || {};
  const initialTouched = context.parameters?.formik?.initialTouched || {};
  const wrapForm = context.parameters?.formik?.wrapForm ?? true;
  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      initialTouched={initialTouched}
      enableReinitialize
      onSubmit={(values, formikHelpers) => console.log(values, formikHelpers)}
    >
      {wrapForm ? (
        <form>
          <Story />
        </form>
      ) : (
        <Story />
      )}
    </Formik>
  );
};

export const LiteralDecorator = (Story, {args}) => (
  <LiteralsProvider
    literals={{
      previousText: {
        resolved: args.previousText || 'Previous',
      },
      saveText: {resolved: 'Save', value: ''},
      nextText: {resolved: 'Next', value: ''},
      beginText: {
        resolved: args.beginText || 'Start',
      },
      changeText: {
        resolved: args.changeText || 'Change',
      },
      confirmText: {
        resolved: args.confirmText || 'Confirm',
      },
    }}
  >
    <Story />
  </LiteralsProvider>
);
