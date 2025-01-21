import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {useIntl} from 'react-intl';
import {useAsync} from 'react-use';

import {ConfigContext} from 'Context';
import {get} from 'api';

export const AnalyticsToolsConfigContext = React.createContext({
  govmetricSourceIdFormFinished: '',
  govmetricSourceIdFormAborted: '',
  govmetricSecureGuidFormFinished: '',
  govmetricSecureGuidFormAborted: '',
  enableGovmetricAnalytics: false,
});

AnalyticsToolsConfigContext.displayName = 'AnalyticsToolsConfigContext';

const AnalyticsToolsConfigProvider = ({children}) => {
  const {locale} = useIntl();
  const {baseUrl} = useContext(ConfigContext);

  const {value} = useAsync(async () => {
    return await get(`${baseUrl}analytics/analytics-tools-config-info`);
  }, [baseUrl, locale]);

  return (
    <AnalyticsToolsConfigContext.Provider value={value}>
      {children}
    </AnalyticsToolsConfigContext.Provider>
  );
};

AnalyticsToolsConfigProvider.propTypes = {
  children: PropTypes.node,
};

export const useAnalyticsToolsConfig = () => useContext(AnalyticsToolsConfigContext);

export default AnalyticsToolsConfigProvider;
