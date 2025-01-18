import PropTypes from 'prop-types';
import {Navigate} from 'react-router-dom';

import MaintenanceMode from 'components/MaintenanceMode';
import {useSubmissionContext} from 'components/SubmissionProvider';
import {ServiceUnavailable} from 'errors';
import {IsFormDesigner} from 'headers';
import useFormContext from 'hooks/useFormContext';

/**
 * Wrapper component to enforce there is an active submission in the state.
 *
 * If there is no submission, the user is forcibly redirected to the start of the form,
 * or an error is thrown if the form is temporarily unavailable. Ensure you wrap the
 * component in an error boundary that can handle these.
 *
 * The submission is taken from the context set via the `SubmissionProvider` component.
 * Pass the content to render if there's a submission/session via the `children` prop,
 * e.g.:
 *
 *     <RequireSubmission>
 *       <MyProtectedView />
 *     </RequireSubmission>
 */
const RequireSubmission = ({children}) => {
  const {maintenanceMode} = useFormContext();
  const {submission} = useSubmissionContext();

  const userIsFormDesigner = IsFormDesigner.getValue();
  if (!userIsFormDesigner && maintenanceMode) {
    throw new ServiceUnavailable(
      'Service Unavailable',
      503,
      'Form in maintenance',
      'form-maintenance'
    );
  }

  if (!submission || !Object.keys(submission).length) {
    return <Navigate replace to="/" />;
  }

  return (
    <>
      {userIsFormDesigner && maintenanceMode && <MaintenanceMode />}
      {children}
    </>
  );
};

RequireSubmission.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireSubmission;
