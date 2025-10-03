import FormSettingsProvider from '@open-formulieren/formio-renderer/components/FormSettingsProvider.js';
import type {AnyComponentSchema} from '@open-formulieren/types';
import type {Decorator} from '@storybook/react';
import {Document} from '@utrecht/component-library-react';

import {ConfigContext} from '@/Context';
import type {ConfigContextType} from '@/Context';
import {BASE_URL} from '@/api-mocks';
import {AnalyticsToolsConfigContext} from '@/components/analytics/AnalyticsToolConfigProvider';
import type {AnalyticsToolsConfig} from '@/components/analytics/AnalyticsToolConfigProvider';

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
