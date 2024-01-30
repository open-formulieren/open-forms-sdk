import {rest} from 'msw';

import {BASE_URL} from './base';

export const mockAnalyticsToolConfigGet = (overrides = {}) =>
  rest.get(`${BASE_URL}analytics/analytics_tools_config_info`, (req, res, ctx) =>
    res(
      ctx.json({
        govmetricSourceId: '',
        govmetricSecureGuid: '',
        enableGovmetricAnalytics: false,
        ...overrides,
      })
    )
  );
