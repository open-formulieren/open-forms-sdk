type GeolocationMockParams = {
  geolocationPermission?: PermissionState;
  geolocationLatitude?: number;
  geolocationLongitude?: number;
};

export const setupGeolocationMock = ({
  geolocationPermission = 'granted',
  geolocationLatitude = 52.3857386,
  geolocationLongitude = 4.8417475,
}: GeolocationMockParams) => {
  const originalPermissionsQuery = navigator.permissions?.query;
  let permissionState = geolocationPermission;

  // Fake PermissionStatus object
  const permissionStatus: PermissionStatus = {
    // `PermissionStatus` uses the event listener hooking of `EventTarget`,
    // so we have to add them.
    ...new EventTarget(),
    state: permissionState,
    name: '',
    // The onchange should be overwritten by the code implementing the
    // navigator.permissions.query
    onchange: () => {},
  };

  const updateGeolocationPermission = (newPermission: PermissionState) => {
    if (permissionState !== newPermission) {
      permissionState = newPermission;

      // Set new permission and trigger an onchange event
      Object.defineProperty(permissionStatus, 'state', {value: newPermission});
      permissionStatus.onchange?.(new Event('change'));
    }
  };

  // Mock Permissions API
  if (navigator.permissions?.query) {
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
      getCurrentPosition: (success: PositionCallback, error: PositionErrorCallback) => {
        switch (permissionState) {
          case 'granted':
            success({
              coords: {
                latitude: geolocationLatitude,
                longitude: geolocationLongitude,
              },
            } as GeolocationPosition);
            return;

          case 'prompt':
            // simulate no decision yet → error or no-op
            error?.({
              code: 1,
              message: 'Permission prompt (simulated)',
            } as GeolocationPositionError);
            return;

          case 'denied':
            error?.({
              code: 1, // PERMISSION_DENIED
              message: 'User denied Geolocation',
            } as GeolocationPositionError);
        }
      },
    },
    configurable: true,
  });

  return {updateGeolocationPermission};
};
