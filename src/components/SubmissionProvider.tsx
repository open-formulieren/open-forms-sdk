import React, {useContext} from 'react';

import type {Submission} from '@/data/submissions';

interface SubmissionContextType {
  submission: Submission | null;
  onSubmissionObtained: (submission: Submission) => void;
  onDestroySession: () => void;
  removeSubmissionId: () => void;
}

const SubmissionContext = React.createContext<SubmissionContextType>({
  submission: null,
  onSubmissionObtained: () => {},
  onDestroySession: () => {},
  removeSubmissionId: () => {},
});

const SubmissionProvider: React.FC<React.PropsWithChildren<SubmissionContextType>> = ({
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

export const useSubmissionContext = () => useContext(SubmissionContext);

export default SubmissionProvider;
