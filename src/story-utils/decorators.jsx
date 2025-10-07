import {Formik} from 'formik';

import {FormContext} from 'Context';
import {buildForm} from 'api-mocks';
import Card from 'components/Card';
import {LiteralsProvider} from 'components/Literal';
import {SubmissionStatusContext} from 'components/PostCompletionViews';
import {ModalContext} from 'components/modals/Modal';

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

const PaddedDiv = ({className, children, style = {}}) => (
  <div style={{padding: '15px 0', ...style}} className={className}>
    {children}
  </div>
);

export const LayoutDecorator = Story => {
  return (
    <PaddedDiv style={{backgroundColor: '#e6e6e6', paddingInline: '15px'}}>
      <Story />
    </PaddedDiv>
  );
};

export const withCard = (Story, {parameters: {card: cardProps = {}}}) => (
  <Card {...cardProps}>
    <Story />
  </Card>
);

export const withForm = (Story, {parameters, args}) => {
  const form = args?.form || parameters?.formContext?.form || buildForm();
  return (
    <FormContext.Provider value={form}>
      <Story />
    </FormContext.Provider>
  );
};

export const withSubmissionPollInfo = (Story, {args}) => {
  return (
    <SubmissionStatusContext.Provider
      value={{
        publicReference: args.publicReference,
        paymentUrl: args.paymentUrl,
        reportDownloadUrl: args.reportDownloadUrl,
        confirmationPageTitle: args.confirmationPageTitle,
        confirmationPageContent: args.confirmationPageContent,
        mainWebsiteUrl: args.mainWebsiteUrl,
      }}
    >
      <Story />
    </SubmissionStatusContext.Provider>
  );
};

export const withModalDecorator = Story => (
  <ModalContext.Provider
    value={{
      // only for storybook integration, do not use this in real apps!
      parentSelector: () => document.getElementById('storybook-root'),
      ariaHideApp: false,
    }}
  >
    <Story />
  </ModalContext.Provider>
);
