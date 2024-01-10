import {Document} from '@utrecht/component-library-react';
import {Formik} from 'formik';
import merge from 'lodash/merge';
import {MemoryRouter, Route, Routes} from 'react-router-dom';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm} from 'api-mocks';
import Card from 'components/Card';
import {LiteralsProvider} from 'components/Literal';
import {SubmissionStatusContext} from 'components/PostCompletionViews';

export const ConfigDecorator = (Story, {parameters}) => {
  const defaults = {
    baseUrl: BASE_URL,
    basePath: '',
    baseTitle: '',
    requiredFieldsWithAsterisk: true,
    displayComponents: {
      app: null,
      form: null,
      progressIndicator: null,
      loginOptions: null,
    },
  };
  const fromParams = parameters?.config || {};
  return (
    <ConfigContext.Provider value={merge(defaults, fromParams)}>
      <Story />
    </ConfigContext.Provider>
  );
};

const RouterStoryWrapper = ({route = '', children}) => {
  if (!route) {
    return <>{children}</>;
  }
  return (
    <Routes>
      <Route path={route} element={children} />
    </Routes>
  );
};

export const DeprecatedRouterDecorator = (Story, {args: {routerArgs = {}}}) => {
  const {route, ...rest} = routerArgs;
  return (
    <MemoryRouter {...rest}>
      <RouterStoryWrapper route={route}>
        <Story />
      </RouterStoryWrapper>
    </MemoryRouter>
  );
};

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

export const withUtrechtDocument = (Story, {parameters}) => (
  <Document style={{'--utrecht-space-around': parameters?.utrechtDocument?.spaceAround ?? 1}}>
    <Story />
  </Document>
);

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

export const withSubmissionPollInfo = (Story, {parameters, args}) => {
  return (
    <SubmissionStatusContext.Provider
      value={{
        publicReference: args.publicReference,
        paymentUrl: args.paymentUrl,
        reportDownloadUrl: args.reportDownloadUrl,
        confirmationPageContent: args.confirmationPageContent,
        mainWebsiteUrl: args.mainWebsiteUrl,
      }}
    >
      <Story />
    </SubmissionStatusContext.Provider>
  );
};
