import FormSettingsProvider from '@open-formulieren/formio-renderer/components/FormSettingsProvider';
import {Formik} from 'formik';
import merge from 'lodash/merge';
import {useEffect} from 'react';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm} from 'api-mocks';
import Card from 'components/Card';
import {LiteralsProvider} from 'components/Literal';
import {SubmissionStatusContext} from 'components/PostCompletionViews';
import {AnalyticsToolsConfigContext} from 'components/analytics/AnalyticsToolConfigProvider';
import {ModalContext} from 'components/modals/Modal';

const NO_COMPONENTS = [];

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
      <FormSettingsProvider
        requiredFieldsWithAsterisk={value.requiredFieldsWithAsterisk}
        components={NO_COMPONENTS}
      >
        <Story />
      </FormSettingsProvider>
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

export const mockGeolocationDecorator = (Story, {args}) => {
  const originalPermissionsQuery = navigator.permissions?.query;
  const originalGeolocation = navigator.geolocation;

  let permission = args.geolocationPermission ?? 'granted';

  // Mock permission status
  const permissionStatus = {
    state: permission,
  };

  // Expose a helper to update permission status
  args._updateGeolocationPermission = newPermission => {
    if (permission !== newPermission) {
      permission = newPermission;
      permissionStatus.state = newPermission;
      permissionStatus.onchange?.({target: {state: newPermission}});
    }
  };

  // Mock Permissions API
  if (navigator.permissions) {
    navigator.permissions.query = params => {
      if (params.name === 'geolocation') {
        return Promise.resolve(permissionStatus);
      }
      return originalPermissionsQuery(params);
    };
  }

  // Mock Geolocation
  Object.defineProperty(navigator, 'geolocation', {
    value: {
      getCurrentPosition: (success, error) => {
        switch (permission) {
          case 'granted':
            success({
              coords: {
                latitude: args.geolocationLatitude ?? 52.3857386,
                longitude: args.geolocationLongitude ?? 4.8417475,
              },
            });
            return;

          case 'prompt':
            // simulate no decision yet → error or no-op
            error?.({
              code: 1,
              message: 'Permission prompt (simulated)',
            });
            return;

          case 'denied':
            error?.({
              code: 1, // PERMISSION_DENIED
              message: 'User denied Geolocation',
            });
        }
      },
    },
    configurable: true,
  });

  // Render story with cleanup wrapper
  return (
    <CleanupWrapper
      restore={() => {
        // Restore permissions API and Geolocation after unmount (important!)
        if (navigator.permissions) {
          navigator.permissions.query = originalPermissionsQuery;
        }
        Object.defineProperty(navigator, 'geolocation', {
          value: originalGeolocation,
          configurable: true,
        });
      }}
    >
      <Story />
    </CleanupWrapper>
  );
};

const CleanupWrapper = ({children, restore}) => {
  useEffect(() => {
    return () => {
      restore();
    };
  }, [restore]);

  return children;
};
