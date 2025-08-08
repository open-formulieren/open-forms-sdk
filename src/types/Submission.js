import PropTypes from 'prop-types';

const Submission = PropTypes.shape({
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(PropTypes.object).isRequired, // TODO: define this as well
  submissionAllowed: PropTypes.string.isRequired,
  payment: PropTypes.shape({
    isRequired: PropTypes.bool.isRequired,
    amount: PropTypes.string,
    hasPaid: PropTypes.bool.isRequired,
  }).isRequired,
});

export default Submission;
