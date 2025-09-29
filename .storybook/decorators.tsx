import type {Decorator} from '@storybook/react';
import {Document} from '@utrecht/component-library-react';

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
