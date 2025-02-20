import PropTypes from 'prop-types';

export const GeoJsonGeometry = PropTypes.oneOfType([
  PropTypes.shape({
    type: PropTypes.oneOf(['Point']).isRequired,
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  }),
  PropTypes.shape({
    type: PropTypes.oneOf(['LineString']).isRequired,
    coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  }),
  PropTypes.shape({
    type: PropTypes.oneOf(['Polygon']).isRequired,
    coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)))
      .isRequired,
  }),
]);
