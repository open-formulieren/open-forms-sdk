import React from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';


/**
 * Higher order component to enforce there is an active submission in the state.
 *
 * If there is no submission, the user is forcibly redirected to the start of the form.
 */
const RequireSubmission = ({ submission, component: Component, ...props }) => {
  if (!submission || !Object.keys(submission).length) {
    return (<Redirect to="/" />);
  }
  return (
    <Component submission={submission} {...props} />
  );
};

RequireSubmission.propTypes = {
  submission: PropTypes.object,
  component: PropTypes.elementType.isRequired,
};


export default RequireSubmission;
