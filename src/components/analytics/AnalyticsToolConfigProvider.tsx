import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import {get} from 'api';

export interface AnalyticsToolsConfig {
  govmetricSourceIdFormFinished: string;
  govmetricSourceIdFormAborted: string;
  govmetricSecureGuidFormFinished: string;
  govmetricSecureGuidFormAborted: string;
  enableGovmetricAnalytics: boolean;
}

const defaultConfig: AnalyticsToolsConfig = {
  govmetricSourceIdFormFinished: '',
  govmetricSourceIdFormAborted: '',
  govmetricSecureGuidFormFinished: '',
  govmetricSecureGuidFormAborted: '',
  enableGovmetricAnalytics: false,
};

export const AnalyticsToolsConfigContext = React.createContext<AnalyticsToolsConfig>(defaultConfig);

AnalyticsToolsConfigContext.displayName = 'AnalyticsToolsConfigContext';

export interface AnalyticsToolsConfigProviderProps {
  children?: React.ReactNode;
}

const AnalyticsToolsConfigProvider: React.FC<AnalyticsToolsConfigProviderProps> = ({children}) => {
  const {locale} = useIntl();
  const {baseUrl} = useContext(ConfigContext);

  // we deliberately don't handle the loading or error state - these are non fatal situations.
  const {value = defaultConfig} = useAsync(async () => {
    const config = await get<AnalyticsToolsConfig>(
      `${baseUrl}analytics/analytics-tools-config-info`
    );
    return config!;
  }, [baseUrl, locale]);

  return (
    <AnalyticsToolsConfigContext.Provider value={value}>
      {children}
    </AnalyticsToolsConfigContext.Provider>
  );
};

export const useAnalyticsToolsConfig = () => useContext(AnalyticsToolsConfigContext);

export default AnalyticsToolsConfigProvider;
