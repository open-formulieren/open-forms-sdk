import RenderSettingsProvider from '@open-formulieren/formio-renderer/components/RendererSettingsProvider';
import {Document} from '@utrecht/component-library-react';
import {Formik} from 'formik';
import merge from 'lodash/merge';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm} from 'api-mocks';
import Card from 'components/Card';
import {LiteralsProvider} from 'components/Literal';
import {SubmissionStatusContext} from 'components/PostCompletionViews';
import {AnalyticsToolsConfigContext} from 'components/analytics/AnalyticsToolConfigProvider';
import {ModalContext} from 'components/modals/Modal';

export const ConfigDecorator = (Story, {parameters}) => {
  const defaults = {
    baseUrl: BASE_URL,
    basePath: '',
    baseTitle: '',
    requiredFieldsWithAsterisk: true,
  };
  const fromParams = parameters?.config || {};
  const value = merge(defaults, fromParams);
  return (
    <ConfigContext.Provider value={value}>
      <RenderSettingsProvider requiredFieldsWithAsterisk={value.requiredFieldsWithAsterisk}>
        <Story />
      </RenderSettingsProvider>
    </ConfigContext.Provider>
  );
};

export const AnalyticsToolsDecorator = (Story, {parameters}) => {
  const defaults = {
    govmetricSourceIdFormFinished: '',
    govmetricSourceIdFormAborted: '',
    govmetricSecureGuidFormFinished: '',
    govmetricSecureGuidFormAborted: '',
    enableGovmetricAnalytics: false,
  };

  return (
    <AnalyticsToolsConfigContext.Provider value={{...defaults, ...parameters.analyticsToolsParams}}>
      <Story />
    </AnalyticsToolsConfigContext.Provider>
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
