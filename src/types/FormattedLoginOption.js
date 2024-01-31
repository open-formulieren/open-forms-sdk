import PropTypes from 'prop-types';

const FormattedLoginOption = PropTypes.shape({
  identifier: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  url: PropTypes.string,
  logo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    href: PropTypes.string,
    appearance: PropTypes.bool,
  }),
  isForGemachtigde: PropTypes.bool,
});

export default FormattedLoginOption;
