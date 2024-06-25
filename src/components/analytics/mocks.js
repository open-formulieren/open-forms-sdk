import {rest} from 'msw';

import {buildExpointsUrl} from './utils';

const loaderScript = `
window.lightningjs = {
    require: (name, url) => {
        window.expoints = () => {};
        return window.expoints;
    }
};
`;

export const mockExpointsGetLoaderScript = expointsOrganizationName => {
  const baseUrl = buildExpointsUrl(expointsOrganizationName);
  return rest.get(`${baseUrl}/m/Scripts/dist/expoints-external-loader.min.js`, (req, res, ctx) =>
    res(ctx.text(loaderScript))
  );
};
