import FormSettingsProvider from '@open-formulieren/formio-renderer/components/FormSettingsProvider.js';
import ModalContext from '@open-formulieren/formio-renderer/components/modal/context.js';
import type {AnyComponentSchema} from '@open-formulieren/types';
import type {Decorator} from '@storybook/react-vite';
import {Document} from '@utrecht/component-library-react';
import {Formik} from 'formik';
import React from 'react';

import {ConfigContext, FormContext} from '@/Context';
import type {ConfigContextType} from '@/Context';
import {BASE_URL, buildForm} from '@/api-mocks';
import Card from '@/components/Card';
import {LiteralsProvider} from '@/components/Literal';
import {SubmissionStatusContext} from '@/components/PostCompletionViews';
import {AnalyticsToolsConfigContext} from '@/components/analytics/AnalyticsToolConfigProvider';
import type {AnalyticsToolsConfig} from '@/components/analytics/AnalyticsToolConfigProvider';
import type {Form} from '@/data/forms';

import {setupGeolocationMock} from './mocks/geolocationMock';

/**
 * Storybook does not have a before/after cleanup cycle, and localStorage would in
 * these situations break story/test isolation.
 *
 * Also, the submission ID is persisted in the sessionStorage once a submission is started, and we
 * need to clear it for stories.
 *
 * This decorator is applied to every story to reset the storage state.
 */
export const withClearSessionStorage: Decorator = Story => {
  window.sessionStorage.clear();
  return <Story />;
};

/**
 * This decorator wraps stories so that they are inside a container with the class name "utrecht-document". This is
 * needed so that components inherit the right font.
 */
export const withUtrechtDocument: Decorator = (Story, {parameters}) => (
  <Document
    className="utrecht-document--surface"
    style={{
      '--utrecht-space-around': parameters?.utrechtDocument?.spaceAround ?? 0,
    }}
  >
    <Story />
  </Document>
);

/**
 * Wrap the story in a `FormContext`, replicating the `src/sdk.tsx` behaviour as this is
 * always set up in the real app.
 *
 * The particular form instance/information can be specified through
 * `parameters.formContext.form` or a mock form is used. You can build a form instance
 * quite easily with `import {buildForm} from '@/api-mocks';`.

 */
export const withForm: Decorator = (Story, {parameters}) => {
  const form: Form = parameters?.formContext?.form || buildForm();
  return (
    <FormContext.Provider value={form}>
      <Story />
    </FormContext.Provider>
  );
};

const NO_COMPONENTS: AnyComponentSchema[] = [];

/**
 * Wrap the story in the necessary configuration contexts, replicating the `src/sdk.tsx`
 * entrypoint logic.
 *
 * The configuration values can be updated through story `parameters.config` and `parameters.analyticsToolsParams`.
 */
export const withConfig: Decorator = (Story, {parameters}) => {
  // General configuration
  const DEFAULTS: ConfigContextType = {
    baseUrl: BASE_URL,
    basePath: '',
    clientBaseUrl: '',
    baseTitle: '',
    requiredFieldsWithAsterisk: true,
    authVisible: 'all',
    debug: false,
  };
  const overrides: Partial<ConfigContextType> = parameters?.config || {};
  const configValue: ConfigContextType = {...DEFAULTS, ...overrides};

  // Analytics tool configuration
  const ANALYTICS_DEFAULTS: AnalyticsToolsConfig = {
    govmetricSourceIdFormFinished: '',
    govmetricSourceIdFormAborted: '',
    govmetricSecureGuidFormFinished: '',
    govmetricSecureGuidFormAborted: '',
    enableGovmetricAnalytics: false,
  };
  const analyticsValue: AnalyticsToolsConfig = {
    ...ANALYTICS_DEFAULTS,
    ...(parameters.analyticsToolsParams ?? {}),
  };

  return (
    <ConfigContext.Provider value={configValue}>
      <AnalyticsToolsConfigContext.Provider value={analyticsValue}>
        <FormSettingsProvider
          requiredFieldsWithAsterisk={configValue.requiredFieldsWithAsterisk}
          components={NO_COMPONENTS}
        >
          <Story />
        </FormSettingsProvider>
      </AnalyticsToolsConfigContext.Provider>
    </ConfigContext.Provider>
  );
};

/**
 * Wrap the story in a page layout, providing a grey background and some padding.
 */
export const withPageWrapper: Decorator = Story => (
  <div style={{backgroundColor: '#e6e6e6', padding: '15px'}}>
    <Story />
  </div>
);

/**
 * Wrap the story in a `Card` component container.
 *
 * Card props can be customized through story `parameters.card`.
 */
export const withCard: Decorator = (Story, {parameters: {card: cardProps = {}}}) => (
  <Card {...cardProps}>
    <Story />
  </Card>
);

export const withGeolocationMocking: Decorator = (Story, {parameters}) => {
  const {updateGeolocationPermission} = setupGeolocationMock({
    geolocationPermission: parameters.geolocation.permission,
    geolocationLatitude: parameters.geolocation.latitude,
    geolocationLongitude: parameters.geolocation.longitude,
  });

  // Expose updateGeolocationPermission function
  parameters.geolocation.updatePermission = updateGeolocationPermission;

  return <Story />;
};

export const withModalDecorator: Decorator = (Story, context) => (
  <ModalContext.Provider
    value={{
      // only for storybook integration, do not use this in real apps!
      parentSelector: () => {
        return context.canvasElement;
      },
    }}
  >
    <Story />
  </ModalContext.Provider>
);

export type SubmissionPollInfoArgs = {
  publicReference: string;
  paymentUrl: string;
  reportDownloadUrl: string;
  confirmationPageTitle: string;
  confirmationPageContent: string;
  mainWebsiteUrl: string;
};

export const withSubmissionPollInfo: Decorator<SubmissionPollInfoArgs> = (Story, {args}) => {
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

export const withLiterals: Decorator = (Story, {parameters}) => (
  <LiteralsProvider
    literals={{
      previousText: {resolved: parameters?.literals?.previousText || 'Previous'},
      saveText: {resolved: parameters?.literals?.saveText || 'Save'},
      nextText: {resolved: parameters?.literals?.nextText || 'Next'},
      beginText: {resolved: parameters?.literals?.beginText || 'Start'},
      changeText: {resolved: parameters?.literals?.changeText || 'Change'},
      confirmText: {resolved: parameters?.literals?.confirmText || 'Confirm'},
    }}
  >
    <Story />
  </LiteralsProvider>
);

/**
 * Wrap the Story in a Formik context so that form fields can be included and tested.
 *
 * Behaviour can be customized through `parameters.formik`, with a 'global' killswitch
 * `parameters.formik.disable`. Otheriwse the `initialValues`, `initialErrors` and
 * `initialTouched` props are supported.
 *
 * Use `parameters.formik.wrapForm` to control if the story is wrapped in a `form` tag
 * or not.
 */
export const withFormik: Decorator = (Story, context) => {
  const isDisabled = context.parameters?.formik?.disable ?? false;
  if (isDisabled) {
    return <Story />;
  }
  const initialValues = context.parameters?.formik?.initialValues || {};
  const initialErrors = context.parameters?.formik?.initialErrors || {};
  const initialTouched = context.parameters?.formik?.initialTouched || {};
  const wrapForm = context.parameters?.formik?.wrapForm ?? true;
  const Wrapper = wrapForm ? 'form' : React.Fragment;
  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      initialTouched={initialTouched}
      enableReinitialize
      onSubmit={(values, formikHelpers) => console.log(values, formikHelpers)}
    >
      <Wrapper>
        <Story />
      </Wrapper>
    </Formik>
  );
};
