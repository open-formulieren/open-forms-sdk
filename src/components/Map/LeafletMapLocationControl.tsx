import {createControlComponent} from '@react-leaflet/core';
import * as Leaflet from 'leaflet';
import type {IntlShape} from 'react-intl';

import {locationControlMessages} from './translations';

interface CreateLocationControlProps extends Leaflet.ControlOptions {
  intl: IntlShape;
}

const createLocationControl = ({intl, position = 'bottomright'}: CreateLocationControlProps) => {
  let link: HTMLAnchorElement | null;

  const LocationControl = Leaflet.Control.extend({
    options: {position},

    _getPermission: (callback: (permission: PermissionState) => void) => {
      navigator.permissions.query({name: 'geolocation'}).then(result => {
        // Return the current permission
        callback(result.state);

        // Return new permission on change
        result.onchange = e => callback((e.target as PermissionStatus).state);
      });
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
      link.title = intl.formatMessage(locationControlMessages.buttonTitle);
      link.ariaLabel = intl.formatMessage(locationControlMessages.buttonLabel);

      Leaflet.DomEvent.on(link, 'click', e => {
        Leaflet.DomEvent.stopPropagation(e);
        Leaflet.DomEvent.preventDefault(e);

        // Trigger "permission popup", and set current location after permission granted
        navigator.geolocation.getCurrentPosition(
          pos =>
            map.setView({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          err => console.error(err)
        );
      });

      // Listen to the current and future permissions, and handle 'denied' state.
      this._getPermission((permission: PermissionState) => {
        if (permission === 'denied') {
          this.disable();
        }
      });
      return container;
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

export default LocationControl;
