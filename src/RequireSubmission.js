import React from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';


/**
 * Higher order component to enforce there is an active submission in the state.
 *
 * If there is no submission, the user is forcibly redirected to the start of the form.
 */
const RequireSubmission = ({ submission, children }) => {
  if (!submission || !Object.keys(submission).length) {
    return (<Redirect to="/" />);
  }
  return (<>{children}</>);
};

RequireSubmission.propTypes = {
  submission: PropTypes.object,
  children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
  ]),
};


export default RequireSubmission;
