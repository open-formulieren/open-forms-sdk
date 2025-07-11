import PropTypes from 'prop-types';

const ButtonTextLiteral = PropTypes.shape({
  resolved: PropTypes.string.isRequired,
  value: PropTypes.string,
});

export default ButtonTextLiteral;
