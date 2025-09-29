import {createControlComponent} from '@react-leaflet/core';
import * as Leaflet from 'leaflet';
import type {IntlShape} from 'react-intl';
import {injectIntl} from 'react-intl';

import {locationControlMessages} from './translations';

interface CreateLocationControlProps extends Leaflet.ControlOptions {
  intl: IntlShape; // Injected by `injectIntl`
}

const createLocationControl = ({intl, position = 'bottomright'}: CreateLocationControlProps) => {
  let link: HTMLAnchorElement | null;

  const LocationControl = Leaflet.Control.extend({
    options: {position},

    _getPermission: async (callback: (permission: PermissionState) => void) => {
      const permission = await navigator.permissions.query({name: 'geolocation'});

      // Return the current permission
      callback(permission.state);

      // Return new permission on change
      permission.onchange = () => callback(permission.state);
    },

    // Mount the Location control
    onAdd: function (map: Leaflet.Map) {
      const container = Leaflet.DomUtil.create('div', 'leaflet-bar leaflet-control');
      link = Leaflet.DomUtil.create(
        'a',
        `leaflet-control-button fa-solid fa-location-crosshairs`,
        container
      );
      link.href = '#';

      // Listen to the current and future permissions, and update control accordingly.
      this._getPermission((permission: PermissionState) => {
        switch (permission) {
          case 'granted':
          case 'prompt':
            this.enable(map);
            return;

          case 'denied':
            this.disable();
        }
      });
      return container;
    },

    enable: function (map: Leaflet.Map) {
      if (!link) return;

      // Remove any 'disabled' styling or accessibly indicators, and update the titles.
      link.classList.remove('leaflet-disabled');
      link.ariaDisabled = null;
      link.title = intl.formatMessage(locationControlMessages.buttonTitle);
      link.ariaLabel = intl.formatMessage(locationControlMessages.buttonLabel);

      // Remove any previous event handlers and add a "trigger geolocation request" click handler
      Leaflet.DomEvent.off(link);
      Leaflet.DomEvent.on(link, 'click', e => {
        Leaflet.DomEvent.stopPropagation(e);
        Leaflet.DomEvent.preventDefault(e);

        // Trigger "permission popup", and set current location after permission granted
        navigator.geolocation.getCurrentPosition(pos =>
          map.setView({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        );
      });
    },

    // Disable the Location control
    disable: function () {
      if (!link) return;

      // Update styling and accessibility to reflect the 'disabled' state
      link.classList.add('leaflet-disabled');
      link.ariaDisabled = 'true';
      link.title = intl.formatMessage(locationControlMessages.buttonTitleDisabled);
      link.ariaLabel = intl.formatMessage(locationControlMessages.buttonLabelDisabled);

      // Remove any previous event handlers and add a "do nothing" click handler
      Leaflet.DomEvent.off(link);
      Leaflet.DomEvent.on(link, 'click', e => {
        Leaflet.DomEvent.stopPropagation(e);
        Leaflet.DomEvent.preventDefault(e);
      });
    },
  });

  return new LocationControl();
};

const LocationControl: React.FC<CreateLocationControlProps> =
  createControlComponent(createLocationControl);

export default injectIntl(LocationControl);
