import PropTypes from 'prop-types';
import React from 'react';
import {Redirect} from 'react-router-dom';

import MaintenanceMode from 'components/MaintenanceMode';
import {ServiceUnavailable} from 'errors';
import {IsFormDesigner} from 'headers';

/**
 * Higher order component to enforce there is an active submission in the state.
 *
 * If there is no submission, the user is forcibly redirected to the start of the form.
 */
const RequireSubmission = ({submission, component: Component, ...props}) => {
  const maintenanceMode = props?.form?.maintenanceMode;
  const userIsFormDesigner = IsFormDesigner.getValue();
  let maintenanceModeAlert = null;
  if (!userIsFormDesigner && maintenanceMode) {
    throw new ServiceUnavailable(
      'Service Unavailable',
      503,
      'Form in maintenance',
      'form-maintenance'
    );
  } else if (userIsFormDesigner && maintenanceMode) {
    maintenanceModeAlert = <MaintenanceMode />;
  }

  if (!submission || !Object.keys(submission).length) {
    return <Redirect to="/" />;
  }
  return (
    <>
      {maintenanceModeAlert}
      <Component submission={submission} {...props} />
    </>
  );
};

RequireSubmission.propTypes = {
  submission: PropTypes.object,
  component: PropTypes.elementType.isRequired,
};

export default RequireSubmission;
