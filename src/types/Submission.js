import PropTypes from 'prop-types';

import {SUBMISSION_ALLOWED} from 'components/constants';


const Submission = PropTypes.shape({
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(PropTypes.object).isRequired, // TODO: define this as well
  nextStep: PropTypes.string,
  submissionAllowed: PropTypes.oneOf(Object.values(SUBMISSION_ALLOWED)).isRequired,
  payment: PropTypes.shape({
    isRequired: PropTypes.bool.isRequired,
    amount: PropTypes.string,
    hasPaid: PropTypes.bool.isRequired,
  }).isRequired,
});

export default Submission;
