import React, {useContext} from 'react';

import type {Submission} from '@/data/submissions';

export interface SubmissionContextType {
  submission: Submission | null;
  onSubmissionObtained: (submission: Submission) => void;
  onDestroySession: () => Promise<void>;
  removeSubmissionId: () => void;
}

const SubmissionContext = React.createContext<SubmissionContextType>({
  submission: null,
  onSubmissionObtained: () => {},
  onDestroySession: async () => {},
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

export function assertSubmission(submission: Submission | null): asserts submission is Submission {
  if (!submission) throw new Error('A submission must be available in the context');
}

export default SubmissionProvider;
