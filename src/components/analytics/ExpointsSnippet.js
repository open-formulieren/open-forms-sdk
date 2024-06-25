import {useContext} from 'react';

import {AnalyticsToolsConfigContext} from 'Context';

import {buildExpointsUrl} from './utils';

const ExpointsSnippet = () => {
  const {
    enableExpointsAnalytics,
    expointsOrganizationName,
    expointsConfigUuid,
    expointsUseTestMode,
  } = useContext(AnalyticsToolsConfigContext);

  if (!enableExpointsAnalytics) return null;

  const expointsBaseUrl = buildExpointsUrl(expointsOrganizationName);

  if (!document.querySelector('#expoints')) {
    let scriptConfig = {instanceUrl: expointsBaseUrl};
    if (expointsUseTestMode) scriptConfig.isTest = true;

    var exp = document.createElement('script');
    exp.id = 'expoints';
    exp.type = 'text/javascript';
    exp.async = true;
    exp.onload = function () {
      window.expoints = window.lightningjs.require(
        'expoints',
        `${expointsBaseUrl}/m/Scripts/dist/expoints-external.min.js`
      );
      window.expoints('start', expointsConfigUuid, scriptConfig);
    };
    exp.src = `${expointsBaseUrl}/m/Scripts/dist/expoints-external-loader.min.js`;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(exp, s);
  }

  return;
};

export default ExpointsSnippet;
