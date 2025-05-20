import PropTypes from 'prop-types';
import React, {useContext} from 'react';

import Types from 'types';

const SubmissionContext = React.createContext({
  submission: null,
  onSubmissionObtained: () => {},
  onDestroySession: () => {},
  removeSubmissionId: () => {},
});

const SubmissionProvider = ({
  submission = null,
  onSubmissionObtained,
  onDestroySession,
  removeSubmissionId,
  children,
}) => (
  <SubmissionContext.Provider
    value={{submission, onSubmissionObtained, onDestroySession, removeSubmissionId}}
  >
    {children}
  </SubmissionContext.Provider>
);

SubmissionProvider.propTypes = {
  /**
   * The submission currently being filled out / submitted / viewed. It must exist in
   * the backend session.
   */
  submission: Types.Submission,
  /**
   * Callback for when a submission was (re-)loaded to store it in the state.
   */
  onSubmissionObtained: PropTypes.func.isRequired,
  /**
   * Callback for when an abort/logout/stop button is clicked which terminates the
   * form submission / session.
   */
  onDestroySession: PropTypes.func.isRequired,
  /**
   * Callback to remove the submission reference (it's ID) from the session storage.
   */
  removeSubmissionId: PropTypes.func.isRequired,
};

export const useSubmissionContext = () => useContext(SubmissionContext);

export default SubmissionProvider;
