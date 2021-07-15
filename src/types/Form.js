import PropTypes from 'prop-types';


const Form = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  loginRequired: PropTypes.bool.isRequired,
  loginOptions: PropTypes.arrayOf(PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    logo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageSrc: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  })).isRequired,
  product: PropTypes.object,
  slug: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  maintenanceMode: PropTypes.bool.isRequired,
  showProgressIndicator: PropTypes.bool.isRequired,
  steps: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    formDefinition: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
});

export default Form;
