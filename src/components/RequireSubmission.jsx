import PropTypes from 'prop-types';
import {Navigate} from 'react-router-dom';

import {useSubmissionContext} from 'components/Form';
import MaintenanceMode from 'components/MaintenanceMode';
import {ServiceUnavailable} from 'errors';
import {IsFormDesigner} from 'headers';
import useFormContext from 'hooks/useFormContext';

/**
 * Higher order component to enforce there is an active submission in the state.
 *
 * If there is no submission, the user is forcibly redirected to the start of the form.
 *
 * Provide either the component or children prop to render the actual content. The
 * `component` prop is deprecated in favour of specifying explicit elements.
 */
const RequireSubmission = ({
  retrieveSubmissionFromContext = false,
  submission: submissionFromProps,
  children,
  component: Component,
  ...props
}) => {
  const {maintenanceMode} = useFormContext();
  const {submission: submissionFromContext} = useSubmissionContext();

  const submission = retrieveSubmissionFromContext ? submissionFromContext : submissionFromProps;

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
      {children ?? <Component submission={submission} {...props} />}
    </>
  );
};

RequireSubmission.propTypes = {
  retrieveSubmissionFromContext: PropTypes.bool,
  /**
   * Submission (or null-ish) to test if there's an active submission.
   * @deprecated - grab it from the context via `retrieveSubmissionFromContext` instead.
   */
  submission: PropTypes.object,
  children: PropTypes.node,
  /**
   * Component to render with the provided props. If children are provided, those get
   * priority.
   * @deprecated
   */
  component: PropTypes.elementType,
};

export default RequireSubmission;
