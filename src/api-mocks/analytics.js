import {HttpResponse, http} from 'msw';

import {BASE_URL} from './base';

export const mockAnalyticsToolConfigGet = (overrides = {}) =>
  http.get(`${BASE_URL}analytics/analytics_tools_config_info`, () =>
    HttpResponse.json({
      govmetricSourceId: '',
      govmetricSecureGuid: '',
      enableGovmetricAnalytics: false,
      ...overrides,
    })
  );
