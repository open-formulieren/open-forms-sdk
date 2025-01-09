import * as Leaflet from 'leaflet';
import {defineMessages} from 'react-intl';

const searchControlMessages = defineMessages({
  buttonLabel: {
    description: "The leaflet map's search button areaLabel text.",
    defaultMessage: 'Map component search button',
  },
  searchLabel: {
    description: "The leaflet map's input fields placeholder message.",
    defaultMessage: 'Enter address, please',
  },
  notFound: {
    description: "The leaflet map's location not found message.",
    defaultMessage: 'Sorry, that address could not be found.',
  },
});

const leafletGestureHandlingText = defineMessages({
  touch: {
    description: 'Gesturehandeling phone touch message.',
    defaultMessage: 'Use two fingers to move the map',
  },
  scroll: {
    description: 'Gesturehandeling pc scroll message.',
    defaultMessage: 'Use ctrl + scroll to zoom the map',
  },
  scrollMac: {
    description: 'Gesturehandeling mac scroll message.',
    defaultMessage: 'Use \u2318 + scroll to zoom the map',
  },
});

const leafletEditToolbarMessages = defineMessages({
  saveText: {
    description: 'Edit toolbar save message.',
    defaultMessage: 'Save',
  },
  saveTitle: {
    description: 'Edit toolbar save tooltip.',
    defaultMessage: 'Save changes',
  },
  cancelText: {
    description: 'Edit toolbar cancel message.',
    defaultMessage: 'Cancel',
  },
  cancelTitle: {
    description: 'Edit toolbar cancel tooltip.',
    defaultMessage: 'Cancel changes',
  },
  clearAllText: {
    description: 'Edit toolbar clearAll message.',
    defaultMessage: 'Remove all',
  },
  clearAllTitle: {
    description: 'Edit toolbar clearAll tooltip.',
    defaultMessage: 'Remove all shapes',
  },
  remove: {
    description: 'Edit toolbar remove button tooltip.',
    defaultMessage: 'Remove shapes',
  },
  removeDisabled: {
    description: 'Edit toolbar remove button disabled tooltip.',
    defaultMessage: 'No shapes to remove',
  },
});

const leafletDrawToolbarMessages = defineMessages({
  actionsText: {
    description: 'Draw toolbar cancel button message.',
    defaultMessage: 'Cancel',
  },
  actionsTitle: {
    description: 'Draw toolbar cancel button tooltip.',
    defaultMessage: 'Cancel drawing',
  },
  finishText: {
    description: 'Draw toolbar finish button message.',
    defaultMessage: 'Finish',
  },
  finishTitle: {
    description: 'Draw toolbar finish button tooltip.',
    defaultMessage: 'Finish drawing',
  },
  undoText: {
    description: 'Draw toolbar undo button message.',
    defaultMessage: 'Remove last point',
  },
  undoTitle: {
    description: 'Draw toolbar undo button tooltip.',
    defaultMessage: 'Remove last drawn point',
  },
  polyline: {
    description: 'Draw toolbar polyline button tooltip.',
    defaultMessage: 'Line',
  },
  polygon: {
    description: 'Draw toolbar polygon button tooltip.',
    defaultMessage: 'Shape (polygon)',
  },
  marker: {
    description: 'Draw toolbar marker button tooltip.',
    defaultMessage: 'Marker',
  },
});

const leafletDrawHandlerMessages = defineMessages({
  markerTooltipStart: {
    description: 'Draw handler marker tooltip start.',
    defaultMessage: 'Click map to place marker',
  },
  polylineTooltipStart: {
    description: 'Draw handler polyline tooltip start.',
    defaultMessage: 'Click to start drawing line',
  },
  polylineTooltipContinue: {
    description: 'Draw handler polyline tooltip continue.',
    defaultMessage: 'Click to continue drawing line',
  },
  polylineTooltipEnd: {
    description: 'Draw handler polyline tooltip end.',
    defaultMessage: 'Click last point to finish line',
  },
  polygonTooltipStart: {
    description: 'Draw handler polygon tooltip start.',
    defaultMessage: 'Click to start drawing shape',
  },
  polygonTooltipContinue: {
    description: 'Draw handler polygon tooltip continue.',
    defaultMessage: 'Click to continue drawing shape',
  },
  polygonTooltipEnd: {
    description: 'Draw handler polygon tooltip end.',
    defaultMessage: 'Click first point to finish shape',
  },
});

const applyLeafletTranslations = intl => {
  // We have to do the translations via Leaflet
  // https://github.com/alex3165/react-leaflet-draw/issues/179
  Leaflet.drawLocal.edit.toolbar = {
    actions: {
      save: {
        text: intl.formatMessage(leafletEditToolbarMessages.saveText),
        title: intl.formatMessage(leafletEditToolbarMessages.saveTitle),
      },
      cancel: {
        text: intl.formatMessage(leafletEditToolbarMessages.cancelText),
        title: intl.formatMessage(leafletEditToolbarMessages.cancelTitle),
      },
      clearAll: {
        text: intl.formatMessage(leafletEditToolbarMessages.clearAllText),
        title: intl.formatMessage(leafletEditToolbarMessages.clearAllTitle),
      },
    },
    buttons: {
      remove: intl.formatMessage(leafletEditToolbarMessages.remove),
      removeDisabled: intl.formatMessage(leafletEditToolbarMessages.removeDisabled),
    },
  };
  Leaflet.drawLocal.draw.toolbar = {
    actions: {
      text: intl.formatMessage(leafletDrawToolbarMessages.actionsText),
      title: intl.formatMessage(leafletDrawToolbarMessages.actionsTitle),
    },
    finish: {
      text: intl.formatMessage(leafletDrawToolbarMessages.finishText),
      title: intl.formatMessage(leafletDrawToolbarMessages.finishTitle),
    },
    undo: {
      text: intl.formatMessage(leafletDrawToolbarMessages.undoText),
      title: intl.formatMessage(leafletDrawToolbarMessages.undoTitle),
    },
    buttons: {
      polyline: intl.formatMessage(leafletDrawToolbarMessages.polyline),
      polygon: intl.formatMessage(leafletDrawToolbarMessages.polygon),
      marker: intl.formatMessage(leafletDrawToolbarMessages.marker),
    },
  };
  Leaflet.drawLocal.draw.handlers.marker = {
    tooltip: {
      start: intl.formatMessage(leafletDrawHandlerMessages.markerTooltipStart),
    },
  };
  Leaflet.drawLocal.draw.handlers.polyline = {
    tooltip: {
      start: intl.formatMessage(leafletDrawHandlerMessages.polylineTooltipStart),
      cont: intl.formatMessage(leafletDrawHandlerMessages.polylineTooltipContinue),
      end: intl.formatMessage(leafletDrawHandlerMessages.polylineTooltipEnd),
    },
  };
  Leaflet.drawLocal.draw.handlers.polygon = {
    tooltip: {
      start: intl.formatMessage(leafletDrawHandlerMessages.polygonTooltipStart),
      cont: intl.formatMessage(leafletDrawHandlerMessages.polygonTooltipContinue),
      end: intl.formatMessage(leafletDrawHandlerMessages.polygonTooltipEnd),
    },
  };
};

export {searchControlMessages, leafletGestureHandlingText, applyLeafletTranslations};
